import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const TankItem = ( props ) => {
	const account = localStorage.getItem( 'tank_account' );
	
	return (
		account
		? <Card sx={{ 
			maxWidth: '25rem', 
			maxHeight: '35rem',
			margin: '30px'
		}}>
			<CardActionArea>
				<CardMedia
					component="img"
					height="180"
					image={props.img}
					alt="green iguana"
				/>
			</CardActionArea>
		</Card>
		: <Button variant="contained" href="/">
			Redirect
		</Button>
	);
}

export default TankItem;