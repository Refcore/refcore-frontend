'use client';

const users = [
  { name: 'Sarah_J', score: 1240, rank: 1, progress: 100 },
  { name: 'Mike_W', score: 985, rank: 2, progress: 85 },
  { name: 'Cindy_R', score: 842, rank: 3, progress: 70 },
];

export default function HeroFloatingCard() {
  return (
    <div className="relative animate-float">
      <div className="w-full md:min-w-lg max-w-lg glass rounded-2xl p-6 border border-white/10 neon-purple">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg">Live Leaderboard</h3>
            <p className="text-xs text-[#00ff9d] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
              Live Updates
            </p>
          </div>

          <div className="bg-secondary px-3 py-1 rounded-lg border border-border text-sm">
            <span className="text-muted-foreground">Total:</span>{' '}
            <span className="font-bold text-[#00d0ff]">12,405</span>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.name}
              className={`flex items-center gap-4 p-3 rounded-xl border ${
                user.rank === 1
                  ? 'border-[#b700ff]/30 relative overflow-hidden'
                  : 'border-border'
              } bg-secondary/40`}
            >
              {user.rank === 1 && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#b700ff]" />
              )}

              {/* Rank */}
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-sm">
                {user.rank}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-lg font-bold" >{'UZ'}</div>

              {/* Name + progress */}
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{user.name}</h4>
                <div className="w-full bg-background rounded-full h-1.5 mt-1">
                  <div
                    className="bg-linear-to-r from-[#b700ff] to-[#00d0ff] h-1.5 rounded-full"
                    style={{ width: `${user.progress}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="font-bold text-lg">{user.score}</div>
                <div className="text-[10px] text-muted-foreground">Refs</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -right-6 -top-10 glass p-3 rounded-xl border border-[#00ff9d]/30 neon-green animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00ff9d]/20 flex items-center justify-center">
            📈
          </div>
          <div>
            <div className="text-xs text-muted-foreground">New Referral</div>
            <div className="font-bold text-sm">+1 David joined</div>
          </div>
        </div>
      </div>
    </div>
  );
}