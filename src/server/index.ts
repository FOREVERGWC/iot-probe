import { z } from "zod";
import { procedure, router } from "./trpc";
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
    return prisma.device.findMany();
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
      return {
        device,
        lastLog,
      };
    }),
  deviceChangeLog: procedure
    .input(
      z.object({
        device_id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const logs = await prisma.device_change_log.findMany({
        where: {
          device_id: input.device_id,
        },
        take: 5,
        orderBy: {
          update_time: "desc",
        },
      });
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
      return logs;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
