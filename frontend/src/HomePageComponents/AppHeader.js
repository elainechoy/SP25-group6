import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { API_URL } from '../config.js'

const pages = ['Home', 'Map', 'Friends'];
const settings = ['Profile', 'Logout'];

function AppHeader( {user} ) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profileImage, setProfileImage] = React.useState();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    navigate("/"); 
  };

  React.useEffect(() => {
    const fetchImage = async () => {
      if (user?.profileImageId) {
        setProfileImage(`${API_URL}/api/profile-image/${user.profileImageId}`);
      }
    };

    fetchImage();
  }, [user.profileImageId]);

  return (
    <AppBar position="static" sx={{backgroundColor: '#f7e8ff'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            onClick={() => navigate('/home')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: '#af25f5',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            TIMESNAP
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-around' }}>
            {pages.map((label) => (
              <Button
                key={label}
                onClick={() => handleNavigate(`/${label.toLowerCase()}`)}
                sx={{ my: 2, color: '#af25f5', display: 'block' }}
              >
                {label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#af25f5',
              textDecoration: 'none',
            }}
          >
            TIMESNAP
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user.name} src={profileImage} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
             {settings.map((setting) => (
                <MenuItem 
                  key={setting} 
                  onClick={() => {
                    if (setting === "Logout") {
                      handleLogout();
                    } else {
                      handleNavigate(`/${setting.toLowerCase()}`);
                    }
                    handleCloseUserMenu();
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

AppHeader.propTypes = {
  user: PropTypes.shape({
      name: PropTypes.string.isRequired, // Ensures `user.name` is a required string
      profileImageId: PropTypes.string
  }).isRequired, // Ensures `user` object is required
};
export default AppHeader;