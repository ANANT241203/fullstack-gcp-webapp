// Minimal tRPC router stub for demonstration
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure.query(() => {
    return { message: 'Hello from tRPC!' };
  }),
  // Add more procedures as needed
});

export type AppRouter = typeof appRouter;
