import '../../css/Navbar.css';
import React, { useEffect, useState } from 'react';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { getUserByEmail, getDataWeb } from './HTTP_Request ';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Avatar } from '@mui/material';

const NavBar = () => {
  const URL_backend = 'http://localhost:3000';
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = React.useState<any>([]);
  let blank_dataWeb = { W_NAME: "", W_ADDR: "", W_CONTACT: "", W_EMAIL: "", ABOUT_WEB: "" }
  const [dataWeb, setDataWeb] = useState<any>(blank_dataWeb);

  const fetchDataWeb = async () => {
    const DataWeb_from_backend = await getDataWeb();
    console.log('|---Navbar โหลดข้อมูลเว็ปไซต์---|');
    if (DataWeb_from_backend) {
      setDataWeb(DataWeb_from_backend)
    }
  }
  useEffect(() => {
    fetchDataWeb();
  }, []);

  const Logo = dataWeb.W_IMG;
  const W_NAME = dataWeb.W_NAME;

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  async function fetchUser() {
    try {
      const response = await getUserByEmail({ email: localStorage.getItem('email') });
      setUser(response); // สมมติว่า response.data คือข้อมูลของผู้ใช้ที่ได้รับจาก API
    } catch (error) {
      console.error('พบข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
    }
  }

  useEffect(() => {
    fetchUser(); // เรียกฟังก์ชัน fetchUser เมื่อ component โหลดหรือค่าใน localStorage เปลี่ยนแปลง
  }, []);

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = URL_backend + '/';
  }

  return (
    <div className="NavBar">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={Logo} className='imgLogo' />
            <div className='band'>
              {W_NAME}
            </div>
          </a>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {user.length !== 0 && <Button style={{ fontSize: '16px' }} className='TP_font' color="inherit" onClick={() => (window.location.href = URL_backend + '/MyProduct')}>ประกาศขายของฉัน</Button>}
          {user.length !== 0 && <Button style={{ fontSize: '16px' }} className='TP_font' color="inherit" onClick={() => window.location.href = URL_backend + "/MyProfile"}>  {user.U_NAME}</Button>}
          {user.length === 0 && <Button color="inherit" onClick={handleLogout} style={{marginRight:'1rem',fontSize:'18px'}}>Login</Button>}
        </Box>
        {user.length !== 0 && (
          <Box >
            <button className='Btn_sell' onClick={() => (window.location.href = URL_backend + '/CreateProduct')} >ประกาศขาย</button>
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="end"
              onClick={handleMenuOpen}
              size="large"
            >
              <Avatar alt="user photo" src={user.U_IMG} />
            </IconButton>
            <Menu
              className='avatar_container'
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => (window.location.href = URL_backend + '/CreateProduct')}>
                <Typography className='TP_font' variant="body1"><AddShoppingCartIcon /> ประกาศขาย</Typography>
              </MenuItem>
              <MenuItem onClick={() => (window.location.href = URL_backend + '/MyProduct')}>
                <Typography className='TP_font' variant="body1"><StorefrontIcon /> ประกาศขายของฉัน</Typography>
              </MenuItem>

              {user.length !== 0 &&
                <MenuItem onClick={() => (window.location.href = URL_backend + '/MyProfile')}>
                  <Typography className='TP_font' variant="body1"><ManageAccountsIcon /> โปรไฟล์ของฉัน</Typography>
                </MenuItem>
              }<center>
                {user.length !== 0 && <button style={{ margin: '10px' }} className='Nav_button' onClick={handleLogout} >LOGOUT</button>}
                {user.length === 0 && <button style={{ margin: '10px' }} className='Nav_button' onClick={handleLogout} >LOGIN</button>}
              </center>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </div>
  );
};

export default NavBar;
