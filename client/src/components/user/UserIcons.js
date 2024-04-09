import React, { useState } from "react";

import { Box, IconButton, Badge, Tooltip, Avatar } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useValue } from "../../context/ContextProvider";

import UserMenu from "./UserMenu";
import useCheckToken from "../../hooks/useCheckToken";

const UserIcons = () => {
	useCheckToken(); // Checks expiry date of token
	const {
		state: { currentUser },
	} = useValue();

	// This state defines the anchor element of the UserMenu. In this case Avatar
	const [anchorUserMenu, setAnchorUserMenu] = useState(null);

	return (
		<Box>
			<IconButton size="large" color="inherit">
				<Badge color="error" badgeContent={5}>
					<MailIcon />
				</Badge>
			</IconButton>
			<IconButton size="large" color="inherit">
				<Badge color="error" badgeContent={20}>
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<Tooltip title="Open User Settings">
				{/* The onClick sets the anchor for UserMenu to the Avatar Icon */}
				<IconButton onClick={(e) => setAnchorUserMenu(e.currentTarget)}>
					<Avatar src={currentUser?.photoUrl} alt={currentUser?.name}>
						{currentUser?.name?.charAt(0).toUpperCase()}
					</Avatar>
				</IconButton>
			</Tooltip>
			<UserMenu {...{ anchorUserMenu, setAnchorUserMenu }} />
		</Box>
	);
};

export default UserIcons;
