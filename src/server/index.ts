import {z} from "zod";
import {procedure, router} from "./trpc";
import prisma from "@/libs/db";
// import { diff } from "json-diff-ts";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  devices: procedure.query(async () => {
    const devices = await prisma.device.findMany();
    if (devices.length === 0) {
      return [];
    }
    const deviceLogIds = devices.map(item => item.latest_device_log_id);
    const deviceLogs = await prisma.device_log.findMany({
      where: {
        id: {
          in: deviceLogIds,
        },
      }
    });
    const latestLogsMap = new Map<string, typeof deviceLogs[0]>();
    for (const log of deviceLogs) {
      if (log.device_id && !latestLogsMap.has(log.device_id)) {
        latestLogsMap.set(log.device_id, log);
      }
    }

    return devices.map(device => ({
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
      const device = await prisma.device.findUniqueOrThrow({
        where: {
          device_id: input.id,
        },
      });
      const lastLog = await prisma.device_log.findUniqueOrThrow({
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
  deviceLogs: procedure.input(
      z.object({
        device_id: z.string()
      })
  ).query(async ({ input }) => {
    return prisma.device_log.findMany({
      where: {
        device_id: input.device_id,
      },
      take: 5,
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
