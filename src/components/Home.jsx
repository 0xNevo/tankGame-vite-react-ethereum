 // Toggle connection to MetaMask
import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// for Notification
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledButton = styled(Button)({
	position: 'absolute',
	zIndex: 1,
	top: -30,
	left: 0,
	right: 0,
	margin: '0 auto',
	width: '120px'
});

const Home = (props) => {
	// for notification ~from here
	const [state, setState] = React.useState({
		snack: false,
		vertical: 'bottom',
		horizontal: 'right',
		message: 'Wallet Connected',
		color: 'success'
	});

	const { vertical, horizontal, snack, message, color } = state;

	const handleSnackClose = () => {
		setState({ ...state, snack: false });
	};
	// for notification ~end

	const isMetamaskInstalled = props.isMetamaskInstalled; 			// metamask is installed
	const setIsMetamaskInstalled = props.setIsMetamaskInstalled;	
	const [account, setAccount] = useState(null);					// wallet account initialize
	
	useEffect(() => {
		if(window.ethereum){
			setIsMetamaskInstalled(true);
		}
	},[]);

	//Connect to User Wallet
	const connectWallet = async () => {
		//to get around type checking
		window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setAccount(accounts[0]);
				localStorage.setItem('tank_account', accounts[0]);
				console.log('Wallet Connected');

				setState({ 
					snack: true, 
					message: 'Wallet Connected',
					vertical: 'bottom',
					horizontal: 'right',
					color: 'success'
				});
			})
			.catch((error) => {
				console.log(`Something went wrong: ${error}`);
				setState({ 
					snack: true, 
					message: 'Wallet Connected',
					vertical: 'bottom',
					horizontal: 'right',
					color: 'warning'
				});
			});
	}

	//Disconnect User Wallet
	const disconnectWallet = async () => {
		window.ethereum
            .request({
                method: "eth_requestAccounts",
				params: {}
            })
            .then((accounts) => {
				setAccount(null);
				localStorage.setItem('tank_account', "");
				console.log('Wallet Disconnected');
				
				setState({ 
					snack: true, 
					message: 'Wallet Disconnected',
					vertical: 'bottom',
					horizontal: 'right',
					color: 'success'
				});
            })
            .catch((error) => {
                console.log(`Something went wrong: ${error}`);
				setState({ 
					snack: true, 
					message: 'Wallet Disonnected',
					vertical: 'bottom',
					horizontal: 'right',
					color: 'warning'
				});
            });
	}

	// For printing wallet address to connect button
	const displayAddress = ( _val ) => {
		let tmp = _val;

		if( _val.length ){
			tmp = _val.slice(0,5);
			tmp += "...";
			tmp += _val.slice(-5);

			return tmp;
		}

		return null;
	}
	
	return (
		<Grid container flex direction="column" justifyContent="center" alignItems="center">
			<Grid container item flex justifyContent="flex-end" alignItems="center">
				<Box
					sx={{ 
						bgcolor: '#ffffff', 
						border: 'none', 
						marginBottom: '10px',
						marginRight: '30px'
					}} 
				>
					<Button variant="contained"
						onClick = { account ? disconnectWallet : connectWallet }
						sx={{
							width: '200px',
							wordWrap: "break-word"
						}}
					>
						{ 
							isMetamaskInstalled 
								? account === null
									? 'Connect'
									: displayAddress( account )
								: 'Install your metamask wallet.'
						}
					</Button>
				</Box>
			</Grid>
			<Grid container item flex justifyContent="center" alignItems="center">
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						justifyContent: 'space-between',
						alignItems: 'center',
						overflow: 'hidden',
						boxShadow: 1,
						fontWeight: 'bold',
						maxHeight: '90vh',
					}}
				>
					<Card>
						<CardActionArea>
							<CardMedia
								component="img"
								image={`./imgs/mintTanks/mintTank-3.jpg`}
								alt="green iguana"
							/>
						</CardActionArea>
					</Card>
				</Box>
			</Grid>
			<AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: -30 }}>
				<Toolbar>
					<StyledButton 
						variant="contained" 
						color="secondary" 
						endIcon={<SendIcon />}
						href="/minting/1"
					>
							Next
					</StyledButton>
				</Toolbar>
			</AppBar>
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
	);
}

export default Home;