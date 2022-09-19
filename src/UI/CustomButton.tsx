import Button from "@mui/material/Button";

export const CustomButton = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => (
  <Button variant="outlined" onClick={onClick}>
    {title}
  </Button>
);
