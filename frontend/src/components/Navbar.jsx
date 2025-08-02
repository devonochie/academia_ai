import React from "react";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { Person as PersonIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';



const Navbar = () => {
   const [drawerOpen, setDrawerOpen] = React.useState(false);
   const location = useLocation();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

   const navLinks = [
      { to: '/', label: 'Home', icon: <HomeIcon /> },
      { to: '/curriculum', label: 'Curriculum', icon: <SchoolIcon /> },
      { to: '/dashboard', label: 'Dashboard', icon: <PersonIcon /> },
      { to: '/recommendations', label: 'Recommendations', icon: <StarIcon /> },
      { to: '/paraphraser', label: 'Paraphraser', icon: <StarIcon /> }, 
   ];

   const drawer = (
      <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
         <List>
            {navLinks.map((link) => (
               <ListItem button component={RouterLink} to={link.to} key={link.to} selected={location.pathname === link.to}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
               </ListItem>
            ))}
         </List>
      </Box>
   );

   return (
      <>
         <AppBar position="static">
            <Toolbar>
               {isMobile && (
                  <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
                     <MenuIcon />
                  </IconButton>
               )}
               <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Academia
               </Typography>
               {!isMobile && navLinks.map((link) => (
                  <Button
                     key={link.to}
                     color="inherit"
                     component={RouterLink}
                     to={link.to}
                     startIcon={link.icon}
                     sx={{ mx: 1 }}
                  >
                     {link.label}
                  </Button>
               ))}
               <Button color="inherit" component={RouterLink} to="/login">
                  Login
               </Button>
            </Toolbar>
         </AppBar>
         <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            {drawer}
         </Drawer>
      </>
   );
}


export default Navbar