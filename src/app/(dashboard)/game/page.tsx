"use client";

import { Badge } from "@/components/base/badges/badges";
import { trpc } from "@/lib/trpc";

export default function GamePage() {
  const { data: profile } = trpc.game.getProfile.useQuery();
  const { data: badges } = trpc.game.getBadges.useQuery();
  const { data: quests } = trpc.game.getQuests.useQuery();
  const { data: leaderboard } = trpc.game.getLeaderboard.useQuery();

  const earnedBadges = badges?.filter((b) => b.earned) ?? [];
  const lockedBadges = badges?.filter((b) => !b.earned) ?? [];
  const activeQuests = quests?.filter((q) => !q.completed) ?? [];
  const completedQuests = quests?.filter((q) => q.completed) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Career Game</h1>
        <p className="text-md text-tertiary">
          Level up your career with XP, quests, and badges
        </p>
      </div>

      {/* Profile stats */}
      {profile && (
        <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
          <div className="flex items-center gap-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-brand-solid text-2xl font-bold text-white">
              {profile.level}
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-primary">{profile.title}</p>
              <p className="text-sm text-tertiary">Level {profile.level}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand-solid transition-all"
                    style={{ width: `${profile.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-tertiary">
                  {profile.xp.toLocaleString()} / {profile.nextLevelXP.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xl font-bold text-primary">{profile.xp.toLocaleString()}</p>
              <p className="text-xs text-tertiary">Total XP</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xl font-bold text-primary">{profile.streak}</p>
              <p className="text-xs text-tertiary">Day Streak</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xl font-bold text-primary">{profile.longestStreak}</p>
              <p className="text-xs text-tertiary">Best Streak</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xl font-bold text-primary">{earnedBadges.length}</p>
              <p className="text-xs text-tertiary">Badges</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Active quests */}
        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
          <h2 className="text-lg font-semibold text-primary">Active Quests</h2>
          {activeQuests.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3">
              {activeQuests.map((quest) => {
                const target = quest.requirement?.target ?? 1;
                const pct = Math.min(100, Math.round((quest.progress / target) * 100));
                return (
                  <div key={quest.id} className="rounded-lg bg-secondary p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary">{quest.name}</p>
                      <Badge color="brand" size="sm">+{quest.xpReward} XP</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-tertiary">{quest.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-tertiary">
                        <div
                          className="h-full rounded-full bg-brand-solid"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-quaternary">{quest.progress}/{target}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 py-8 text-center">
              <p className="text-sm text-tertiary">
                {completedQuests.length > 0 ? "All quests completed! Check back later." : "No quests available yet. Complete your profile to unlock quests."}
              </p>
            </div>
          )}

          {completedQuests.length > 0 && (
            <div className="mt-4 border-t border-secondary pt-4">
              <p className="text-xs font-medium text-tertiary">{completedQuests.length} completed</p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
          <h2 className="text-lg font-semibold text-primary">Badges</h2>
          {earnedBadges.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-tertiary">Earned</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-2 text-center"
                    title={badge.description}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <p className="text-[10px] font-medium text-primary leading-tight">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {lockedBadges.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-tertiary">Locked</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {lockedBadges.slice(0, 8).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-2 text-center opacity-40"
                    title={badge.description}
                  >
                    <span className="text-2xl grayscale">{badge.icon}</span>
                    <p className="text-[10px] font-medium text-primary leading-tight">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {badges?.length === 0 && (
            <div className="mt-4 py-8 text-center">
              <p className="text-sm text-tertiary">No badges available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
        <h2 className="text-lg font-semibold text-primary">Leaderboard</h2>
        {leaderboard && leaderboard.length > 0 ? (
          <div className="mt-4 flex flex-col">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
                  entry.isCurrentUser ? "bg-utility-brand-50" : "hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 text-center text-sm font-bold ${
                    entry.rank <= 3 ? "text-warning-primary" : "text-tertiary"
                  }`}>
                    #{entry.rank}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-primary">
                      {entry.name} {entry.isCurrentUser && <span className="text-brand-primary">(You)</span>}
                    </p>
                    <p className="text-xs text-tertiary">Lv.{entry.level} {entry.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {entry.streak > 0 && (
                    <span className="text-xs text-tertiary">{entry.streak}d streak</span>
                  )}
                  <span className="text-sm font-semibold text-primary">{entry.xp.toLocaleString()} XP</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 py-8 text-center">
            <p className="text-sm text-tertiary">No leaderboard data yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
