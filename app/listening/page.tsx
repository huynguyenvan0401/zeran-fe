import Link from "next/link";
import { AuthGetApi } from "@/lib/fetchApi";
import { Subtile } from "./[id]/page";
import styles from "./styles.module.css";
import { Grid } from "@radix-ui/themes";

export default async function Listenings() {
  const listens: Subtile[] = await AuthGetApi(`/listens`);

  return (
    <>
      <Grid
        columns={{ initial: "1", sm: "1", md: "2", lg: "4" }}
        gap="3"
        width="auto"
        pt="20px"
        px="10px"
      >
        {listens.map((item) => {
          return (
            <div key={`link-${item.id}`} className={styles.lessionItem}>
              <Link href={`/listening/${item.id}`} className={styles.lessionLink}>
                {item.title}
              </Link>
            </div>
          );
        })}
      </Grid>
    </>
  );
}
