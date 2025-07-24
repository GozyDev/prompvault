import ProfileD from "@/components/Profile";

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileD id={id}></ProfileD>;
}
