import React, { useEffect, useMemo, useState } from 'react';

import { Avatar, Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { useValue } from '../../../context/ContextProvider';
import { getUsers } from '../../../actions/user';
import moment from 'moment';
import UsersActions from './UsersActions';

const Users = ({ setSelectedLink, link }) => {
	// Extracting the users from global state:
	const {
		state: { users, currentUser },
		dispatch,
	} = useValue();

	// This state is needed to set the users per page:
	const [pageSize, setPageSize] = useState(5);

	// This state is needed to specify which row is active right now
	const [rowId, setRowId] = useState(null);

	// Setting the selected link on the first render of the component
	useEffect(() => {
		setSelectedLink(link);
		// If there are no users we get them from the server:
		if (users.length === 0) getUsers(dispatch, currentUser);
	}, []);

	// Here we create the columns:
	const columns = useMemo(
		() => [
			// It's an array of objects:
			// renderCell is to show the avatar imagge. There we receive the params of the DataGrid. Frrom there the Url to the photo
			{
				field: 'photoUrl',
				headerName: 'Avatar',
				width: 60,
				renderCell: (params) => <Avatar src={params.row.photoUrl} />,
				sortable: false,
				filterable: false,
			},
			{ field: 'name', headerName: 'Name', width: 170 },
			{ field: 'email', headerName: 'Email', width: 200 },
			{
				field: 'role',
				headerName: 'Role',
				width: 100,
				type: 'singleSelect',
				valueOptions: ['basic', 'editor', 'admin'],
				editable: currentUser?.role === 'admin',
			},
			{
				field: 'active',
				headerName: 'Active',
				width: 100,
				type: 'boolean',
				editable: currentUser?.role === 'admin',
			},
			{
				field: 'createdAt',
				headerName: 'Created At',
				width: 200,
				renderCell: (params) =>
					moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
			},
			{ field: '_id', headerName: 'Id', width: 220 },
			// To save changes we need a special acton field
			{
				field: 'actions',
				headerName: 'Actions',
				type: 'actions',
				renderCell: (params) => (
					<UsersActions {...{ params, rowId, setRowId }} />
				), // With params we pass the data of the  row to the component. And the state which specifiees the active row
			},
		],
		[rowId] // The dependency: When there is a change in the row we need to rerender our buttons
	);

	return (
		<Box sx={{ height: 400, width: '100%' }}>
			<Typography
				variant='h3'
				component='h3'
				sx={{ textAlign: 'center', mt: 3, mb: 3 }}
			>
				Manage Users
			</Typography>
			{/* This component is a speciall component from Mui. We need to install @mui/x-data-grid */}
			{/* The columns specify the fields, rows are the data of the grid */}
			{/* The DataGrid needs Id's for every field.. We grap the user Id*/}
			<DataGrid
				columns={columns}
				rows={users}
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
				// Here we set the rowId:
				onCellEditCommit={(params) => setRowId(params.id)}
				// processRowUpdate={(updatedRow, originalRow) =>
				//     setRowId(params.rowId)
				//   }
			/>
		</Box>
	);
};

export default Users;
