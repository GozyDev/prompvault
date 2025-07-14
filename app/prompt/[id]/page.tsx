import Specific from "@/components/getSpecificPrompt";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div className="pt-[20px] ">
    <Specific id={id} />
  </div>;
}
  