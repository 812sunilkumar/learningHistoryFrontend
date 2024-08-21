import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { addEmployee } from '../services/apiService';

// Helper function to generate a random employee ID
const generateEmployeeId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // Generates a 5-digit number
};

// Helper function to generate a random delegate ID
const generateDelegateId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let result = 'A'; // Start with a letter
  for (let i = 0; i < 8; i++) {
    result += (i % 2 === 0 ? letters : digits)[Math.floor(Math.random() * (i % 2 === 0 ? letters.length : digits.length))];
  }
  return result;
};

const AddEmployeeModal = ({ onAddEmployee }) => {
  const [newEmployee, setNewEmployee] = useState({
    employee_id: generateEmployeeId(),
    delegate_id: generateDelegateId(),
    first_name: '',
    last_name: '',
    active: true, // Added this line
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(newEmployee);
      onAddEmployee(); // Notify parent to refresh employee list
      setNewEmployee({
        employee_id: generateEmployeeId(),
        delegate_id: generateDelegateId(),
        first_name: '',
        last_name: '',
        active: true, // Added this line
      });
    } catch (error) {
      console.error('Error adding employee', error);
    }
  };

  return (
    <Dialog open onClose={() => onAddEmployee()} fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Employee ID"
            name="employee_id"
            value={newEmployee.employee_id}
            InputProps={{
              readOnly: true, // Make employee_id read-only
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Delegate ID"
            name="delegate_id"
            value={newEmployee.delegate_id}
            InputProps={{
              readOnly: true, // Make delegate_id read-only
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="first_name"
            value={newEmployee.first_name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="last_name"
            value={newEmployee.last_name}
            onChange={handleChange}
          />
          <FormControl margin="normal" fullWidth>
            <InputLabel id="active-label">Active</InputLabel>
            <Select
              labelId="active-label"
              id="active-select"
              name="active"
              value={newEmployee.active ? 'true' : 'false'}
              onChange={(e) => setNewEmployee({ ...newEmployee, active: e.target.value === 'true' })}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onAddEmployee()} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeModal;