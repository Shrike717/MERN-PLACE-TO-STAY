import React, { useState } from 'react';
import {
	FormControl,
	FormControlLabel,
	RadioGroup,
	Stack,
	Radio,
	TextField,
	InputAdornment,
} from '@mui/material';

import { useValue } from '../../../context/ContextProvider';
import { UPDATE_DETAILS } from '../../../constants/actionTypes';
import InfoField from './InfoField';

// This component is responsible for the fields to fill in detail info when creating a room
const AddDetails = () => {
	// Extracting the details state:
	const {
		state: {
			details: { title, description, price },
		},
		dispatch,
	} = useValue();

	// State for the costType: If is 1 we have a nomnial fee, when 0 it's a free stay
	const [costType, setCostType] = useState(price ? 1 : 0);

	const handleCostTypeChange = (e) => {
		// Changin the string to a number
		const costType = Number(e.target.value);
		// And setting sttat to be this value
		setCostType(costType);
		// Checking if the costType is nominal fee or free stay
		if (costType === 0) {
			dispatch({ type: UPDATE_DETAILS, payload: { price: 0 } });
		} else {
			dispatch({ type: UPDATE_DETAILS, payload: { price: 15 } }); // $15 default price as sugestion
		}
	};

	// Function to change the price:
	const handlePriceChange = (e) => {
		dispatch({ type: UPDATE_DETAILS, payload: { price: e.target.value } });
	};

	return (
		// the Stack component is a flexbox
		<Stack
			sx={{
				alignItems: 'center',
				'& .MuiTextField-root': { width: '100%', maxWidth: 500, m: 1 },
			}}
		>
			<FormControl>
				<RadioGroup
					name='costType'
					value={costType}
					row
					onChange={handleCostTypeChange}
				>
					<FormControlLabel
						value={0}
						control={<Radio />}
						label='Free Stay'
					/>
					<FormControlLabel
						value={1}
						control={<Radio />}
						label='Nominal Fee'
					/>
					{/* Checking costType as boolean. If 0 it will be false */}
					{Boolean(costType) && (
						<TextField
							sx={{ width: '7ch !important' }}
							variant='standard'
							InputProps={{
								//  These are the properties from Mui
								startAdornment: (
									<InputAdornment position='start'>
										$
									</InputAdornment>
								),
							}}
							inputProps={{ type: 'number', min: 1, max: 50 }} // These are the properties for HTML
							value={price}
							onChange={handlePriceChange}
							name='price'
						></TextField>
					)}
				</RadioGroup>
			</FormControl>
			{/* Showing InfoField component twice. One for title, one for description */}
			<InfoField
				mainProps={{ name: 'title', label: 'Title', value: title }}
				minLength={5}
			/>
			<InfoField
				mainProps={{
					name: 'description',
					label: 'Description',
					value: description,
				}}
				minLength={10}
				optionalProps={{ multiline: true, rows: 4 }}
			/>
		</Stack>
	);
};

export default AddDetails;
