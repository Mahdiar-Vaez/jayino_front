import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Menu as MenuIcon, Bell, User } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

type LogoutDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

 function LogoutDialog({
  open,
  onClose,
  onConfirm,
}: LogoutDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>خروج از حساب</DialogTitle>

      <DialogContent>

        <Typography>
          آیا مطمئن هستید که می‌خواهید از حساب کاربری خارج شوید؟
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          انصراف
        </Button>
        <Button onClick={()=>{onConfirm()
          onClose()
        }} color="error" variant="contained">
          خروج
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Navbar = ({ handleDrawerToggle }: { handleDrawerToggle: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openLogout,setOpenLogout]=useState<boolean>(false)

  const {  logout } = useAuth();
  const navigate=useNavigate()
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const redirectFn=(path:string)=>{
    navigate(path)
    handleClose()
  }

  return (
    <AppBar position="fixed" color='primary' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,  }}>
      <LogoutDialog onConfirm={logout} open={openLogout} onClose={()=>setOpenLogout(false)} />
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{  display:{
            sm:'none'
        } }}>
          <MenuIcon size={24} />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 ,mr:2 }}>
          سامانه مدیریت پارکینگ
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Bell size={20} />
        </IconButton>

        <IconButton color="inherit" onClick={handleMenu}>
          <Avatar sx={{ width: 34, height: 34 }}>
            <User size={18} />
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem onClick={()=>redirectFn('/dashboard/profile')}>پروفایل</MenuItem>
          <MenuItem onClick={handleClose}>تنظیمات</MenuItem>
          <MenuItem
            onClick={() => {
              setOpenLogout(true)
              handleClose()
            }}
          >
            خروج
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
