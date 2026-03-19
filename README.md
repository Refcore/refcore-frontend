src/app/
│
├── (public)/
│   ├── page.tsx                      → /
│   ├── leaderboard/
│   │   ├── page.tsx                  → /leaderboard
│   │   └── [contestId]/
│   │       └── page.tsx              → /leaderboard/[contestId]
│   │
│   ├── ref/
│   │   └── [code]/
│   │       └── page.tsx              → /ref/[code]
│
├── admin/                            ← URL prefix
│   ├── layout.tsx                    ← dashboard layout (sidebar etc)
│   ├── page.tsx                      → /admin (dashboard home)
│
│   ├── participants/
│   │   └── page.tsx                  → /admin/participants
│
│   ├── referrals/
│   │   └── page.tsx                  → /admin/referrals
│
│   ├── leaderboard/
│   │   └── page.tsx                  → /admin/leaderboard
│
│   ├── contests/
│   │   └── page.tsx                  → /admin/contests
│
│   ├── settings/
│   │   └── page.tsx                  → /admin/settings
│
├── (auth)/
│   ├── login/
│   │   └── page.tsx                  → /login
│   ├── register/
│   │   └── page.tsx                  → /register
│
├── api/
│   └── webhook/
│       └── whatsapp/
│           └── route.ts
│
├── layout.tsx
└── globals.css