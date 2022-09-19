import styles from "../../styles/Home.module.css";
import { POLYANET_TYPE } from "../constants";
import { usePolyanets } from "../hooks/usePolyanets";
import { LogoItem } from "../Model/LogoItem";
import { CustomButton } from "../UI/CustomButton";
import { CustomLoadingButton } from "../UI/CustomLoadingButton";

export const Phase2 = ({
  goalMap,
  getMyMap,
  setSuccessInfo,
}: {
  goalMap: [];
  getMyMap: () => Promise<void>;
  setSuccessInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    createPolyanets,
    deletePolyanets,
    isCreateLoading: isCreateLoadingPhase1,
    isDeleteLoading: isDeleteLoadingPhase1,
  } = usePolyanets();

  const logoDataList: LogoItem[] = [];

  const handleCreate = async () => {
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

    // console.log("logoDataList");
    // console.log(logoDataList);

    // use this list to create a list of promnise calls

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

      if (result) {
        setSuccessInfo(result?.success);
      }
    } catch (error) {
      console.error(error);
    }
    // logoDataList.forEach((logoItem) => {
    //   // console.log(logoItem.type);

    //   if (logoItem.type === POLYANET_TYPE) {
    //     polyanetsPositions.push(logoItem.position);
    //   }
    // });

    // console.log("polyanetsPositions");
    // console.log(polyanetsPositions);
  };

  const handleReset = async () => {
    // const result = await deletePolyanets(() => {
    //   getMyMap();
    // });
    // if (result) {
    //   setSuccessInfo(result.success);
    // }
  };

  return (
    <div className={styles.card}>
      <h2>Phase 2</h2>
      <p>Crossmint logo. With 🌙SOLoons and ☄comETHs!</p>
      <br />
      <div>
        {isCreateLoadingPhase1 ? (
          <CustomLoadingButton />
        ) : (
          <CustomButton title="Create" onClick={handleCreate} />
        )}
      </div>
      <div>
        {isDeleteLoadingPhase1 ? (
          <CustomLoadingButton />
        ) : (
          <CustomButton title="Reset Map" onClick={handleReset} />
        )}
      </div>
    </div>
  );
};
