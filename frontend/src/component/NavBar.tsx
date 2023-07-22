import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../css/Navbar.css';
const psh = 'https://img.freepik.com/free-vector/profitable-partnership-business-partners-cowork-affiliate-marketing-cost-effective-marketing-solution-affiliate-marketing-management-concept_335657-27.jpg?w=1480&t=st=1689624990~exp=1689625590~hmac=b002ed34d43e6cb8cb18dcae2f3fe38a3375caf9726c4fdcc8a372a54d0a8521'

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() { window.location.href = 'http://localhost:3000/Login'; }

  return (
    // <AppBar className="NavBar">
      <div className="NavBar">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={psh} alt="Flowbite Logo" className='imgLogo' />
            <p className='band'>
              <b>YakKai</b>
            </p>
          </a>
        </Box>


        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Services</Button>
          <Button color="inherit">Pricing</Button>
          <button className='Nav_button' onClick={handleLogout} >LOGOUT</button>
        </Box>


        {/* sx={{ display: { xs: 'block', md: 'none' } }} */}
        <Box>
          <IconButton
            color="inherit"
            aria-label="open menu"
            edge="end"
            onClick={handleMenuOpen}
            size="large"
          >
            {/* <MenuIcon /> */}
            <Avatar alt="user photo" src='frontend\src\component\1.jpg' />
          </IconButton>
          <Menu
            // id="navbar-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem>
              <Typography variant="body1">Home</Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="body1">About</Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="body1">Services</Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="body1">Pricing</Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="body1">Contact</Typography>
            </MenuItem>
          </Menu>
        </Box>
        
        {/* <IconButton
          color="inherit"
          aria-label="user menu"
          edge="end"
          size="large"
          onClick={() => { }}
        >
          <Avatar alt="user photo" src='frontend\src\component\1.jpg' />
        </IconButton> */}
      </Toolbar>
     {/* </AppBar> */}
     </div>
  );
};

export default NavBar;
