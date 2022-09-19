import styles from "../../styles/Home.module.css";
import { usePolyanets } from "../hooks/usePolyanets";
import { CustomButton } from "../UI/CustomButton";
import { CustomLoadingButton } from "../UI/CustomLoadingButton";

export const Phase1 = ({
  getMyMap,
  setSuccessInfo,
}: {
  getMyMap: () => Promise<void>;
  setSuccessInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    createPolyanetsPhase1,
    deletePolyanets,
    isCreateLoading: isCreateLoadingPhase1,
    isDeleteLoading: isDeleteLoadingPhase1,
  } = usePolyanets();

  const handleCreate = async () => {
    const result = await createPolyanetsPhase1(() => {
      getMyMap();
    });

    if (result) {
      setSuccessInfo(result.success);
    }
  };

  const handleReset = async () => {
    const result = await deletePolyanets(() => {
      getMyMap();
    });

    if (result) {
      setSuccessInfo(result.success);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Phase1</h2>
      <p>Polyanet Cross 🪐 🪐 Click the button below 🪐 🪐 </p>
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
