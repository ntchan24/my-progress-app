// What each plan unlocks. Change limits here and every screen follows.
export type Plan = 'free' | 'pro';

export type PlanLimits = {
  maxMediaPerPost: number;
  allowVideo: boolean;
};

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: { maxMediaPerPost: 1, allowVideo: false },
  pro: { maxMediaPerPost: 30, allowVideo: true },
};
