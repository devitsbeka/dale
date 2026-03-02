import { router, createCallerFactory } from "./trpc";
import { userRouter } from "./routers/user";
import { jobRouter } from "./routers/job";
import { skillRouter } from "./routers/skill";
import { salaryRouter } from "./routers/salary";
import { negotiationRouter } from "./routers/negotiation";
import { gameRouter } from "./routers/game";

export const appRouter = router({
  user: userRouter,
  job: jobRouter,
  skill: skillRouter,
  salary: salaryRouter,
  negotiation: negotiationRouter,
  game: gameRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
