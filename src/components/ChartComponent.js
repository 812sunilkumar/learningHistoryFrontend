import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PieController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Container, Grid, Card, CardContent, Typography, TextField, MenuItem } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PieController,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ employees }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [trainingProviderFilter, setTrainingProviderFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [activeRecords, setActiveRecords] = useState(0);
  const [inactiveRecords, setInactiveRecords] = useState(0);

  const countries = useMemo(() => {
    const countrySet = new Set(employees.flatMap(emp => {
      // Ensure records is treated as an array
      const records = Array.isArray(emp.learning_history?.records) 
        ? emp.learning_history.records 
        : [];
      return records.map(record => record.country);
    }));
    return Array.from(countrySet);
  }, [employees]);

  const trainingProviders = useMemo(() => {
    const providerSet = new Set(employees.flatMap(emp => {
      // Ensure records is treated as an array
      const records = Array.isArray(emp.learning_history?.records) 
        ? emp.learning_history.records 
        : [];
      return records.map(record => record.training_provider);
    }));
    return Array.from(providerSet);
  }, [employees]);

  const applyFilters = () => {
    // Ensure records is treated as an array
    let data = employees.flatMap((employee) =>
      Array.isArray(employee.learning_history?.records) 
        ? employee.learning_history.records 
        : []
    );

    if (countryFilter) {
      data = data.filter((record) => record.country === countryFilter);
    }

    if (trainingProviderFilter) {
      data = data.filter((record) => record.training_provider === trainingProviderFilter);
    }

    if (dateFilter) {
      data = data.filter((record) => record.completed_on === dateFilter);
    }

    const activeCount = employees.reduce((acc, employee) => {
      if (employee.learning_history?.found === 'true') {
        return acc + 1;
      }
      return acc;
    }, 0);

    const inactiveCount = employees.reduce((acc, employee) => {
      if (employee.learning_history?.found === 'false') {
        return acc + 1;
      }
      return acc;
    }, 0);

    setFilteredData(data);
    setActiveRecords(activeCount);
    setInactiveRecords(inactiveCount);
  };

  useEffect(() => {
    applyFilters();
  }, [employees, countryFilter, trainingProviderFilter, dateFilter]);

  const barChartData = useMemo(() => {
    const courseCount = {};
    filteredData.forEach((record) => {
      courseCount[record.course_title] = (courseCount[record.course_title] || 0) + 1;
    });

    return {
      labels: Object.keys(courseCount),
      datasets: [
        {
          label: 'Number of Courses',
          data: Object.values(courseCount),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [filteredData]);

  const pieChartData = useMemo(() => {
    const courseCount = {};
    filteredData.forEach((record) => {
      courseCount[record.course_title] = (courseCount[record.course_title] || 0) + 1;
    });

    return {
      labels: Object.keys(courseCount),
      datasets: [
        {
          data: Object.values(courseCount),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [filteredData]);

  return (
    <Container>
      <Grid container spacing={2} marginBottom={2}>
        {/* Filters */}
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Countries</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Training Provider"
            value={trainingProviderFilter}
            onChange={(e) => setTrainingProviderFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Providers</MenuItem>
            {trainingProviders.map((provider) => (
              <MenuItem key={provider} value={provider}>
                {provider}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            label="Date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Active Records</Typography>
              <Typography variant="h4">{activeRecords}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Inactive Records</Typography>
              <Typography variant="h4">{inactiveRecords}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} sm={6}>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => `Course: ${context.label}, Count: ${context.raw}`,
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.label}: ${context.formattedValue}`,
                  },
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChartComponent;
