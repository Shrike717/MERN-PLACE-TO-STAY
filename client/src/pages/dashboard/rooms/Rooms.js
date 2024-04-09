import React, { useEffect, useMemo, useState } from 'react';

import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { useValue } from '../../../context/ContextProvider';
import moment from 'moment';
import { getRooms } from '../../../actions/room';
import RoomsActions from './RoomsActions';
import isAdmin from '../utils/isAdmin';

const Rooms = ({ setSelectedLink, link }) => {
	// Extracting the rooms from global state:
	const {
		state: { rooms, currentUser },
		dispatch,
	} = useValue();
	// console.log('This are the rooms in the Rooms component:', rooms);

	// This state is needed to set the users per page:
	const [pageSize, setPageSize] = useState(5);

	// Setting the selected link on the first render of the component
	useEffect(() => {
		setSelectedLink(link);
		// If there are no rooms we get them from the server:
		if (rooms.length === 0) getRooms(dispatch);
	}, []);

	// Here we create the columns:
	const columns = useMemo(
		() => [
			// It's an array of objects:
			// The objects have to match the prooperties of the data we get from the server. In this case the rooms.
			// renderCell is to show the avatar image. There we receive the params of the DataGrid. From there the Url to the photo
			{
				field: 'images',
				headerName: 'Photo',
				width: 70,
				renderCell: (params) => (
					<Avatar src={params.row.images[0]} variant='rounded' />
				),
				sortable: false,
				filterable: false,
			},
			{
				field: 'price',
				headerName: 'Cost',
				width: 70,
				renderCell: (params) => '$' + params.row.price,
			},
			{ field: 'title', headerName: 'Title', width: 170 },
			{ field: 'description', headerName: 'Description', width: 200 },
			{ field: 'lng', headerName: 'Longitude', width: 110 },
			{ field: 'lat', headerName: 'Latitude', width: 110 },
			{
				field: 'uName',
				headerName: 'Added by',
				width: 80,
				renderCell: (params) => (
					// A tooltip is a component that when you hover over it, a tooltip appears showing the user's name.
					<Tooltip title={params.row.uName}>
						<Avatar src={params.row.uPhoto} />
					</Tooltip>
				),
			},
			{
				field: 'createdAt',
				headerName: 'Created At',
				width: 200,
				renderCell: (params) =>
					moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
			},
			// To save changes we need to  know the id of the row but we don't want to show it
			{ field: '_id', hide: true },
			// To save changes we need a special action field
			{
				field: 'actions',
				headerName: 'Actions',
				type: 'actions',
				width: 150,
				renderCell: (params) => <RoomsActions {...{ params }} />, // With params we pass the data of the  row to the component. And the state which specifiees the active row
			},
		],
		[]
	);

	return (
		<Box sx={{ height: 400, width: '100%' }}>
			<Typography
				variant='h3'
				component='h3'
				sx={{ textAlign: 'center', mt: 3, mb: 3 }}
			>
				Manage Rooms
			</Typography>
			{/* This component is a special component from Mui. We need to install @mui/x-data-grid */}
			{/* The columns specify the fields, rows are the data of the grid */}
			{/* The DataGrid needs Id's for every field. We grap the room Id*/}
			<DataGrid
				columns={columns}
				// Here we need a condition to check whether a user is an admin / editor or not. If user is only a basic user, he only sees his own rooms
				rows={
					isAdmin(currentUser)
						? rooms
						: rooms.filter((room) => room.uid === currentUser.id)
				}
				getRowId={(row) => row._id}
				rowsPerPageOptions={[5, 10, 20]}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // This sets the pageSize to the chosen new pageSize
				pageSizeOptions={[5, 10, 20]} // Options for number of users per page
				getRowSpacing={(params) => ({
					top: params.isFirstVisible ? 0 : 5, // No gap on top of first row
					bottom: params.isLastVisible ? 0 : 5, // No gap on top of last row
				})} // Options for spacing between rows
				sx={{
					[`& .${gridClasses.row}`]: {
						// gridClasses is imported from @mui/x-data-grid and gets classname of the row
						bgcolor: (theme) =>
							theme.palette.mode === 'light'
								? grey[200]
								: grey[900],
					}, // Changing style of every second row
				}}
			/>
		</Box>
	);
};

export default Rooms;
