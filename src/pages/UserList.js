import React from 'react';
import EmployeeTable from '../components/EmployeeTable';
import { Box, Typography } from '@mui/material';

const UserList = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <EmployeeTable />
    </Box>
  );
};

export default UserList;
