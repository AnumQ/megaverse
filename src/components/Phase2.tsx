import styles from "../../styles/Home.module.css";
import { POLYANET_TYPE } from "../constants";
import { useLoading } from "../hooks/useLoading";
import { usePolyanets } from "../hooks/usePolyanets";
import { LogoItem } from "../Model/LogoItem";
import { CustomButton } from "../UI/CustomButton";
import _ from "lodash";

export const Phase2 = ({
  goalMap,
  getMyMap,
  setSuccessInfo,
}: {
  goalMap: [];
  getMyMap: () => Promise<void>;
  setSuccessInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { createPolyanets, deletePolyanetsPhase2 } = usePolyanets();

  const {
    isLoading: isCreateButtonLoading,
    setIsLoading: setIsCreateButtonLoading,
  } = useLoading();

  const {
    isLoading: isResetMapButtonLoading,
    setIsLoading: setIsResetMapButtonLoading,
  } = useLoading();

  const logoDataList: LogoItem[] = [];

  const handleCreate = async () => {
    setIsCreateButtonLoading(true);
    if (goalMap.length > 0) {
      goalMap.forEach((row: string[], rowIndex: number) => {
        row.forEach((col: string, colIndex: number) => {
          if (col !== "SPACE") {
            // console.log(`Type: ${col} - Pos: ${rowIndex}, ${colIndex}`);

            const logoItem = {
              position: {
                row: rowIndex.toString(),
                column: colIndex.toString(),
              },
              type: col,
            };

            logoDataList.push(logoItem);
          }
        });
      });
    }

    const polyPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === POLYANET_TYPE ? logoItem.position : null
      )
    );

    console.log(polyPositions);

    try {
      const result = await createPolyanets(polyPositions, () => {
        getMyMap();
      });

      setIsCreateButtonLoading(false);

      if (result) {
        console.log(result.success);
        // setSuccessInfo(result?.success);
      }
    } catch (error) {
      setIsCreateButtonLoading(false);

      console.error(error);
    }
  };

  const handleReset = async () => {
    setIsResetMapButtonLoading(true);
    const result = await deletePolyanetsPhase2(() => {
      getMyMap();
    });

    setIsResetMapButtonLoading(false);
    if (result) {
      setSuccessInfo(result.success);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Phase 2</h2>
      <p>Crossmint logo. With 🌙SOLoons and ☄comETHs!</p>
      <br />
      <div>
        <CustomButton
          isLoading={isCreateButtonLoading}
          title="Create"
          onClick={handleCreate}
        />
      </div>
      <div>
        <CustomButton
          isLoading={isResetMapButtonLoading}
          title="Reset Map"
          onClick={handleReset}
        />
      </div>
    </div>
  );
};
