import {z} from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {procedure, router} from "./trpc";
import prisma from "@/libs/db";
// import { diff } from "json-diff-ts";
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const appRouter = router({
    register: procedure
        .input(
            z.object({
                username: z.string().max(20),
                password: z.string().min(6).max(80),
                phone: z
                    .string()
                    .max(20)
                    .regex(
                        /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}$/,
                        { message: "无效的电话号码格式" }
                    ),
                remark: z.string().max(50).optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const { username, password, phone, remark } = input;

            const existingUserByUsername = await prisma.user.findFirst({
                where: { username },
            });
            if (existingUserByUsername) {
                throw new Error("注册失败！该用户名已存在");
            }
            const existingUserByPhone = await prisma.user.findFirst({
                where: { phone },
            });
            if (existingUserByPhone) {
                throw new Error("注册失败！该手机号已注册");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    phone,
                    level: 1,
                    remark: remark || ""
                },
            });

            return {
                msg: "注册成功！",
                user: {
                    id: user.id,
                    username: user.username,
                },
            };
        }),
    login: procedure
        .input(
            z.object({
                username: z.string().min(1, { message: "用户名不能为空" }).max(20),
                password: z.string().min(1, { message: "密码不能为空" }).max(80),
            })
        )
        .mutation(async ({ input }) => {
            const { username, password } = input;

            const user = await prisma.user.findFirst({
                where: { username },
            });
            if (!user) {
                throw new Error("登陆失败！用户名或密码错误");
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error("登陆失败！用户名或密码错误");
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });

            return {
                msg: "请求成功！",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                },
            };
        }),
    sendVerificationCode: procedure
        .input(
            z.object({
                phone: z
                    .string()
                    .max(20)
                    .regex(
                        /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}$/,
                        { message: "无效的电话号码格式" }
                    ),
            })
        )
        .mutation(async ({ input }) => {
            // TODO 发送验证码的逻辑
        }),
    resetPassword: procedure
        .input(
            z.object({
                phone: z
                    .string()
                    .max(20)
                    .regex(
                        /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}$/,
                        { message: "无效的电话号码格式" }
                    ),
                verificationCode: z.string().min(6),
                newPassword: z.string().min(1, { message: "密码不能为空" }).max(80)
            })
        )
        .mutation(async ({ input }) => {
            // TODO 验证验证码并重置密码的逻辑
        }),
    devices: procedure.query(async ({ ctx }) => {
        const userId = ctx.id;

        const devices = await prisma.device.findMany({
            where: { user_id: userId }, // 根据用户ID查询
        });

        if (devices.length === 0) {
            return [];
        }

        const deviceLogIds = devices.map((item: any) => item.latest_device_log_id);
        const deviceLogs = await prisma.device_log.findMany({
            where: {
                id: {
                    in: deviceLogIds,
                },
            },
        });

        const latestLogsMap = new Map<string, typeof deviceLogs[0]>();
        for (const log of deviceLogs) {
            if (log.device_id && !latestLogsMap.has(log.device_id)) {
                latestLogsMap.set(log.device_id, log);
            }
        }

        return devices.map((device: any) => ({
            ...device,
            device_log: latestLogsMap.get(device.device_id) || null,
        }));
    }),
  device: procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const device = await prisma.device.findUnique({
        where: {
          device_id: input.id,
        },
      });
      if (!device) {
          return null;
      }
      const lastLog = await prisma.device_log.findUnique({
        where: {
          id: device.latest_device_log_id,
        },
      });
      const lastChangeLog = await prisma.device_change_log.findFirst({
        where: {
          device_id: device.device_id,
        },
        orderBy: {
          update_time: 'desc'
        }
      });
      return {
        device,
        lastLog,
        lastChangeLog
      };
    }),
  createDevice: procedure
      .input(
          z.object({
            device_id: z.string().max(18),
            latest_device_log_id: z.number().optional(),
            intranet_array: z.string().max(300),
            extranet_array: z.string().max(300),
            heartbeat: z.string().max(3),
            is_online: z.boolean(),
            serial_tx: z.string().max(200),
            alias_name: z.string().max(20).optional(),
          }),
      )
      .mutation(async ({ input }) => {
        return prisma.device.create({
            data: {
                ...input,
                latest_device_log_id: input.latest_device_log_id ?? 0,
                alias_name: input.alias_name ?? ''
            }
        });
      }),
    updateDeviceAlias: procedure
        .input(
            z.object({
                device_id: z.string().max(18),
                alias_name: z.string().max(20),
            })
        )
        .mutation(async ({ input, ctx}) => {
            const { device_id, alias_name } = input;
            const userId = ctx.id;

            // 查找设备，确保它没有关联的用户或用户是自己
            const device = await prisma.device.findUnique({
                where: { device_id },
            });

            if (!device) {
                throw new Error("设备未找到");
            }

            if (device.user_id && device.user_id !== userId) {
                throw new Error("您没有权限更新此设备");
            }

            // 更新设备的 alias_name 并关联用户
            const updatedDevice = await prisma.device.update({
                where: { device_id },
                data: {
                    alias_name,
                    user_id: userId, // 关联当前用户
                },
            });

            return {
                msg: "设备别名更新成功",
                device: updatedDevice,
            };
        }),
  updateDevice: procedure
      .input(
          z.object({
            device_id: z.string().max(18),
            latest_device_log_id: z.number().optional(),
            intranet_array: z.string().max(300).optional(),
            extranet_array: z.string().max(300).optional(),
            heartbeat: z.string().max(3).optional(),
            is_online: z.boolean().optional(),
            serial_tx: z.string().max(200).optional(),
            alias_name: z.string().max(20).optional(),
          }),
      )
      .mutation(async ({ input }) => {
        const { device_id, ...updateData } = input;
        return prisma.device.update({
          where: {device_id},
          data: updateData,
        });
      }),
  deleteDevice: procedure
      .input(
          z.object({
            device_id: z.string().max(18),
          }),
      )
      .mutation(async ({ input }) => {
        return prisma.device.delete({
          where: {device_id: input.device_id},
        });
      }),
  deviceLogs: procedure.input(
      z.object({
        device_id: z.string()
      })
  ).query(async ({ input }) => {
    return prisma.device_log.findMany({
      where: {
        device_id: input.device_id,
      },
      take: 100,
      orderBy: {
        update_time: "desc",
      },
    })
  }),
  deviceChangeLog: procedure
    .input(
      z.object({
        device_id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // for (let log of logs) {
      //   const before = await prisma.device_change_log.findUniqueOrThrow({
      //     where: {
      //       id: log.device_log_before,
      //     },
      //   });
      //   const after = await prisma.device_change_log.findUniqueOrThrow({
      //     where: {
      //       id: log.device_log_after,
      //     },
      //   });
      //   // log.diff = diff(log.old_data, log.new_data);
      // }
      return prisma.device_change_log.findMany({
        where: {
          device_id: input.device_id,
        },
        take: 5,
        orderBy: {
          update_time: "desc",
        },
      });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
