import React, { useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import MuiDrawer from '@mui/material/Drawer';
import {
	Avatar,
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip,
	Typography,
	styled,
} from '@mui/material';
import {
	ChevronLeft,
	Dashboard,
	KingBed,
	Logout,
	MarkChatUnread,
	NotificationsActive,
	PeopleAlt,
} from '@mui/icons-material';

import { useValue } from '../../context/ContextProvider';

import Main from './main/Main';
import Users from './users/Users';
import Rooms from './rooms/Rooms';
import Requests from './requests/Requests';
import Messages from './messages/Messages';
import { storeRoom } from '../../actions/room';
import { logout } from '../../actions/user';
import useCheckToken from '../../hooks/useCheckToken';
import isAdmin from './utils/isAdmin';

const drawerWidth = 240;

// Styling for the drawer
const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

// This is the main component of the dashboard. It contains the drawer ont the left side and the content section on the right side.
const SideList = ({ open, setOpen }) => {
	// A frontend security layer to prevent  access to the dashboard when the token is expired:
	useCheckToken(); // This is a custom hook that checks the token and logs out the user if it is expired

	// Importing the user from the global state:
	const {
		state: {
			currentUser,
			location,
			details,
			images,
			updatedRoom,
			deletedImages,
			addedImages,
		},
		dispatch,
	} = useValue();

	// This state is used to highlight the active list item in the drawer. Default is the main component
	const [selectedLink, setSelectedLink] = useState('');

	// We create a list as an array of objects. Every object represents a component
	// This is needed because we show different icons depending on the status of the user.
	// We use useMemo to avoid re-rendering of the list. For  example, when we navigate to the users page, the list will not re-render. This is because the list is not dependent on any state or props.
	const list = useMemo(
		() => [
			// We check if the user is an admin or editor. If true, we show the users, rooms, requests, and messages components. If false, we show only the Rooms component.
			...(isAdmin(currentUser)
				? [
						{
							title: 'Main',
							icon: <Dashboard />,
							link: '',
							component: (
								<Main {...{ setSelectedLink, link: '' }} />
							), // Here we have to pass the setter and the link to the component to highlite active link
						},
						{
							title: 'Users',
							icon: <PeopleAlt />,
							link: 'users',
							component: (
								<Users
									{...{ setSelectedLink, link: 'users' }}
								/>
							),
						},
				  ]
				: []),

			{
				title: 'Rooms',
				icon: <KingBed />,
				link: 'rooms',
				component: <Rooms {...{ setSelectedLink, link: 'rooms' }} />,
			},
			{
				title: 'Requests',
				icon: <NotificationsActive />,
				link: 'requests',
				component: (
					<Requests {...{ setSelectedLink, link: 'requests' }} />
				),
			},
			{
				title: 'Messages',
				icon: <MarkChatUnread />,
				link: 'messages',
				component: (
					<Messages {...{ setSelectedLink, link: 'messages' }} />
				),
			},
		],
		[currentUser]
	);

	// Temporarily forwarding user to home page after logout so that he can login again
	const navigate = useNavigate();

	// Function for logout. Clears user information
	const handleLogout = () => {
		// Before logout the user information hass to be stored in local storage:
		storeRoom(
			location,
			details,
			images,
			updatedRoom,
			deletedImages,
			addedImages,
			currentUser.id
		);

		// After storing the room we can logout the user:
		logout(dispatch);
	};

	return (
		<>
			<Drawer variant='permanent' open={open}>
				<DrawerHeader>
					{/* This closes the drawer */}
					<IconButton
						onClick={() => {
							setOpen(false);
						}}
					>
						<ChevronLeft />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{/* Here we iterate over the list array */}
					{list.map((item) => (
						<ListItem
							key={item.title}
							disablePadding
							sx={{ display: 'block' }}
						>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5,
								}}
								// Adding a onClick action:
								onClick={() => navigate(item.link)}
								// This selected property checks the selectedLink state. If true, it is highlited
								selected={selectedLink === item.link}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center',
									}}
								>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									primary={item.title}
									sx={{ opacity: open ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
				{/* Here we have the user information */}
				{/* Styling keeps context in the center */}
				<Box sx={{ mx: 'auto', mt: 3, mb: 1 }}>
					{/* Iff name  of user is undefined we have empty string to avoid error */}
					<Tooltip title={currentUser?.name || ''}>
						<Avatar
							src={currentUser?.photoUrl}
							// When we open drawer it needs to be bigger. Then different styling
							{...(open && { sx: { width: 100, height: 100 } })}
						/>
					</Tooltip>
				</Box>
				<Box sx={{ textAlign: 'center' }}>
					{/* When drawer open we show username */}
					{open && <Typography>{currentUser?.name}</Typography>}
					<Typography variant='body2'>
						{/* Showing authorization status = role */}
						{currentUser?.role || 'role'}
					</Typography>
					{/* When drawer open we show email */}
					{open && (
						<Typography variant='body2'>
							{currentUser?.email}
						</Typography>
					)}
					{/* Logout Icon */}
					<Tooltip title='Logout' sx={{ mt: 1 }}>
						<IconButton onClick={handleLogout}>
							<Logout />
						</IconButton>
					</Tooltip>
				</Box>
			</Drawer>
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				{/* We need  this to have a space as  high as the header */}
				{/* The property component=main renders a main HTML element*/}
				<DrawerHeader />
				{/* Here is the content section of Dashboard */}
				{/* We route to the components */}
				<Routes>
					{/* Looping over the list array and extacting the link properties to then show component in thee main section on the right side */}
					{list.map((item) => (
						<Route
							key={item.title}
							path={item.link}
							element={item.component}
						/>
					))}
					{/* We have to add a default route because we need a conditional rendering depending on the roles of the user */}
					<Route
						path='*'
						element={
							isAdmin(currentUser) ? (
								<Main {...{ setSelectedLink, link: '' }} /> // If the user is an admin or editor, we show the Main component as default route.
							) : (
								<Rooms
									{...{ setSelectedLink, link: 'rooms' }}
								/> // If the user is not an admin or editor, we show the Rooms component as default route.
							)
						}
					/>
				</Routes>
			</Box>
		</>
	);
};

export default SideList;
