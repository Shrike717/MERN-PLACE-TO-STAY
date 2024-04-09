import React from "react";
import { Box, Slider, Typography } from "@mui/material";

import { useValue } from "../../context/ContextProvider";
import { FILTER_PRICE } from "../../constants/actionTypes";

// Setting the marks or the Slider as an array:
const marks = [
	{ value: 0, label: "$0" },
	{ value: 25, label: "$25" },
	{ value: 50, label: "$50" },
];

const PriceSlider = () => {
	const {
		state: { priceFilter },
		dispatch,
	} = useValue();
	return (
		<Box sx={{ mt: 5 }}>
			<Typography>Max Price: {"$ " + priceFilter}</Typography>
			<Slider
				min={0}
				max={50}
				defaultValue={50}
				valueLabelDisplay="auto" // This means we see the value label when we hover over slider
				marks={marks}
				value={priceFilter} // The valuu from the global context state
				onChange={
					(e, price) =>
						dispatch({ type: FILTER_PRICE, payload: price }) // price  is the new price on change. Coming from where??
				}
			/>
		</Box>
	);
};

export default PriceSlider;
