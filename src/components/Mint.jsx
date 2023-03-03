import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TextField from '@mui/material/TextField';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import * as C from '../const';

// for Notification
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Mint = ( props ) => {
	// for notification ~from here
	const [state, setState] = React.useState({
		snack: false,
		vertical: 'bottom',
		horizontal: 'right',
		message: 'Tank Minted',
		color: 'success'
	});

	const { vertical, horizontal, snack, message, color } = state;

	const handleSnackClose = () => {
		setState({ ...state, snack: false });
	};
	// for notification ~end

	const url = `../imgs/mintTanks/mintTank-`;			// for tankImg
	const array = [ 1, 2, 3, 4, 5, 6, 7 ];
	const tanks = array.map((i) => {
		return ( url + i + ".jpg" );
	});
	const tank = props.player === 1 ? "tank1" : "tank2";
	const [ pName, setPName ] = useState( "" );				// player Name
	
	const [ mintedFlg, setMintedFlg ] = useState( false );		// Flg for minting tank
	const [ curTank, setCurTank ] = useState( tanks[2] );		// Selected Tank
	const [ health, setHealth ] = useState(0);					// Tank Properties from here
	const [ attack, setAttack ] = useState(0);
	const [ shield, setShield ] = useState(0);
	const [ speed, setSpeed ] = useState(0);

	const account = localStorage.getItem( "tank_account" );
	const tankMintContractWithSigner = props.tankMintContractWithSigner;
	
	// Select current Tank
	const selectCurTank = ( e, v ) => {
		setCurTank( v );
		localStorage.setItem( `${tank}_img`, v );
	}

	// Set Properties for tank
	const setProperties = () => {
        localStorage.setItem( `${tank}_health`, getProperty( 0.3, 0.4 ) );
		localStorage.setItem( `${tank}_attack`, getProperty( 0.1, 0.3 ) );
		localStorage.setItem( `${tank}_shield`, getProperty( 0, 0.2 ) );
		localStorage.setItem( `${tank}_speed`, getProperty( 0, 0.1 ) );

		setHealth ( localStorage.getItem( `${tank}_health` ) );
        setAttack ( localStorage.getItem( `${tank}_attack` ) );
		setShield ( localStorage.getItem( `${tank}_shield` ) );
        setSpeed ( localStorage.getItem( `${tank}_speed` ) );
    }

	// Generate a property with under decimal 5
    const getProperty = ( sVal, eVal) => {
        return Math.floor( ( Math.random() * ( eVal - sVal ) + sVal ) * 100000 ) / 100000;
    }

	// handle for setProperty
	const handleSetProperty = ( e ) => {
		setProperties();
	}

	// handle Minting TankNFT
	const handleMint = ( e ) => {
		let tmpNum = curTank.split('-')[1].split('.')[0];
		let constVal = 0;

		switch( Number( tmpNum ) ){
			case 1:
				constVal = C.TankNFT_1; break;
			case 2:
				constVal = C.TankNFT_2; break;
			case 3:
				constVal = C.TankNFT_3; break;
			case 4:
				constVal = C.TankNFT_4; break;
			case 5:
				constVal = C.TankNFT_5; break;
			case 6:
				constVal = C.TankNFT_6; break;
			case 7:
				constVal = C.TankNFT_7; break;
			default:
				return false;
		}
		
		constVal = C.PINATA + constVal;
		localStorage.setItem( "tank_tokenUri", constVal );

		mint( localStorage.getItem( "tank_tokenUri" ) );
	}
	
	// Function to mint a TankNFT
	const mint = async ( _tokenUri ) => {
		setMintedFlg(true);
		console.log( _tokenUri )

		try {
			setMintedFlg(true);
			const tx = await tankMintContractWithSigner.mintTankNFT( _tokenUri );
			await tx.wait();
			console.log('TankNFT minted!');

			setState({ 
				snack: true, 
				message: 'Tank minted',
				vertical: 'bottom',
				horizontal: 'right',
				color: 'success'
			});

			setTimeout(() => {
				location.href = (
					pName
						? props.player === 1 ? "/minting/2" : "/start"
						: null
				)
			}, 2000);
		} catch (error) {
			console.log(error);

			setState({ 
				snack: true, 
				message: error,
				vertical: 'bottom',
				horizontal: 'right',
				color: 'warning'
			});
		}
	}

	useEffect(() => {
		localStorage.setItem( `${tank}_img`, curTank );
		setProperties();
	}, []);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				overflow: 'hidden',
				boxShadow: 1,
				fontWeight: 'bold',
				padding: '10px',
			}}
		>
			{
				account ?
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							justifyContent: 'space-between',
							alignItems: 'center',
							overflow: 'hidden',
							fontWeight: 'bold',
							padding: '80px',
						}}
					>
						<List
							sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
							component="nav"
							aria-labelledby="nested-list-subheader"
							subheader={
								<ListSubheader component="div" id="nested-list-subheader"
									sx={{
										fontWeight: 'bold',
										color: 'text.primary',
										fontSize: '18px',
									}}
								>
									Tank List
								</ListSubheader>
							}
						>
							{ 
								tanks.map((t, i) => (
									<ListItemButton key={i} onClick={ (e) => {
										selectCurTank( e, t )
										handleSetProperty( e );
									}}>
										<ListItemIcon>
											<Avatar alt="Travis Howard" src={t} />
										</ListItemIcon>
										<ListItemText primary={ `Tank ${ i+1 }` } />
									</ListItemButton>
								))
							}
						</List>
						<Box>
							<Card>
								<CardActionArea>
									<CardMedia
										component="img"
										image={curTank}
										alt="green iguana"
										sx={{
											width: "70%"
										}}
									/>
									<Box 
										sx={{
											marginLeft: '10%',
										}}
									>
										<Typography component="div" variant="h5">
											Property
										</Typography>
										<Typography component="div" variant="h6">
											Health: {health}
										</Typography>
										<Typography component="div" variant="h6">
											Attack: {attack}
										</Typography>
										<Typography component="div" variant="h6">
											Shied: {shield}
										</Typography>
										<Typography component="div" variant="h6">
											Speed: {speed}
										</Typography>
									</Box>
								</CardActionArea>
								<CardActions>
									<Box 
										sx={{
											marginLeft: '10%',
											display: 'flex',
											flexDirection: { xs: 'column', md: 'row' },
											justifyContent: 'center',
											overflow: 'hidden',
											boxShadow: 'none',
											marginRight: '0'
										}}
									>
										<TextField 
											placeholder={`Player${props.player} Name:`} 
											variant="outlined"
											value={pName}
											disabled = {mintedFlg}
											onInput={(e) => {
												setPName(e.target.value);
												localStorage.setItem( `${tank}_name`, e.target.value );
											}}
										/>
										<Button variant="extended" sx={{
												width: "10rem",
											}}
											disabled = { 
												props.player === 2
													? (pName === localStorage.getItem( "tank1_name" )) || !pName || mintedFlg
													: false || !pName || mintedFlg
	 										}
											onClick = { handleMint }
										>
											<AutoAwesomeIcon sx={{ mr: 1 }} />
											Mint
										</Button>
									</Box>
								</CardActions>
							</Card>
						</Box>
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
					</Box>
				: 
					<Button variant="contained" href="/">
						Redirect
					</Button>
			}
		</Box>
	);
}

export default Mint;