import { useEffect, useState } from "react";

import { Box, Stack, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useValue } from "../../../context/ContextProvider";

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"]; // colors for pie charts
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};
export default function PieRoomsCost() {
	// Getting rooms from global state:
	const {
		state: { rooms },
	} = useValue();
	// his state we created foor the  data:
	const [costGroups, setCostGroups] = useState([]);

	// This useEffect
	useEffect(() => {
		let free = 0,
			lessThan15 = 0,
			between15And35 = 0,
			moreThan35 = 0;
		// Now we loop over the rooms and check price for every room:
		rooms.forEach((room) => {
			if (room.price === 0) return free++; // If price is 0 we return and increment variable free by 1
			if (room.price < 15) return lessThan15++; // If price is less than 15 we return and increment variable lessThan15 by 1
			if (room.price <= 35) return between15And35++; // If price is bigger than 15 but less than 35 we return and increment variable between15And35 by 1
			return moreThan35++; // If price is above 35 we increment variable moreThan35 by 1
		});
		// Now we set the state. It's an array of objects. Every object has a name and a qty value which are the variables above.
		// setCostGroups([
		// 	{ name: "Free Stay", qty: free },
		// 	{ name: "Less Than $15", qty: lessThan15 },
		// 	{ name: "Between $15 and $35", qty: between15And35 },
		// 	{ name: "More Than $35", qty: moreThan35 },
		// ]);

		// Now we set the state. It's an array of objects. Every object has a name and a qty value which are the variables above.
		// We only push an object into he array when it is > 0. This avoids displaying the chart in a strange way when one value is 0.
		let newArr = [];
		if (free !== 0) newArr.push({ name: "Free Stay", qty: free });
		if (lessThan15 !== 0)
			newArr.push({ name: "Less Than $15", qty: lessThan15 });
		if (between15And35 !== 0)
			newArr.push({ name: "Between $15 and $35", qty: between15And35 });
		if (moreThan35 !== 0)
			newArr.push({ name: "More than $35", qty: moreThan35 });
		setCostGroups(newArr);
	}, [rooms]);

	return (
		// We add a Box to make it responsive for all screens
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-evenly",
				flexWrap: "wrap", // This forces the colors go down when not enough space
			}}
		>
			<PieChart width={200} height={200}>
				<Pie
					data={costGroups} // This is the state array
					labelLine={false}
					label={renderCustomizedLabel}
					outerRadius={80}
					fill="#8884d8"
					dataKey="qty"
				>
					{costGroups.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				{/* This shows little info window when hover over chart */}
				<Tooltip />
			</PieChart>
			{/* This section is  for the colors */}
			<Stack gap={2}>
				<Typography variant="h6">Rooms Cost</Typography>
				{/* This forces the colors go down when not enough space */}
				<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
					{COLORS.map((color, index) => (
						<Stack
							key={color}
							alignItems="center"
							spacing={1} // spacing is the same as gap
						>
							{/* Box for the color. color is the color we receive froom the loop*/}
							<Box
								sx={{
									width: 20,
									height: 20,
									background: color,
								}}
							/>
							<Typography variant="body2" sx={{ opacity: 0.7 }}>
								{costGroups[index]?.name}
							</Typography>
						</Stack>
					))}
				</Box>
			</Stack>
		</Box>
	);
}
