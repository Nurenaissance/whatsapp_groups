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
  Tooltip,
  Button
} from '@mui/material';

import { 
  Routes, 
  Route, 
  Link, 
  useLocation,
  Navigate,
  Outlet,
  useParams
} from 'react-router-dom';
import { useAuth } from './authContext';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import ContactsIcon from '@mui/icons-material/Contacts';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';

// Import components
import Dashboard from './components/dashboard';
import Messages from './components/messages';
import Groups from './components/groups';
import Contacts from './components/contacts';
import Settings from './components/settings';
import ManageGroup from './components/managegroup';
import QRScanner from './components/qrscanner';
import BotConfiguration from './components/botconfiguration';
import Login from './login';

const drawerWidth = 240;

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticatedGroup, tenantId } = useAuth();
  const location = useLocation();
  const { tenant_id } = useParams();

  // Check if the tenant ID in the URL matches the logged-in user's tenant ID
  if (!isAuthenticatedGroup || tenant_id !== tenantId) {
    // Redirect to login if not authenticated or trying to access a different tenant
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

function App() {
  const theme = useTheme();
  const { logout, isAuthenticatedGroup, tenantId } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Dynamic Page Titles
  const pageTitle = {
    [`/${tenantId}/home`]: 'Dashboard',
    [`/${tenantId}/messages`]: 'Messages',
    [`/${tenantId}/groups`]: 'Groups',
    [`/${tenantId}/contacts`]: 'Contacts',
    [`/${tenantId}/settings`]: 'Settings',
    [`/${tenantId}/groups/:id`]: 'Manage Group',
    [`/${tenantId}/settings/bot-configuration`]: 'Bot Configuration',
    [`/${tenantId}/settings/qr-scanner`]: 'QR Scanner',
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/${tenantId}/home` },
    { text: 'Messages', icon: <MessageIcon />, path: `/${tenantId}/messages` },
    { text: 'Groups', icon: <GroupIcon />, path: `/${tenantId}/groups` },
    { text: 'Contacts', icon: <ContactsIcon />, path: `/${tenantId}/contacts` },
    { text: 'Settings', icon: <SettingsIcon />, path: `/${tenantId}/settings` },
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Determine the current page title, fallback to 'Dashboard'
  const currentPageTitle = Object.entries(pageTitle).find(([path]) => 
    location.pathname.startsWith(path.replace(':id', '').replace(':tenant_id', tenantId || ''))
  )?.[1] || 'Dashboard';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {isAuthenticatedGroup && (
        <>
          <AppBar 
            position="fixed" 
            color="default"
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
                {currentPageTitle}
              </Typography>
              <Button 
                color="inherit" 
                startIcon={<LogoutIcon />} 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            open={open}
            sx={{
              width: open ? drawerWidth : theme.spacing(7),
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: open ? drawerWidth : theme.spacing(7),
                marginTop: '64px',
                height: 'calc(100vh - 64px)',
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
        </>
      )}

      <Box
        component="main"
        sx={{
          backgroundColor: theme.palette.background.default,
          flexGrow: 1,
          height: 'calc(100vh - 64px)',
          width: `calc(100% - ${isAuthenticatedGroup ? (open ? drawerWidth : theme.spacing(7)) : 0}px)`,
          marginTop: isAuthenticatedGroup ? '64px' : 0,
          padding: 3,
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/:tenant_id/home" element={<Dashboard />} />
            <Route path="/:tenant_id/messages" element={<Messages />} />
            <Route path="/:tenant_id/groups" element={<Groups />} />
            <Route path="/:tenant_id/contacts" element={<Contacts />} />
            <Route path="/:tenant_id/settings" element={<Settings />} />
            <Route path="/:tenant_id/groups/:id" element={<ManageGroup />} />
            <Route path="/:tenant_id/settings/bot-configuration" element={<BotConfiguration />} />
            <Route path="/:tenant_id/settings/qr-scanner" element={<QRScanner />} />
          </Route>
          
          {/* Redirect to login if no tenant_id provided or paths not matching */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;