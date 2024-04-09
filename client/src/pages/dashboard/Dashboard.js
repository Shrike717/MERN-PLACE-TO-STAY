// This is the Mini Drawer component from Mui 5. Then separated in this component and SideList component
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import { Tooltip } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import { Brightness4, Brightness7, Home } from '@mui/icons-material';

import SideList from './SideList';
import Protected from '../../components/protected/Protected';
import Login from '../../components/user/Login';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

// This component is the Appbar component for the Dashboard.
export default function Dashboard() {
	// This state is for opening and closing the drawer. It gets passed to the child component SideList
	const [open, setOpen] = useState(false);
	// This ist the state for the dark mode
	const [dark, setDark] = useState(false);

	// Here we create the dark theme.
	// useMemo is a hook which only creates this object when the dependency changes. Not with every rerender of the component.
	const darkTheme = useMemo(
		() =>
			createTheme({
				// If th dark state is true, the dark theme coming from Mui 5 is activated
				palette: {
					mode: dark ? 'dark' : 'light',
				},
			}),
		[dark]
	);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	// Here we use the hook navigate to navigate when clicking on a icoon in the Appba. In our case to navigate to HomePage
	const navigate = useNavigate();

	return (
		// We have to wrap the whhole JSX into a ThemeProvider for the dark theme.
		// Then we have to pass the theme we created above
		<ThemeProvider theme={darkTheme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position='fixed' open={open}>
					<Toolbar>
						<IconButton
							color='inherit'
							aria-label='open drawer'
							// This opens the drawer
							onClick={handleDrawerOpen}
							edge='start'
							sx={{
								marginRight: 5,
								...(open && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						{/* This is the home icon */}
						<Tooltip title='Go back to home page'>
							{/* Clickable icons have to be wrapped in IconButton in Mui */}
							<IconButton
								sx={{ mr: 1 }}
								onClick={() => navigate('/')} // Navigating to home page
							>
								<Home sx={{ color: 'white' }} />
							</IconButton>
						</Tooltip>
						<Typography
							variant='h6'
							noWrap
							component='div'
							// This pushes the icon for dark mode to the end of the bar
							sx={{ flexGrow: 1 }}
						>
							Dashboard
						</Typography>
						{/* Icon to toggle between dark and light mode */}
						<IconButton onClick={() => setDark(!dark)}>
							{dark ? (
								<Brightness7 />
							) : (
								<Brightness4 sx={{ color: 'white' }} />
							)}
						</IconButton>
					</Toolbar>
				</AppBar>
				<Protected>
					<SideList {...{ open, setOpen }} />
				</Protected>
			</Box>
			<Login />
		</ThemeProvider>
	);
}
