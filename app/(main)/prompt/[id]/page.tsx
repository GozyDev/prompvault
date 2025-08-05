import Specific from "@/components/getSpecificPrompt";
import { Metadata } from "next";
import { Prompt } from "@/lib/type";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;


  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/prompt/meta/${id}`
  );

  const data: Prompt = await res.json(); //
 

  return {
    title: data.content,
    description: data.content,
    openGraph: {
      title: data.title,
      description: data.content,
      images: [data.imageUrl],
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="md:pt-[20px] ">
      <Specific id={id} />
    </div>
  );
}
