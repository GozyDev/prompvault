import CreateCLientComponent from "@/components/CreateClientComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PROMPT VALUT",
  description: "Share your image create to ai enthisiate ",
};

const CreatePrompt = () => {
  return <CreateCLientComponent></CreateCLientComponent>;
};

export default CreatePrompt;
