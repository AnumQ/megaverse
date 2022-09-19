import styles from "../../styles/Home.module.css";
import {
  COMETH_DOWN_MESSAGE,
  COMETH_LEFT_MESSAGE,
  COMETH_RIGHT_MESSAGE,
  COMETH_UP_MESSAGE,
  DOWN_COMETH_TYPE,
  LEFT_COMETH_TYPE,
  POLYANET_TYPE,
  RIGHT_COMETH_TYPE,
  SPACE,
  UP_COMETH_TYPE,
} from "../constants";
import { useLoading } from "../hooks/useLoading";
import { usePolyanets } from "../hooks/usePolyanets";
import { LogoItem } from "../Model/LogoItem";
import { CustomButton } from "../UI/CustomButton";
import _ from "lodash";
import { useMap } from "../hooks/useMap";
import { Position } from "../Model/Position";
import { useComeths } from "../hooks/useComeths";

export const Phase2 = ({
  myMap,
  goalMap,
  getMyMap,
  setSuccessInfo,
}: {
  myMap: [];
  goalMap: [];
  getMyMap: () => Promise<void>;
  setSuccessInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { createPolyanets, deletePolyanetsPhase2 } = usePolyanets();
  const { fetchMap: fetchGoalMap, fetchMyMap } = useMap();
  const { createComeths } = useComeths();
  const {
    isLoading: isCreateButtonLoading,
    setIsLoading: setIsCreateButtonLoading,
  } = useLoading();

  const {
    isLoading: isResetMapButtonLoading,
    setIsLoading: setIsResetMapButtonLoading,
  } = useLoading();

  const logoDataList: LogoItem[] = [];

  const createPolyanetsRecursively = async (polyPositions: Position[]) => {
    const result = await createPolyanets(polyPositions, async () => {
      getMyMap();
      const mapObject = await fetchMyMap();
      const map = mapObject.content;
      const missingPositions: Position[] = [];
      polyPositions.forEach((pos: Position) => {
        const mapPos = map[pos.row][pos.column];

        if (mapPos === null || (mapPos && mapPos.type !== 0)) {
          missingPositions.push(pos);
        }
      });

      if (missingPositions.length > 0) {
        console.log("Creating polyanets that failed in the previous calls");
        createPolyanetsRecursively(missingPositions);
      } else {
        setIsCreateButtonLoading(false);

        if (result) {
          console.log(result.success);
          setSuccessInfo(result?.success);
        }
      }
    });
  };

  const createRightComethsInLogoRecursively = async (positions: Position[]) => {
    const result = await createComeths(positions, "right", async () => {
      getMyMap();
      const missingPositions = await getComethMissingPositions(positions);
      if (missingPositions.length > 0) {
        console.log(COMETH_RIGHT_MESSAGE);
        createRightComethsInLogoRecursively(missingPositions);
      } else {
        setIsCreateButtonLoading(false);
        if (result) {
          console.log(result.success);
          setSuccessInfo(result?.success);
        }
      }
    });
  };

  const createDownComethsInLogoRecursively = async (positions: Position[]) => {
    const result = await createComeths(positions, "down", async () => {
      getMyMap();
      const missingPositions = await getComethMissingPositions(positions);
      if (missingPositions.length > 0) {
        console.log(COMETH_DOWN_MESSAGE);
        createDownComethsInLogoRecursively(missingPositions);
      } else {
        setIsCreateButtonLoading(false);
        if (result) {
          console.log(result.success);
          setSuccessInfo(result?.success);
        }
      }
    });
  };

  const getComethMissingPositions = async (positions: Position[]) => {
    const mapObject = await fetchMyMap();
    const map = mapObject.content;
    const missingPositions: Position[] = [];
    positions.forEach((pos: Position) => {
      const mapPos = map[pos.row][pos.column];
      if (mapPos === null || (mapPos && mapPos.type !== 2)) {
        missingPositions.push(pos);
      }
    });

    return missingPositions;
  };

  const createLeftComethsInLogoRecursively = async (positions: Position[]) => {
    const result = await createComeths(positions, "left", async () => {
      getMyMap();

      const missingPositions = await getComethMissingPositions(positions);

      if (missingPositions.length > 0) {
        console.log(COMETH_LEFT_MESSAGE);
        createLeftComethsInLogoRecursively(missingPositions);
      } else {
        setIsCreateButtonLoading(false);
        if (result) {
          console.log(result.success);
          setSuccessInfo(result?.success);
        }
      }
    });
  };

  const createUpComethsInLogoRecursively = async (positions: Position[]) => {
    const result = await createComeths(positions, "up", async () => {
      getMyMap();
      const missingPositions = await getComethMissingPositions(positions);
      if (missingPositions.length > 0) {
        console.log(COMETH_UP_MESSAGE);
        createUpComethsInLogoRecursively(missingPositions);
      } else {
        setIsCreateButtonLoading(false);
        if (result) {
          console.log(result.success);
          setSuccessInfo(result?.success);
        }
      }
    });
  };

  const handleCreateLogo = async () => {
    setSuccessInfo("");
    setIsCreateButtonLoading(true);
    if (goalMap.length > 0) {
      goalMap.forEach((row: string[], rowIndex: number) => {
        row.forEach((col: string, colIndex: number) => {
          if (col !== SPACE) {
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

    // createPolyanetsInLogo();
    // createRightComethsInLogo();
    // createLeftComethsInLogo();
    // createUpComethsInLogo();
    // createDownComethsInLogo();
  };

  const createDownComethsInLogo = async () => {
    const downComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === DOWN_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createDownComethsInLogoRecursively(downComethPositions);
    } catch (error) {
      console.error(error);
    }
  };
  const createRightComethsInLogo = async () => {
    const rightComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === RIGHT_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createRightComethsInLogoRecursively(rightComethPositions);
    } catch (error) {
      console.error(error);
    }
  };

  const createLeftComethsInLogo = async () => {
    const leftComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === LEFT_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createLeftComethsInLogoRecursively(leftComethPositions);
    } catch (error) {
      console.error(error);
    }
  };

  const createUpComethsInLogo = async () => {
    const upComethPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === UP_COMETH_TYPE ? logoItem.position : null
      )
    );

    try {
      await createUpComethsInLogoRecursively(upComethPositions);
    } catch (error) {
      console.error(error);
    }
  };

  const createPolyanetsInLogo = async () => {
    const polyPositions = _.compact(
      logoDataList.map((logoItem) =>
        logoItem.type === POLYANET_TYPE ? logoItem.position : null
      )
    );

    try {
      await createPolyanetsRecursively(polyPositions);
    } catch (error) {
      setIsCreateButtonLoading(false);
      console.error(error);
    }
  };

  const repeatReset = (map: []) => {
    setSuccessInfo("");
    let repeat = false;
    map.forEach((row: string[]) => {
      row.forEach((col: string) => {
        if (col) {
          repeat = true;
        }
      });
    });

    return repeat;
  };

  const handleReset = async () => {
    setSuccessInfo("");
    const result = await deletePolyanetsPhase2(myMap, async () => {
      getMyMap();
      const map = await fetchMyMap();
      if (repeatReset(map.content)) {
        handleReset();
      } else {
        setIsResetMapButtonLoading(false);
        if (result) {
          setSuccessInfo(result.success);
        }
      }
    });
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
          onClick={handleCreateLogo}
        />
      </div>
      <div>
        <CustomButton
          isLoading={isResetMapButtonLoading}
          title="Reset Map"
          onClick={() => {
            setIsResetMapButtonLoading(true);
            handleReset();
          }}
        />
      </div>
    </div>
  );
};
