import MoreHoriz from "@mui/icons-material/MoreHoriz";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Fragment, useState } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import moment from "moment";

import {
  getPositionStats,
  getPositionValue,
  percDiff,
} from "../utils/position";
import { ICoin } from "../types/coin";
import { IPosition } from "../types/position";

const initialState = {
  expand: false,
  showMenu: null,
  positionId: null,
};

interface IPositionItem {
  coins: ICoin[];
  positions: IPosition[];
  coinId: string;
  onPositionsChange: (positions: IPosition[]) => void;
}

export const PositionItem = ({
  coins,
  positions,
  coinId,
  onPositionsChange,
}: IPositionItem) => {
  const [state, setState] = useState(initialState);
  const coin = positions?.[0];
  const selectedCoin = coins?.find((c) => c?.id === coinId);

  const { investedValue, currentValue } = getPositionValue(positions, coins);

  const { quantity } = getPositionStats(positions);

  const avgPrice = investedValue / quantity;

  const diff = percDiff(avgPrice, selectedCoin?.current_price);

  return (
    <Fragment>
      <ListItem button>
        <ListItemAvatar>
          <Avatar alt={coin?.name} src={coin?.image} />
        </ListItemAvatar>
        <ListItemText
          primary={`${coin?.name} (${coin?.symbol}) $${selectedCoin?.current_price}`}
          secondary={`${quantity} Qty.  Avg. $${avgPrice}`}
        />
        <Typography
          style={{ color: currentValue > investedValue ? "green" : "red" }}
        >
          {currentValue > investedValue ? "+" : "-"} {diff}%
        </Typography>
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            onClick={() =>
              setState((oldState) => ({ ...oldState, expand: !state.expand }))
            }
          >
            {state.expand ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={state.expand} timeout="auto" unmountOnExit>
        <List sx={{ pl: 7 }} component="div" disablePadding dense>
          {positions?.map((position) => (
            <ListItem key={position?._id} button>
              <ListItemText
                primary={`${position.quantity} Qty. at $${position?.price}`}
                secondary={moment(position?.date).format("lll")}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={(event) =>
                    setState((oldState) => ({
                      ...oldState,
                      showMenu: event?.currentTarget,
                      positionId: position?._id,
                    }))
                  }
                >
                  <MoreHoriz />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Collapse>
      <Menu
        anchorEl={state.showMenu}
        open={Boolean(state.showMenu)}
        onClose={() =>
          setState((oldState) => ({ ...oldState, showMenu: null }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onPositionsChange(
              positions?.filter((p) => p?._id !== state.positionId)
            );
            setState((oldState) => ({
              ...oldState,
              positionId: null,
              showMenu: null,
            }));
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
