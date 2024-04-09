import CircularProgress from "@mui/material/CircularProgress";
import { Backdrop } from "@mui/material";

import { useValue } from "../context/ContextProvider";

const Loading = () => {
	// Importing global state with useValue hook
	const {
		state: { loading },
	} = useValue();

	return (
		<Backdrop
			open={loading}
			sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }} // Sets Loader 1 above modal.
		>
			<CircularProgress sx={{ color: "white" }} />
		</Backdrop>
	);
};

export default Loading;
