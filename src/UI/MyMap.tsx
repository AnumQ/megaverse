import { getEmojiFromObject } from "./Emoji";
import styles from "../../styles/Home.module.css";

const drawMyMapRow = (el: { type: number } | null, i: number) => {
  return (
    <span className={styles.pos} key={i}>
      {getEmojiFromObject(el)}
    </span>
  );
};

const drawMyMap = (g: [], index: number) => {
  return (
    <div key={index}>
      <p>{g.map(drawMyMapRow)}</p>
    </div>
  );
};

export const MyMap = ({ myMap }: { myMap: [] }) => (
  <div>
    <div className={styles.inline}>
      <h2>My Map</h2>
    </div>
    <div>{myMap && myMap.map(drawMyMap)}</div>
  </div>
);
