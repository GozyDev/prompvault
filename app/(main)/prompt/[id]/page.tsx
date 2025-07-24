import Specific from "@/components/getSpecificPrompt";
import ProfileEdit from "@/components/profileEdit";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div className="md:pt-[20px] ">
    <Specific id={id} />
  </div>;
}
  