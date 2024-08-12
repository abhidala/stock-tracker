import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useQuery } from 'react-query';
import axios from 'axios';
import './Table.css';
const fetchStockData = async (selected: string) => {
  const { data } = await axios.get(`http://localhost:5000/stocks/${selected}`);
  return data;
};
const convertToIST = (utcDate: string): string => {
  const date = new Date(utcDate);
  const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
  };
  return new Intl.DateTimeFormat('en-IN', options).format(date);
};
const Table: React.FC = () => {
  const selected = useSelector((state: RootState) => state.data.selected);
  const { data, error, isLoading } = useQuery(['stockData', selected], () => fetchStockData(selected), {
    refetchInterval: 5000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data:{error instanceof Error ? error.message : 'Unknown error'}</div>;

  return (
    <div className='table-container'>
    <table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Symbol</th>
          <th>Current Price</th>
          <th>Days High</th>
          <th>Days Low</th>
          <th>Open Price</th>
          <th>Previous Close</th>
          <th>TimeStamp</th>
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 20).map((entry: any, index: number) => (
          <tr key={index}>
            <td>{index+1}</td>
            <td>{entry.symbol}</td>
            <td>{entry.current_price}</td>
            <td>{entry.days_high}</td>
            <td>{entry.days_low}</td>
            <td>{entry.open_price}</td>
            <td>{entry.previous_close}</td>
            <td>{convertToIST(entry.timestamp)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    </div>
  );
};

export default Table;
