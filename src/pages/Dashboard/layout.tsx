
import { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import { useAuth } from '../../context/useAuth';


const drawerWidth = 240;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerToggle = () => {
    
      setMobileOpen(!mobileOpen);
    
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const { user } = useAuth();

  return (
    <Box sx={{  direction: 'rtl' }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        handleDrawerClose={handleDrawerClose}
        role={user?.role}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mr: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar /> 
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
