import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Container>
          <Typography variant="h6" component="div">
            My Application
          </Typography>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/userlist">
            User List
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
