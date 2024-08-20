import React, { useState, useEffect } from 'react';
import ChartComponent from '../components/ChartComponent';
import { fetchEmployees } from '../services/apiService';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetchEmployees();
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    };

    fetchEmployeeData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <ChartComponent employees={employees} />
    </Box>
  );
};

export default Dashboard;
