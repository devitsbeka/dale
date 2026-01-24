import { ProjectDetailPage } from "@/components/dashboards/project-detail-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProjectDetailPage id={id} />;
}
