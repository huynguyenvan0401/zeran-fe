import styles from "./styles.module.css";
import GenerateTrans from "@/components/GenerateTrans";

export default async function Generate() {
  return (
    <>
      <div className={styles.genContainer}>
        <GenerateTrans />
      </div>
    </>
  );
}
