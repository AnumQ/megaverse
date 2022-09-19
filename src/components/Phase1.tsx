import LoadingButton from "@mui/lab/LoadingButton";
import styles from "../../styles/Home.module.css";
import { usePolyanets } from "../hooks/usePolyanets";
import Button from "@mui/material/Button";

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

  return (
    <div className={styles.card}>
      <h2>Phase1</h2>
      <p>Polyanet Cross 🪐 🪐 Click the button below 🪐 🪐 </p>
      <br />
      <div>
        {isCreateLoadingPhase1 ? (
          <LoadingButton
            loading={isCreateLoadingPhase1}
            loadingIndicator="Loading…"
            variant="outlined"
          >
            Loading ...
          </LoadingButton>
        ) : (
          <Button
            variant="outlined"
            onClick={async () => {
              const result = await createPolyanetsPhase1(() => {
                getMyMap();
              });

              if (result) {
                setSuccessInfo(result.success);
              }
            }}
          >
            Create
          </Button>
        )}
      </div>
      <div>
        {isDeleteLoadingPhase1 ? (
          <LoadingButton
            loading={isDeleteLoadingPhase1}
            loadingIndicator="Loading…"
            variant="outlined"
          >
            Loading ...
          </LoadingButton>
        ) : (
          <Button
            variant="outlined"
            onClick={async () => {
              const result = await deletePolyanets(() => {
                getMyMap();
              });

              if (result) {
                setSuccessInfo(result.success);
              }
            }}
          >
            Reset Map
          </Button>
        )}
      </div>
    </div>
  );
};
