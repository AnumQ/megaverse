import styles from "../../styles/Home.module.css";
import { useLoading } from "../hooks/useLoading";
import { usePolyanets } from "../hooks/usePolyanets";
import { CustomButton } from "../UI/CustomButton";

export const Phase1 = ({
  getMyMap,
  setSuccessInfo,
}: {
  getMyMap: () => Promise<void>;
  setSuccessInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { createPolyanetsPhase1, deletePolyanetsPhase1 } = usePolyanets();

  const {
    isLoading: isCreateButtonLoading,
    setIsLoading: setIsCreateButtonLoading,
  } = useLoading();

  const {
    isLoading: isResetMapButtonLoading,
    setIsLoading: setIsResetMapButtonLoading,
  } = useLoading();

  const handleCreate = async () => {
    setIsCreateButtonLoading(true);
    const result = await createPolyanetsPhase1(() => {
      getMyMap();
    });

    setIsCreateButtonLoading(false);

    if (result) {
      setSuccessInfo(result.success);
    }
  };

  const handleReset = async () => {
    setIsResetMapButtonLoading(true);
    const result = await deletePolyanetsPhase1(() => {
      getMyMap();
    });
    setIsResetMapButtonLoading(false);

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
