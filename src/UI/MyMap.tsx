import { getEmojiFromObject } from "./Emoji";
import styles from "../../styles/Home.module.css";

const drawMyMapRow = (el: { type: number } | null, i: number) => {
  return (
    <span className={styles.pos} key={i}>
      {getEmojiFromObject(el)}
    </span>
  );
};

export const drawMyMap = (g: [], index: number) => {
  return (
    <div key={index}>
      <p>{g.map(drawMyMapRow)}</p>
    </div>
  );
};
