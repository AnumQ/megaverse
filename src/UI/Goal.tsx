import { getEmojiFromString } from "./Emoji";
import styles from "../../styles/Home.module.css";

const drawGoalRow = (el: string, i: number) => {
  return (
    <span className={styles.pos} key={i}>
      {getEmojiFromString(el)}
    </span>
  );
};

export const drawGoalMap = (g: [], index: number) => {
  return (
    <div key={index}>
      <p>{g.map(drawGoalRow)}</p>
    </div>
  );
};

export const GoalMap = ({ goal }: { goal: [] }) => (
  <div>
    <div className={styles.inline}>
      <h2>Goal Map</h2>
    </div>
    <div>{goal && goal.map(drawGoalMap)}</div>
  </div>
);
