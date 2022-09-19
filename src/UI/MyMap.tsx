import { getEmojiFromObject } from "./Emoji";
import styles from "../../styles/Home.module.css";
import Button from "@mui/material/Button";
import { CustomButton } from "./CustomButton";

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

export const MyMap = ({
  myMap,
  getMyMap,
  clearMap,
  isClearMapButtonLoading,
}: {
  myMap: [];
  getMyMap: () => Promise<void>;
  clearMap: () => void;
  isClearMapButtonLoading: boolean;
}) => (
  <div>
    <div className={styles.inline}>
      <h2>My Map</h2>
      <div className={styles.inline}>
        <CustomButton
          isLoading={isClearMapButtonLoading}
          title="Clear Map One"
          onClick={() => {
            clearMap();
          }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            getMyMap();
          }}
        >
          Fetch Map
        </Button>
      </div>
    </div>
    <div>{myMap && myMap.map(drawMyMap)}</div>
  </div>
);
