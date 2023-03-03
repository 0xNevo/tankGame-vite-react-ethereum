import React, { Fragment, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import * as C from '../const';

// for notification ~from here
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomDialog = ( props ) => {
	const [state, setState] = React.useState({
		snack: false,
		vertical: 'bottom',
		horizontal: 'right',
		message: 'Game Ended',
		color: 'success'
	});

	const { vertical, horizontal, snack, message, color } = state;

	const handleSnackClose = () => {
		setState({ ...state, snack: false });
	};
	// for notification ~end

	// for Dialog
	const open = props.open;
	const setOpen = props.setOpen;
	const winnerName = props.winnerName;
	
	const handleClose = () => {
		localStorage.clear();
		setOpen(false);
		
		setTimeout(() => {
			location.href="/"
		}, 300);
	};

	const handleClaim = () => {
		localStorage.clear();
		handleToWinners();
	}

	const tankMintContractWithSigner = props.tankMintContractWithSigner;
	const [ endFlg, setEndFlg ] = useState( false );						// Flg for game ended
	const [ endRFlg, setEndRFlg ] = useState( false );						// Flg for game ended
	
	const handleToWinners = ( ) => {										// handle for paying to winners
		toWinner();
	}
	
	// Function to send reward to the winner
	const toWinner = async () => {	
		setEndFlg( true );
		try {
			const tx = await tankMintContractWithSigner.sendRewardToWinner( C.WINNER, C.AMOUNT );
			await tx.wait();
			console.log('Reward sent to the winner!');
			setEndRFlg( true );

			setState({ 
				snack: true, 
				message: `${winnerName} has ${C.ETHER}`,
				vertical: 'bottom',
				horizontal: 'right',
				color: 'success'
			});

			setTimeout(() => {
				location.href = "/";
			}, 3000);
		} catch (error) {
			console.log(error);

			setState({ 
				snack: true, 
				message: 'Something went wrong!',
				vertical: 'bottom',
				horizontal: 'right',
				color: 'warning'
			});
		}
	}
	
	return (
		<Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={"sm"}
				open={open}
			>
				<DialogTitle> Result </DialogTitle>
				<Divider/>
				<DialogContent sx={{
					height: '8rem'
				}}>
					<Grid container flex justifyContent="center" alignItems="center">
						<EmojiEventsIcon sx={{
							width: '7rem', height: '7rem',
							boxShadow: '0 0 0.25em 0.25em rgba(0, 0, 0, 0.25)',
							borderRadius: '3vw 4vw 8vw 2vw',
							color: 'gold'
						}}/>
						<Typography variant='h1'>
							{ winnerName } 
						</Typography>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button 
						variant="contained"
						onClick={ handleClose }
						disabled = { !endRFlg }
					>
						Restart
					</Button>
					<Button 
						onClick={ handleClaim } 
						variant="contained"
						disabled = {endFlg}
					>
						Claim Reward
					</Button>
				</DialogActions>
				<Snackbar 
					anchorOrigin={{ vertical, horizontal }}
					open={snack} 
					autoHideDuration={3000} 
					onClose={handleSnackClose}
					key={vertical + horizontal}
				>
					<Alert onClose={handleSnackClose} severity={color} sx={{ width: '100%' }}>
						{ message }
					</Alert>
				</Snackbar>
			</Dialog>
		</Fragment>
	);
}

export default CustomDialog;