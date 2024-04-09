import { useEffect, useState } from "react";
import moment from "moment";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useValue } from "../../../context/ContextProvider";

// Here we define our own data:
const months = 5;
const today = new Date();
const tempData = [];
// With this loop we create our months
for (let i = 0; i < months; i++) {
	// Create dates for the last 5 months
	const date = new Date(
		today.getFullYear(),
		today.getMonth() - (months - (i + 1)) // (months - (i + 1)) means: 5 months back from today in x axis
	);
	tempData.push({
		date,
		name: moment(date).format("MMM YYYY"),
		users: 0,
		rooms: 0,
	});
}

export default function AreaRoomsUsers() {
	// Extracting rooms and users from global state
	const {
		state: { rooms, users },
	} = useValue();
	// This is the state for the data
	const [data, setData] = useState([]);
	// console.log(data);

	// This useEffect resets the number of users for every month in the array when there is a change of the users in global state
	// First set them to 0, then count the users for every needed month andd then set the state
	useEffect(() => {
		// We loop through the months
		for (let i = 0; i < months; i++) {
			// And  set the number of users to 0 for every month
			tempData[i].users = 0;
		}
		// Then looping through he users and compare the date of user creation the these months
		users.forEach((user) => {
			// For each user we loop through the months
			for (let i = 0; i < months; i++) {
				// If the month (and year) of user creaation matches a month in the array (last 5 months)
				if (moment(tempData[i].date).isSame(user?.createdAt, "month"))
					// Then we increase the number of users in this month by 1
					return tempData[i].users++;
			}
		});
		// Then we update the state with this data
		setData([...tempData]);
	}, [users]);

	// This useEffect resets the number of rooms for every month in the array when there is a change of the rooms in global state
	// First set them to 0, then count the rooms for every needed month andd then set the state
	useEffect(() => {
		// We loop through the months
		for (let i = 0; i < months; i++) {
			// And  set the number of rooms to 0 for every month
			tempData[i].rooms = 0;
		}
		// Then looping through he rooms and compare the date of user creation the these months
		users.forEach((room) => {
			// For each user we loop through the months
			for (let i = 0; i < months; i++) {
				// If the month (and year) of user creaation matches a month in the array (last 5 months)
				if (moment(tempData[i].date).isSame(room?.createdAt, "month"))
					// Then we increase the number of rooms in this month by 1
					return tempData[i].rooms++;
			}
		});
		// Then we update the state with this data
		setData([...tempData]);
	}, [rooms]);

	return (
		// Here we add a div to apply our style
		<div style={{ width: "100%", height: 300, minWidth: 250 }}>
			{/* Here we add the responsiveContainer from recharts package */}
			<ResponsiveContainer>
				<AreaChart
					data={data} // The data which is being rendered in the chart
					margin={{
						top: 10,
						right: 10,
						left: 0,
						bottom: 0,
					}}
				>
					{/* The Y axis is created dynamically depending on the amount of users and rooms */}
					{/* The X axis is predefined with 5 names of the months. This is the name property in every object in the data array*/}
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Area
						type="monotone"
						dataKey="users" // This is the users property in every object in the data array
						stackId="1"
						stroke="#8884d8"
						fill="#8884d8"
					/>
					<Area
						type="monotone"
						dataKey="rooms" // This is the rooms property in every object in the data array
						stackId="1"
						stroke="#82ca9d"
						fill="#82ca9d"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
