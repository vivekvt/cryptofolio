import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
        <CircularProgress />
      </Box>
    </div>
  );
}
