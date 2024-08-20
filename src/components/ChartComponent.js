// src/components/ChartComponent.js
import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, TextField, MenuItem, Grid } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ employees }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [trainingProviderFilter, setTrainingProviderFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Use useCallback to memoize the function
  const applyFilters = useCallback(() => {
    let data = employees.flatMap(employee =>
      employee.learning_history?.records ?? []
    );

    if (countryFilter) {
      data = data.filter(record => record.country === countryFilter);
    }

    if (trainingProviderFilter) {
      data = data.filter(record => record.training_provider === trainingProviderFilter);
    }

    if (dateFilter) {
      data = data.filter(record => record.completed_on === dateFilter);
    }

    setFilteredData(data);
  }, [employees, countryFilter, trainingProviderFilter, dateFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Include applyFilters in the dependency array

  const chartData = {
    labels: filteredData.map(record => record.course_title),
    datasets: [{
      label: 'Number of Courses',
      data: filteredData.map(() => 1), // Using 1 as the data value since we're counting occurrences
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  return (
    <Container>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            {/* Add countries as options */}
            <MenuItem value="">All Countries</MenuItem>
            <MenuItem value="Denmark">Denmark</MenuItem>
            <MenuItem value="India">India</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Training Provider"
            value={trainingProviderFilter}
            onChange={(e) => setTrainingProviderFilter(e.target.value)}
          >
            {/* Add training providers as options */}
            <MenuItem value="">All Providers</MenuItem>
            <MenuItem value="RelyOn Nutec">RelyOn Nutec</MenuItem>
            <MenuItem value="Maersk Training A/S">Maersk Training A/S</MenuItem>
            <MenuItem value="Sunilkumar">Sunilkumar</MenuItem>
            <MenuItem value="International Wind Academy Lolland A/S">International Wind Academy Lolland A/S</MenuItem>
            <MenuItem value="Vestas Wind Technology India Private Limited">Vestas Wind Technology India Private Limited</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            fullWidth
            label="Completion Date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (context) => `Course: ${context.label}` } } } }} />
    </Container>
  );
};

export default ChartComponent;
