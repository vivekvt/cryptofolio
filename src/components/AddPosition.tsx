import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { generateObjectId } from "../utils/generateObjectId";
import { IPosition } from "../types/position";

interface IAddPosition {
  open: boolean;
  onClose: () => void;
  onSave: (newCoin: any) => void;
  coins: any[];
}

const defaultPosition = {
  _id: generateObjectId(),
  id: "",
  name: "",
  symbol: "",
  price: null,
  quantity: null,
  image: "",
  date: new Date(),
};

export default function AddPosition({
  open,
  onClose,
  coins,
  onSave,
}: IAddPosition) {
  const [position, setPosition] = useState<IPosition>(defaultPosition);

  const handleChange = (event) => {
    setPosition((oldCoin) => ({
      ...oldCoin,
      [event.target.name]: event?.target?.value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave(position);
    onClose();
  };

  useEffect(() => {
    setPosition((oldCoin) => ({
      ...oldCoin,
      _id: generateObjectId(),
    }));
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle>Add Position to portfolio </DialogTitle>
      <form onSubmit={handleSave}>
        <DialogContent style={{ minWidth: 250 }}>
          <Autocomplete
            value={position}
            onChange={(event, selectedCoin) => {
              let payload = { ...position };
              if (selectedCoin?.id) {
                payload = {
                  ...payload,
                  id: selectedCoin?.id,
                  name: selectedCoin?.name,
                  symbol: selectedCoin?.symbol,
                  image: selectedCoin?.image,
                  price: Number(selectedCoin?.current_price),
                };
              } else {
                payload = {
                  ...payload,
                  id: "",
                  name: "",
                  symbol: "",
                  image: "",
                  price: null,
                };
              }
              setPosition((oldCoin) => ({
                ...oldCoin,
                ...payload,
              }));
            }}
            sx={{ my: 1, mt: 0 }}
            fullWidth
            disablePortal
            options={coins}
            renderInput={(params) => (
              <TextField {...params} label="Coin" required />
            )}
            // getOptionLabel={(option) => option.name}
            getOptionLabel={(option) =>
              option?.name ? `${option.name} (${option.symbol})` : option.name
            }
            renderOption={(props, option, { selected }) => (
              <ListItem dense {...props} selected={option?.id === position?.id}>
                <ListItemAvatar>
                  <Avatar alt={option?.name} src={option?.image} />
                </ListItemAvatar>
                <ListItemText primary={`${option.name} (${option.symbol})`} />
              </ListItem>
            )}
          />
          <TextField
            value={position?.quantity}
            onChange={handleChange}
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            sx={{ my: 1 }}
            required
          />
          <TextField
            value={position?.price}
            onChange={handleChange}
            name="price"
            label="Price"
            type="number"
            fullWidth
            sx={{ my: 1, mb: 2 }}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDateTimePicker
              renderInput={(props) => (
                <TextField {...props} fullWidth required />
              )}
              label="Date"
              value={position.date}
              onChange={(newValue) => {
                setPosition((oldCoin) => ({
                  ...oldCoin,
                  date: newValue,
                }));
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">
            Save
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
