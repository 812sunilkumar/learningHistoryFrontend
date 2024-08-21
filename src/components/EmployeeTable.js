import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Pagination } from '@mui/material';
import LearningHistoryModal from './LearningHistoryModal';
import AddEmployeeModal from './AddEmployeeModal';
import { fetchEmployees, updateEmployee, deleteEmployee } from '../services/apiService';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLearningHistoryModalOpen, setIsLearningHistoryModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchEmployeeData = async () => {
    try {
      const result = await fetchEmployees();
      setEmployees(result.data);
      setFilteredEmployees(result.data);
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    // Filter employees based on search query
    setFilteredEmployees(
      employees.filter(employee =>
        employee.delegate_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${employee?.learning_history?.first_name} ${employee?.learning_history?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, employees]);

  const handleEditNameChange = (e, field) => {
    setEditingEmployee(prevState => ({
      ...prevState,
      [field]: e.target.value
    }));
  };

  const handleSaveNameChange = async () => {
    if (editingEmployee) {
      try {
        await updateEmployee(editingEmployee.delegate_id, {
          first_name: editingEmployee.first_name,
          last_name: editingEmployee.last_name
        });
        fetchEmployeeData(); // Refresh employee data
        setEditingEmployee(null);
      } catch (error) {
        console.error('Error updating employee', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async () => {
    try {
      if (employeeToDelete) {
        await deleteEmployee(employeeToDelete.delegate_id);
        fetchEmployeeData(); // Refresh employee data
      }
    } catch (error) {
      console.error('Error deleting employee', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleViewLearningHistory = (employee) => {
    setSelectedEmployee(employee);
    setIsLearningHistoryModalOpen(true);
  };

  const handleCloseLearningHistoryModal = async () => {
    setIsLearningHistoryModalOpen(false);
    setSelectedEmployee(null);
    await fetchEmployeeData(); // Refresh employee data after closing modal
  };

  const handleOpenAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const handleCloseAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
    fetchEmployeeData(); // Refresh employee data
  };

  const handleOpenDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search query changes
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1200, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          User List
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />
            }}
            sx={{ width: 300, mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleOpenAddEmployeeModal} startIcon={<AddIcon />}>
            Add Employee
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Delegate ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>
                    {editingEmployee?.employee_id === employee.employee_id ? (
                      <Box>
                        <TextField
                          defaultValue={employee?.learning_history?.first_name || ''}
                          value={editingEmployee.first_name}
                          onChange={(e) => handleEditNameChange(e, 'first_name')}
                          label="First Name"
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          defaultValue={employee?.learning_history?.last_name || ''}
                          value={editingEmployee.last_name}
                          onChange={(e) => handleEditNameChange(e, 'last_name')}
                          label="Last Name"
                          margin="normal"
                          fullWidth
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveNameChange}
                            sx={{ mr: 1 }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <span>{employee?.learning_history?.first_name} {employee?.learning_history?.last_name}</span>
                    )}
                  </TableCell>
                  <TableCell>{employee.delegate_id}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewLearningHistory(employee)}
                      sx={{ mr: 1 }}
                    >
                      View Learning History
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setEditingEmployee(employee)}
                      sx={{ mr: 1 }}
                    >
                      Edit Name
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(employee)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredEmployees.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
      {selectedEmployee && (
        <LearningHistoryModal
          open={isLearningHistoryModalOpen}
          onClose={handleCloseLearningHistoryModal}
          employee={selectedEmployee}
        />
      )}
      {isAddEmployeeModalOpen && (
        <AddEmployeeModal
          onAddEmployee={handleCloseAddEmployeeModal}
        />
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this employee?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteEmployee}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeTable;