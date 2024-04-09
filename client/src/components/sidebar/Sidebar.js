import React from "react";
import { Box, Drawer, IconButton, Typography, styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { useValue } from "../../context/ContextProvider";
import PriceSlider from "./PriceSlider";

// Defiining a styled component. We have to make the Drawer the same height as the main menu
const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: theme.spacing(0, 1), // 1: Left and right 8pxs
	...theme.mixins.toolbar, // This gives the drawer the same height as the main menu. Sx wouldn't be working
}));

const Sidebar = ({ isOpen, setIsOpen }) => {
	const { containerRef } = useValue();
	return (
		// Persistent: not closing automatically. Usr has  to close i
		<Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
			<DrawerHeader>
				<Typography>Apply Search or Filter</Typography>
				{/* Closes drawer */}
				<IconButton onClick={() => setIsOpen(false)}>
					<ChevronLeftIcon fontSize="large" />
				</IconButton>
			</DrawerHeader>
			{/* Contains search input box and price slider */}
			<Box sx={{ width: 240, p: 3 }}>
				{/* We need the ref because we inject the geocoder input inside the search box */}
				<Box ref={containerRef}></Box>
				<PriceSlider />
			</Box>
		</Drawer>
	);
};

export default Sidebar;
