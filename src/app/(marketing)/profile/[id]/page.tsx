import { db } from "@/lib/db";
import { Badge } from "@/components/base/badges/badges";
import type { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await db.userProfile.findFirst({
    where: { userId: id },
    include: { user: { select: { name: true } } },
  });

  const title = profile?.user?.name
    ? `${profile.user.name} — ${APP_NAME}`
    : APP_NAME;

  return {
    title,
    description: profile?.headline ?? "Career profile on Planeta.id",
    openGraph: {
      title,
      description: profile?.headline ?? "Career profile on Planeta.id",
      images: [`${APP_URL}/api/og?title=${encodeURIComponent(profile?.user?.name ?? "Professional")}&subtitle=${encodeURIComponent(profile?.headline ?? "Planeta.id Member")}`],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params;

  const profile = await db.userProfile.findFirst({
    where: { userId: id },
    include: {
      user: { select: { name: true, email: true } },
      workExperiences: { orderBy: { startDate: "desc" }, take: 5 },
    },
  });

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary">
        <h1 className="text-display-sm font-semibold text-primary">Profile not found</h1>
      </div>
    );
  }

  const userSkills = await db.userSkill.findMany({
    where: { userId: id },
    include: { skill: true },
    take: 15,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-solid text-2xl font-bold text-white">
          {(profile.user?.name ?? "?").charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 text-display-xs font-semibold text-primary">
          {profile.user?.name ?? "Anonymous"}
        </h1>
        {profile.headline && (
          <p className="mt-1 text-md text-tertiary">{profile.headline}</p>
        )}
        {profile.location && (
          <p className="mt-0.5 text-sm text-quaternary">{profile.location}</p>
        )}
      </div>

      {profile.bio && (
        <p className="mt-6 text-center text-md text-secondary">{profile.bio}</p>
      )}

      {/* Skills */}
      {userSkills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {userSkills.map((us) => (
              <Badge key={us.skillId} color="brand" size="md">{us.skill.name}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.workExperiences.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Experience</h2>
          <div className="mt-3 flex flex-col gap-3">
            {profile.workExperiences.map((exp) => (
              <div key={exp.id} className="rounded-lg bg-secondary px-4 py-3">
                <p className="text-sm font-semibold text-primary">{exp.title}</p>
                <p className="text-sm text-tertiary">{exp.company}</p>
                <p className="text-xs text-quaternary">
                  {new Date(exp.startDate).getFullYear()}
                  {exp.endDate ? ` – ${new Date(exp.endDate).getFullYear()}` : " – Present"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-xs text-quaternary">
          Profile on Planeta.id — Career Operating System for Earth
        </p>
      </div>
    </div>
  );
}
