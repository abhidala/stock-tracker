import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, setModalOpen, setSymbolInput } from '../redux/reducers';
import { Modal, Box, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';
import { RootState } from '../redux/store';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const StockModal: React.FC = () => {
  const dispatch = useDispatch();
  const modalOpen = useSelector((state: RootState) => state.data.modalOpen);
  const symbolInput = useSelector((state: RootState) => state.data.symbolInput);

  const handleSave = () => {
    dispatch(setSelected(symbolInput));
    dispatch(setModalOpen(false));
  };

  return (
    <Modal open={modalOpen} onClose={() => dispatch(setModalOpen(false))}>
      <Box sx={style}>
      <FormControl fullWidth>
          <InputLabel id="stock-select-label">Stock/Crypto Symbol</InputLabel>
          <Select
            labelId="stock-select-label"
            value={symbolInput}
            label="Stock/Crypto Symbol"
            onChange={(e) => dispatch(setSymbolInput(e.target.value))}
            defaultValue="GOOG" // Set default value
          >
            <MenuItem value="GOOG">GOOG</MenuItem>
            <MenuItem value="AMZN">AMZN</MenuItem>
            <MenuItem value="MSFT">MSFT</MenuItem>
            <MenuItem value="BTC">BTC</MenuItem>
            <MenuItem value="AAPL">AAPL</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>Save</Button>
      </Box>
    </Modal>
  );
};

export default StockModal;
