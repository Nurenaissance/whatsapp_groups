import React, { useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import ContactsIcon from '@mui/icons-material/Contacts';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Import components
import Dashboard from './components/dashboard';
import Messages from './components/messages';
import Groups from './components/groups';
import Contacts from './components/contacts';
import Settings from './components/settings';
import ManageGroup from './components/managegroup';
import QRScanner from './components/qrscanner';
import BotConfiguration from './components/botconfiguration';

const drawerWidth = 240;

function App() {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);  // Changed to false by default

  // Mapping the title for display in the AppBar based on the current path
  const pageTitle = {
    '/': 'Dashboard',
    '/messages': 'Messages',
    '/groups': 'Groups',
    '/contacts': 'Contacts',
    '/settings': 'Settings',
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { text: 'Groups', icon: <GroupIcon />, path: '/groups' },
    { text: 'Contacts', icon: <ContactsIcon />, path: '/contacts' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar 
        position="fixed" 
        color="default"  // Changed from default blue to default color (typically black/neutral)
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
  width: `calc(100% - ${open ? drawerWidth : theme.spacing(7)})`,
  marginLeft: open ? drawerWidth : theme.spacing(7),
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            component="h1" 
            variant="h6" 
            color="inherit" 
            noWrap 
            sx={{ flexGrow: 1 }}
          >
            {pageTitle[location.pathname] || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : theme.spacing(7),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: open ? drawerWidth : theme.spacing(7),
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            overflowX: 'hidden',
          },
        }}
      >
         <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          py={2}
        >
          <img src="/logo.png" alt="Nuren AI Logo" width={open ? 120 : 40} style={{ transition: 'width 0.3s' }} />
          {open && (
            <Typography variant="h6" sx={{ mt: 1 }}>
              Nuren AI
            </Typography>
          )}
        </Box>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          {open && (
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>

        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.path} title={!open ? item.text : ''} placement="right">
              <ListItem 
                button 
                component={Link} 
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          backgroundColor: theme.palette.background.default,
          flexGrow: 1,
          height: 'calc(100vh - 64px)',
          width: `calc(100% - ${open ? drawerWidth : theme.spacing(7)})`,  // ADDED THIS
          marginTop: '64px',
          padding: 3,
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/group/:id" element={<ManageGroup />} />
          <Route path="/settings/bot-configuration" element={<BotConfiguration />} />
          <Route path="/settings/qr-scanner" element={<QRScanner />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;