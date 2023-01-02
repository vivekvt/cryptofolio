import AddCircle from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useGetCoins } from "../hooks/getCoins";
import AddPosition from "./AddPosition";
import { PositionItem } from "./PositionItem";
import { getPositionValue, percDiff } from "../utils/position";
import Share from "@mui/icons-material/Share";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useGetPortfolio } from "../hooks/getPortfolio";

const initialState = {
  showForm: false,
  selectedCoin: null,
};

export default function Portfolio() {
  const { portfolio, handlePortfolioChange } = useGetPortfolio();
  const [state, setState] = useState(initialState);
  const { coins, error } = useGetCoins();

  const { totalInvestedValue, totalCurrentValue } = useMemo(() => {
    let totalInvestedValue = 0;
    let totalCurrentValue = 0;
    Object.keys(portfolio?.positions)?.forEach((key) => {
      const positions = portfolio?.positions?.[key];
      const { investedValue, currentValue } = getPositionValue(
        positions,
        coins
      );
      totalInvestedValue += investedValue;
      totalCurrentValue += currentValue;
    });
    return { totalInvestedValue, totalCurrentValue };
  }, [portfolio.positions, coins]);

  const diff = percDiff(totalInvestedValue, totalCurrentValue);

  return (
    <>
      {error ? (
        <Alert severity="error">Something went wrong!, {error?.message}</Alert>
      ) : coins?.length > 0 ? (
        <>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ display: "flex", alignItems: "center" }}
              >
                My Portfolio
                <Tooltip title="Add new position">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      setState((oldState) => ({ ...oldState, showForm: true }))
                    }
                  >
                    <AddCircle />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Tooltip title="Share your portfolio">
                <IconButton edge="end">
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}
            >
              <Typography>
                Total invested: <b>${totalInvestedValue?.toFixed(2)}</b>
              </Typography>
              <Typography>
                Current value:{" "}
                <b>
                  <span
                    style={{
                      color:
                        totalCurrentValue < totalInvestedValue
                          ? "red"
                          : "green",
                    }}
                  >
                    ${totalCurrentValue?.toFixed(2)} (
                    {totalCurrentValue < totalInvestedValue && "-"}
                    {diff}%)
                  </span>
                </b>
              </Typography>
            </Box>
          </Box>
          <List>
            {Object.keys(portfolio?.positions)?.map((key, i) => (
              <PositionItem
                key={key}
                positions={portfolio?.positions?.[key]}
                coins={coins}
                coinId={key}
                onPositionsChange={(newPositions) => {
                  let newPortfolio = { ...portfolio?.positions };
                  if (newPositions?.length > 0) {
                    newPortfolio[key] = newPositions;
                  } else {
                    delete newPortfolio[key];
                  }
                  handlePortfolioChange({ positions: newPortfolio });
                }}
              />
            ))}
            {state.showForm && (
              <AddPosition
                open={state.showForm}
                onClose={() =>
                  setState((oldState) => ({ ...oldState, showForm: false }))
                }
                coins={coins}
                onSave={(newCoin) => {
                  const newPortfolio = { ...portfolio?.positions };
                  if (newPortfolio?.[newCoin?.id]) {
                    newPortfolio[newCoin?.id] = [
                      ...newPortfolio?.[newCoin?.id],
                      newCoin,
                    ];
                  } else {
                    newPortfolio[newCoin?.id] = [newCoin];
                  }
                  handlePortfolioChange({ positions: newPortfolio });
                }}
              />
            )}
          </List>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            p: 5,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
