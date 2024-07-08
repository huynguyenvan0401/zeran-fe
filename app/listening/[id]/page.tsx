import AudioPlayer from "@/components/Audio";
import { Sentence } from "@/components/Audio/type";
import { AuthGetApi } from "@/lib/fetchApi";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Box, Flex } from "@radix-ui/themes";
import styles from "./styles.module.css";

export type Subtile = {
  id: number;
  title: string;
  audio: string;
  trans: Sentence[];
};

export default async function Listening({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session)
    redirect(
      "http://localhost:3000/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Flistening%2F1"
    );

  const subtile = await AuthGetApi(`/listens/${params.id}`);

  return (
    <>
      <Flex justify="center" pt="20px">
        <Box width="800px">
          <AudioPlayer subtitle={subtile} />
        </Box>
      </Flex>
    </>
  );
}
