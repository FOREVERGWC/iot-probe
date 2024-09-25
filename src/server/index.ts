import { Client } from "tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_client";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { procedure, router } from "./trpc";
import prisma from "@/libs/db";
import { Parser } from "json2csv";
import {base64Decode, formattedDate} from "@/utils/time";
// import { diff } from "json-diff-ts";
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const SECRET_Id = process.env.TENCENTCLOUD_SECRET_ID || '';
const SECRET_Key = process.env.TENCENTCLOUD_SECRET_KEY || '';
const SMS_SDK_APP_ID = process.env.SMS_SDK_APP_ID || '';
const TEMPLATE_ID = process.env.TEMPLATE_ID || '';
const SIGN_NAME = process.env.SIGN_NAME || '';

const clientConfig = {
    credential: {
        secretId: SECRET_Id,
        secretKey: SECRET_Key,
    },
    region: "ap-nanjing",
    profile: {
        httpProfile: {
            endpoint: "sms.tencentcloudapi.com",
        },
    },
};

const client = new Client(clientConfig);

export const appRouter = router({
    register: procedure
        .input(
            z.object({
                username: z.string().max(20),
                password: z.string()
                    .min(6, { message: "密码至少需要 6 个字符" })
                    .max(80, { message: "密码至多需要 20 个字符" })
                    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\S]+$/, {
                        message: "密码必须包含字母和数字"
                    }),
                phone: z
                    .string()
                    .max(20)
                    .regex(
                        /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}$/,
                        { message: "无效的电话号码格式" }
                    ),
                remark: z.string().max(50).optional(),
                code: z.string().min(1)
            }),
        )
        .mutation(async ({ input }) => {
            const { username, password, phone, remark, code } = input;

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
            // 查询验证码
            const verificationCode = await prisma.code.findFirst({
                where: {
                    phone,
                    expires_at: {
                        gt: new Date(), // 确保验证码未过期
                    },
                },
                orderBy: {
                    expires_at: 'desc',
                },
            });

            if (!verificationCode || verificationCode.code !== code) {
                throw new Error("验证码无效或已过期，请重新获取验证码。");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    phone,
                    level: 1,
                    remark: remark || ''
                },
            });

            await prisma.user_role_link.create({
                data: {
                    user_id: user.id,
                    role_id: 2
                }
            })

            return {
                msg: '注册成功！',
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
                include: {
                    user_role_links: true
                }
            });
            console.log(user)
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
                    username: user.username
                },
                roleIdList: user.user_role_links.map(item => item.role_id) || []
            };
        }),
    sendVerificationCode: procedure
        .input(
            z.object({
                phone: z.string().max(20).regex(/^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}?\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/, { message: "无效的电话号码格式" }),
            })
        )
        .mutation(async ({ input }) => {
            const { phone } = input;

            // 检查是否在两分钟内已经发送过验证码
            const existingCode = await prisma.code.findFirst({
                where: {
                    phone,
                    expires_at: {
                        gt: new Date(), // 找到未过期的验证码
                    },
                },
                orderBy: {
                    expires_at: 'desc',
                },
            });

            if (existingCode) {
                throw new Error("验证码已发送，请稍后再试。");
            }

            // 生成随机的四位验证码
            const code = Math.floor(1000 + Math.random() * 9000).toString();

            const params = {
                "PhoneNumberSet": [phone],
                "SmsSdkAppId": SMS_SDK_APP_ID,
                "TemplateId": TEMPLATE_ID,
                "SignName": SIGN_NAME,
                "TemplateParamSet": [code, '2'], // '2' 是验证码的有效期分钟数
            } as any;

            try {
                const data = await client.SendSms(params);

                await prisma.code.create({
                    data: {
                        phone: phone,
                        code: code,
                        expires_at: new Date(Date.now() + 2 * 60 * 1000), // 验证码有效期为2分钟
                    },
                });

                return {
                    msg: "验证码发送成功",
                };
            } catch (err) {
                throw new Error("验证码发送失败，请重试。");
            }
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
                verificationCode: z.string().min(4),
                newPassword: z.string()
                    .min(6, { message: "密码至少需要 6 个字符" })
                    .max(80, { message: "密码至多需要 20 个字符" })
                    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\S]+$/, {
                        message: "密码必须包含字母和数字",
                    })
            })
        )
        .mutation(async ({ input }) => {
            const { phone, verificationCode, newPassword } = input;

            // 查询验证码
            const verificationRecord = await prisma.code.findFirst({
                where: {
                    phone,
                    expires_at: {
                        gt: new Date(), // 确保验证码未过期
                    },
                },
                orderBy: {
                    expires_at: 'desc',
                },
            });

            // 验证验证码是否有效
            if (!verificationRecord || verificationRecord.code !== verificationCode) {
                throw new Error("验证码无效或已过期，请重新获取验证码。");
            }

            // 如果验证码有效，则加密新密码
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // 更新用户密码
            const updatedUser = await prisma.user.updateMany({
                where: { phone },
                data: { password: hashedPassword },
            });

            if (updatedUser.count === 0) {
                throw new Error("重置密码失败，用户不存在。");
            }

            return {
                msg: "密码重置成功！",
            };
        }),
    /**
     * 查询全部设备
     */
    devices: procedure.query(async ({ ctx }) => {
        const userId = ctx.id;
        const roleIdList = ctx.roleIdList;

        const devices = await prisma.device.findMany({
            where: roleIdList.includes(1) ? {} : { user_id: userId }
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

        const deviceLogCounts = await prisma.device_log.groupBy({
            by: ['device_id'],
            _count: {
                device_id: true,
            },
            where: {
                device_id: {
                    in: devices.map((device: any) => device.device_id),
                },
            },
        });
        const logCountMap = new Map<string, number>();
        for (const logCount of deviceLogCounts) {
            if (logCount.device_id !== null) {
                logCountMap.set(logCount.device_id, logCount._count.device_id);
            }
        }

        return devices.map((device: any) => ({
            ...device,
            device_log_num: logCountMap.get(device.device_id) || 0,
            device_log: latestLogsMap.get(device.device_id) || null,
        }));
    }),
    /**
     * 查询我的设备
     */
    myDevices: procedure
        .query(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;

            const devices = await prisma.device.findMany({
                where: { user_id: userId }
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

            const deviceLogCounts = await prisma.device_log.groupBy({
                by: ['device_id'],
                _count: {
                    device_id: true,
                },
                where: {
                    device_id: {
                        in: devices.map((device: any) => device.device_id),
                    },
                },
            });
            const logCountMap = new Map<string, number>();
            for (const logCount of deviceLogCounts) {
                if (logCount.device_id !== null) {
                    logCountMap.set(logCount.device_id, logCount._count.device_id);
                }
            }

            return devices.map((device: any) => ({
                ...device,
                device_log_num: logCountMap.get(device.device_id) || 0,
                device_log: latestLogsMap.get(device.device_id) || null,
            }));
        }),
    /**
     * 查询设备信息
     */
    device: procedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { id: device_id } = input;
            let device = await prisma.device.findUnique({
                where: { device_id },
            });
            if (!device) {
                throw new Error('查询失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id && device.user_id !== null) {
                throw new Error('查询失败！无操作权限')
            }
            const firstLog = await prisma.device_log.findFirst({
                where: {
                  device_id: device.device_id,
                },
                orderBy: { update_time: 'asc' }
            })
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
                firstLog,
                lastLog,
                lastChangeLog
            };
    }),
  // createDevice: procedure
  //     .input(
  //         z.object({
  //           device_id: z.string().max(18),
  //           latest_device_log_id: z.number().optional(),
  //           intranet_array: z.string().max(300),
  //           extranet_array: z.string().max(300),
  //           heartbeat: z.string().max(3),
  //           is_online: z.boolean(),
  //           serial_tx: z.string().max(200),
  //           alias_name: z.string().max(20).optional(),
  //         }),
  //     )
  //     .mutation(async ({ input }) => {
  //       return prisma.device.create({
  //           data: {
  //               ...input,
  //               latest_device_log_id: input.latest_device_log_id ?? 0,
  //               alias_name: input.alias_name ?? ''
  //           }
  //       });
  //     }),
    /**
     * 更新设备别名
     */
    updateDeviceAlias: procedure
        .input(
            z.object({
                device_id: z.string().max(18),
                alias_name: z.string().max(20),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { device_id, alias_name } = input;
            let device = await prisma.device.findUnique({
                where: { device_id },
            });
            if (!device) {
                throw new Error('更新失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id && device.user_id !== null) {
                throw new Error('更新失败！无操作权限')
            }
            device = await prisma.device.update({
                where: { device_id },
                data: {
                    alias_name,
                    user_id: userId
                },
            });
            return {
                msg: '更新成功！',
                device: device,
            };
        }),
    /**
     * 解绑设备
     */
    unbindDevice: procedure
        .input(
            z.object({
                device_id: z.string().max(18)
            })
        ).mutation(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { device_id } = input;
            let device = await prisma.device.findUnique({
                where: { device_id }
            });
            if (!device) {
                throw new Error('解绑失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id) {
                throw new Error('解绑失败！无操作权限')
            }
            device = await prisma.device.update({
                where: { device_id },
                data: {
                    user_id: null
                }
            });
            return {
                msg: "解绑成功！",
                device: device,
            };
        }),
    /**
     * 更新设备
     */
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
        .mutation(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { device_id, ...updateData } = input;
            let device = await prisma.device.findUnique({
                where: { device_id }
            });
            if (!device) {
                throw new Error('更新失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id) {
                throw new Error('更新失败！无操作权限')
            }
            return prisma.device.update({
                where: { device_id },
                data: updateData,
            });
        }),
    /**
     * 清除设备历史数据
     */
    clearDeviceLogs: procedure
      .input(
          z.object({
              device_id: z.string().max(18),
          })
      )
      .mutation(async ({ ctx, input }) => {
          const { id: userId, roleIdList } = ctx;
          const { device_id } = input;
          let device = await prisma.device.findUnique({
              where: { device_id }
          });
          if (!device) {
              throw new Error('清除失败！设备不存在')
          }
          if (!roleIdList.includes(1) && userId !== device.user_id) {
              throw new Error('清除失败！无操作权限')
          }
          await prisma.device_log.deleteMany({
              where: { device_id }
          });
          await prisma.device_change_log.deleteMany({
              where: { device_id }
          });
      }),
    /**
     * 删除指定条数的设备历史数据
     */
    deleteDeviceLogs: procedure
        .input(
            z.object({
                device_id: z.string().max(18),
                num: z.number().min(1)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { device_id, num } = input;
            let device = await prisma.device.findUnique({
                where: { device_id }
            });
            if (!device) {
                throw new Error('删除失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id) {
                throw new Error('删除失败！无操作权限')
            }
            const deviceLogs = await prisma.device_log.findMany({
                where: { device_id },
                orderBy: { update_time: 'asc' },
                take: num
            });
            if (!deviceLogs) {
                return {
                    msg: '删除成功！'
                };
            }
            const deviceLogIds = deviceLogs.map(log => log.id);
            await prisma.device_log.deleteMany({
                where: { id: { in: deviceLogIds } }
            });
            return {
                msg: '删除成功！'
            };
        }),
    /**
     * 删除设备
     */
    deleteDevice: procedure
        .input(
            z.object({
                device_id: z.string().max(18),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { device_id } = input;
            let device = await prisma.device.findUnique({
                where: { device_id }
            });
            if (!device) {
                throw new Error('删除失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id) {
                throw new Error('删除失败！无操作权限')
            }
            await prisma.device.delete({
                where: { device_id }
            });
            return {
                msg: '删除成功！'
            };
      }),
    /**
     * 查询设备历史数据
     */
    deviceLogs: procedure.input(
        z.object({
            device_id: z.string()
        })
    ).query(async ({ ctx, input }) => {
        const { id: userId, roleIdList } = ctx;
        const { device_id } = input;
        let device = await prisma.device.findUnique({
            where: { device_id }
        });
        if (!device) {
            throw new Error('查询失败！设备不存在')
        }
        if (!roleIdList.includes(1) && userId !== device.user_id) {
            throw new Error('查询失败！无操作权限')
        }
        return prisma.device_log.findMany({
            where: { device_id },
            take: 200,
            orderBy: { update_time: 'desc' },
        })
    }),
    deviceChangeLog: procedure.input(
            z.object({
                device_id: z.string(),
                filter: z.string().optional()
            }),
        )
        .query(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { device_id } = input;
            let device = await prisma.device.findUnique({
                where: { device_id }
            });
            if (!device) {
                throw new Error('查询失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id) {
                throw new Error('查询失败！无操作权限')
            }
            const filterCondition: any = {};
            if (input.filter === "online") {
                filterCondition.online = {
                    not: 0,
                };
            } else if (input.filter === "electric") {
                filterCondition.electric = {
                    not: 0,
                };
            }
            return prisma.device_change_log.findMany({
                where: {
                    device_id: input.device_id,
                    ...filterCondition
                },
                take: 200,
                orderBy: {
                update_time: "desc",
            },
        });
    }),
    /**
     * 下载设备历史数据
     */
    downloadDeviceLogs: procedure
        .input(
            z.object({
                device_id: z.string(),
                version: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId, roleIdList } = ctx;
            const { device_id, version } = input;
            let device = await prisma.device.findUnique({
                where: { device_id }
            });
            if (!device) {
                throw new Error('下载失败！设备不存在')
            }
            if (!roleIdList.includes(1) && userId !== device.user_id) {
                throw new Error('下载失败！无操作权限')
            }
            let maxRecords = 1440;
            if (version.includes("PRO")) {
                maxRecords = 10000;
            }

            const [deviceLogs] = await Promise.all([
                prisma.device_log.findMany({
                    where: { device_id },
                    take: maxRecords,
                    orderBy: { update_time: "desc" },
                }),
            ]);

            const processedDeviceLogs = deviceLogs.map(log => {
                const { iccid, ip, gateway, importance_level, ...rest } = log;
                return {
                    ...rest,
                    serial_rx: base64Decode(log.serial_rx),
                    serial_tx: base64Decode(log.serial_tx),
                    update_time: formattedDate(log.update_time)
                };
            });

            const json2csvParser = new Parser({
                fields: Object.keys(processedDeviceLogs[0])
            });
            const res = json2csvParser.parse(processedDeviceLogs);
            return `\ufeff${res}`;
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
