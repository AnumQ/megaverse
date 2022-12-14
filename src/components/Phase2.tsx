import styles from "../../styles/Home.module.css";
import { BLUE, PURPLE, RED, SPACE, WHITE } from "../constants";
import { useLoading } from "../hooks/useLoading";
import { usePolyanets } from "../hooks/usePolyanets";
import { LogoItem } from "../Model/LogoItem";
import { CustomButton } from "../UI/CustomButton";
import _ from "lodash";
import { useMap } from "../hooks/useMap";
import { useComeths } from "../hooks/useComeths";
import { useSoloons } from "../hooks/useSoloons";

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
  const { createPolyanetsInLogo, deletePolyanetsPhase2 } = usePolyanets();
  const { fetchMyMap } = useMap();
  const {
    createRightComethsInLogo,
    createUpComethsInLogo,
    createDownComethsInLogo,
    createLeftComethsInLogo,
  } = useComeths();
  const { createSoloonsInLogo } = useSoloons();
  const {
    isLoading: isCreateButtonLoading,
    setIsLoading: setIsCreateButtonLoading,
  } = useLoading();

  const {
    isLoading: isResetMapButtonLoading,
    setIsLoading: setIsResetMapButtonLoading,
  } = useLoading();

  const logoDataList: LogoItem[] = [];

  const handleCreateLogo = async () => {
    setSuccessInfo("");
    setIsCreateButtonLoading(true);
    if (goalMap && goalMap.length > 0) {
      goalMap.forEach((row: string[], rowIndex: number) => {
        row.forEach((col: string, colIndex: number) => {
          if (col !== SPACE) {
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

    // create polyanet
    createPolyanetsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo
    );

    // create comeths
    createUpComethsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo
    );
    createLeftComethsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo
    );
    createRightComethsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo
    );
    createDownComethsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo
    );

    // create soloons
    createSoloonsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo,
      RED
    );
    createSoloonsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo,
      BLUE
    );
    createSoloonsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo,
      WHITE
    );
    createSoloonsInLogo(
      logoDataList,
      getMyMap,
      setIsCreateButtonLoading,
      setSuccessInfo,
      PURPLE
    );
  };

  const repeatReset = (map: []) => {
    setSuccessInfo("");
    let repeat = false;
    map.forEach((row: string[]) => {
      row.forEach((col: string) => {
        if (col) repeat = true;
      });
    });

    return repeat;
  };

  const handleReset = async () => {
    setSuccessInfo("");
    const result = await deletePolyanetsPhase2(myMap, async () => {
      getMyMap();
      const map = await fetchMyMap();
      if (map === null) console.error("Map is null");
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
      <p>Crossmint logo. With ????SOLoons and ???comETHs!</p>
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
