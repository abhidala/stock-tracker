import React from 'react';
import { useDispatch } from 'react-redux';
import { setModalOpen } from '../redux/reducers';
import { Button } from '@mui/material';
import StockModal from '../components/Modal';
import Table from '../components/Table';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  const handleOpen = () => dispatch(setModalOpen(true));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <Button onClick={handleOpen} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Change Stock/Crypto
      </Button>
      <StockModal />
      <Table />
    </div>
  );
};

export default HomePage;
