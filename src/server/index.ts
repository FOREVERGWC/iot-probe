import { z } from "zod";
import { procedure, router } from "./trpc";
import prisma from "@/libs/db";

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
});
// export type definition of API
export type AppRouter = typeof appRouter;
