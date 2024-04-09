import React, { useState } from "react";

import {
	AppBar,
	Toolbar,
	Box,
	IconButton,
	Typography,
	Button,
} from "@mui/material";
import { Container } from "@mui/system";
import { Menu, Lock } from "@mui/icons-material";

import { useValue } from "../context/ContextProvider";

import UserIcons from "./user/UserIcons";
import { OPEN_LOGIN } from "../constants/actionTypes";
import Sidebar from "./sidebar/Sidebar";

const NavBar = () => {
	// Extracting the current user from state wth hook useValue:
	const {
		state: { currentUser },
		dispatch,
	} = useValue();
	// This is the state controlling wheher the sidebar is open or closed
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<AppBar>
				<Container maxWidth="lg">
					<Toolbar disableGutters>
						<Box sx={{ mr: 1 }}>
							<IconButton
								size="large"
								color="inherit"
								// Opens the Drawer on Hamburger
								onClick={() => setIsOpen(true)}
							>
								<Menu />
							</IconButton>
						</Box>
						<Typography // Big screen
							variant="h6"
							component="h1"
							noWrap
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
							}}
						>
							You Are Welcome
						</Typography>
						<Typography // Small screen
							variant="h6"
							component="h1"
							noWrap
							sx={{
								flexGrow: 1,
								display: { xs: "flex", md: "none" },
							}}
						>
							YRW
						</Typography>
						{!currentUser ? (
							<Button
								color="inherit"
								startIcon={<Lock />}
								// The onClick sets the currentUser to a user object so it becomes true. Then UserIcons will be shown
								onClick={() => dispatch({ type: OPEN_LOGIN })}
							>
								Login
							</Button>
						) : (
							<UserIcons />
						)}
					</Toolbar>
				</Container>
			</AppBar>
			{/* This forces the components to be shown. Otherwise they would be hidden under the NavBar cause it is absolute */}
			<Toolbar />
			<Sidebar {...{ isOpen, setIsOpen }} />
		</>
	);
};

export default NavBar;
