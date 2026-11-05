// Paywall content. Prices are fallbacks until they come from the App Store (localized).
export type PaywallPlanId = 'monthly' | 'quarterly' | 'yearly';

export type PaywallPlan = {
  id: PaywallPlanId;
  name: string;
  price: string;
  perMonth: string;
  badge?: string;
  // Used in the trial copy: "7 days free, then {billing}. Cancel anytime."
  billing: string;
};

export const PAYWALL_FEATURES: string[] = [
  'Up to 30 photos per post',
  'Videos',
  'Home screen widgets',
  'Achievement badges',
  'Reminders',
];

export const PAYWALL_PLANS: PaywallPlan[] = [
  { id: 'monthly', name: 'Monthly', price: '$4', perMonth: '$4.00 / month', billing: '$4 per month' },
  { id: 'quarterly', name: 'Quarterly', price: '$10', perMonth: '$3.33 / month', badge: 'Save 17%', billing: '$10 every 3 months' },
  { id: 'yearly', name: 'Yearly', price: '$25', perMonth: '$2.08 / month', badge: 'Save 48%', billing: '$25 per year' },
];

export const DEFAULT_PLAN_ID: PaywallPlanId = 'yearly';

// TODO: replace with the real Terms and Privacy pages
export const LEGAL_URLS = {
  terms: 'https://example.com/terms',
  privacy: 'https://example.com/privacy',
};
