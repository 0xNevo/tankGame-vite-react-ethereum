import React, {useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FortIcon from '@mui/icons-material/Fort';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import TankItem from './TankItem';

import {ethers} from '../ethers';
import * as C from '../const';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StartPage = ( props ) => {
	// for notification ~from here
	const [state, setState] = React.useState({
		snack: false,
		vertical: 'bottom',
		horizontal: 'right',
		message: 'Betting Started',
		color: 'success'
	});

	const { vertical, horizontal, snack, message, color } = state;

	const handleSnackClose = () => {
		setState({ ...state, snack: false });
	};
	// for notification ~end

	const account = localStorage.getItem( "tank_account" );			// import data from local storage
	const pName1 = localStorage.getItem( 'tank1_name' );
	const pName2 = localStorage.getItem( 'tank2_name' );
	const img1 = localStorage.getItem( 'tank1_img' );
	const img2 = localStorage.getItem( 'tank2_img' );

	const tankMintContractWithSigner = props.tankMintContractWithSigner;
	const [ betFlg, setBetFlg ] = useState( false );						// Flg for betting

	const handleBetting = ( e ) => {
		bettingEther();
	}

	// Function to bet contract
	const bettingEther = async () => {
		setBetFlg( true );
		const options = {value: ethers.utils.parseEther( C.ETHER )}
		
		try {
			setBetFlg( true );
			const tx = await tankMintContractWithSigner.bettingEther( C.AMOUNT, options );
			await tx.wait();
			console.log('Betting Success!');

			setState({ 
				snack: true, 
				message: 'Betting Started: 0.001Ether',
				vertical: 'bottom',
				horizontal: 'right',
				color: 'success'
			});
			
			setTimeout(() => {
				location.href = "battle"
			}, 2000);
		} catch (error) {
			console.log(error);

			setState({ 
				snack: true, 
				message: 'Something wrong',
				vertical: 'bottom',
				horizontal: 'right',
				color: 'warning'
			});
		}
	}
	
	return (
		account
		? <Grid container flex direction="column" justifyContent="center" alignItems="center">
			<Grid container item flex justifyContent="flex-end" alignItems="center">
				<Box
					sx={{ 
						bgcolor: '#ffffff', 
						border: 'none', 
						marginTop: '10px',
						marginBottom: '20px',
						marginRight: '30px'
					}} 
				/>
			</Grid>
			<Grid container item flex justifyContent="center" alignItems="center">
				<Grid container flex direction="column" justifyContent="center" alignItems="center">
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							justifyContent: 'space-between',
                            alignItems: 'center',
							overflow: 'hidden',
							boxShadow: 1,
							fontWeight: 'bold',
							padding: '60px',
							marginTop: '60px',
						}}
					>
						<TankItem 
							pName = {pName1}
							img = { img1 }
						/>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								alignItems: 'center',
								overflow: 'hidden',
							}}
						>
							<Fab variant="extended" sx={{
									width: "15rem",
									height: "5rem",
									backgroundColor: 'white',
									marginTop: '23vh',
									fontSize: '2.5rem',
								}}
								disabled = { betFlg ? true : false }
								onClick = { handleBetting }
							>
								<FortIcon sx={{ mr: 1, fontSize: '2.5rem' }} />
								V S
							</Fab>
							<Typography>
								Bet: 0.001Ether
							</Typography>
						</Box>
						<TankItem 
							pName = {pName2}
							img = { img2 }
						/>
					</Box>
				</Grid>
			</Grid>
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
		</Grid>
		:
			<Button variant="contained" href="/">
				Redirect
			</Button>
	);
}

export default StartPage;