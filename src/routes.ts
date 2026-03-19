// PUBLIC ROUTES
export const PUBLIC_ROUTES = {
  HOME: '/',
  LEADERBOARD: '/leaderboard',
  LEADERBOARD_BY_ID: (id: string) => `/leaderboard/${id}`,
  REFERRAL: (code: string) => `/ref/${code}`,
}

// AUTH ROUTES
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
}

// ADMIN ROUTES
export const ADMIN_ROUTES = {
  HOME: '/admin',
  PARTICIPANTS: '/admin/participants',
  REFERRALS: '/admin/referrals',
  LEADERBOARD: '/admin/leaderboard',
  CONTESTS: '/admin/contests',
  SETTINGS: '/admin/settings',
}