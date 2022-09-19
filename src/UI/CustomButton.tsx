import Button from "@mui/material/Button";
import { CustomLoadingButton } from "./CustomLoadingButton";

export const CustomButton = ({
  isLoading,
  title,
  onClick,
}: {
  isLoading: boolean;
  title: string;
  onClick: () => void;
}) =>
  isLoading ? (
    <CustomLoadingButton />
  ) : (
    <Button variant="outlined" onClick={onClick}>
      {title}
    </Button>
  );
