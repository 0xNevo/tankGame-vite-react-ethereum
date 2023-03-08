import React, { useState, useEffect } from "react";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import CustomDialog from "./CustomDialog";
import * as C from '../const';
import Tank from '../Tank';

// for Notification
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Board = ( props ) => {
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

	let resultMatrix = [];          // Map
	let resultPath = [];            // Total Trace : shortest path
	let resultStartPos = [];        // Start Position of Tank1
	let resultEndPos = [];          // Start Position of Tank2
	let startLastPos = [];          // Last Position of Tank1
	let endLastPos = [];            // Last Position of Tank2
	let mapSizeCols;                // Colum size of Map
	let mapSizeRows;                // Row size of Map
	let topDirection;               // Top Direction
	let bottomDirection;            // Bottom Dirrection
	let leftDirection;              // Left Direction
	let rightDirection;             // Right Direction

	let tank1Name = localStorage.getItem("tank1_name");		// importing data from local storage
	let tank1Health = localStorage.getItem("tank1_health");
	let tank1Attack = localStorage.getItem("tank1_attack");
	let tank1Shield = localStorage.getItem("tank1_shield");
	let tank1Speed = localStorage.getItem("tank1_speed");
	
	let tank2Name = localStorage.getItem("tank2_name");
	let tank2Health = localStorage.getItem("tank2_health");
	let tank2Attack = localStorage.getItem("tank2_attack");
	let tank2Shield = localStorage.getItem("tank2_shield");
	let tank2Speed = localStorage.getItem("tank2_speed");
	
	const account = localStorage.getItem("tank_account");

	let tank1Obj = new Tank( tank1Name );					// generate new tank for player
	let tank2Obj = new Tank( tank2Name );

	const [ winnerName, setWinnerName ] = useState( "" );
	const [ open, setOpen ] = useState( false );			// Display Dialog Flg for Game over
	
	tank1Obj.setProperties( tank1Health, tank1Attack, tank1Shield, tank1Speed );
	tank2Obj.setProperties( tank2Health, tank2Attack, tank2Shield, tank2Speed );
	
	/************************************************************************/
	//************************       Tank Battle      ***********************/
	/************************************************************************/

	/**
	 * @title Used to get coordination such as start position of tank1 or tank2.
	 * @parameter startCols: min x, endCols: max x, startRows: min y, endRows: max y
	 * @return random coordination
	 */
	const getCoordination = ( startCols, endCols, startRows, endRows ) => {
		return [
			Math.floor( Math.random() * ( endCols - startCols ) + startCols ),
			Math.floor( Math.random() * ( endRows - startRows ) + startRows )
		];
	}

	/**
	 * @title Used to generate Map, Start Position of Tank1 and Start Position of Tank2 by random
	 * @parameter mRows: Map Rows, mCols: Map Columns.
	 * @return none.
	 */
	const random = ( mRows, mCols ) => {
		let matrix, path,
			box = document.getElementById("root"),
			date = new Date();

		do {
			matrix = [...Array(mRows)].map(e => [...Array(mCols)].map( e=> Math.round(Math.random()*7))); //generate less dense matrix
			path = shortestPath(matrix, box._start, box._end);
		} while(path.length<2 && new Date - date < 10000)//10 sec max
			
		matrix = matrix.map(r=>r.map(a=>Math.round(Math.random()*a*0.9))) //fake more density
		path.forEach(a=>matrix[a[1]][a[0]]=1); //clear the path

		resultStartPos = getCoordination( 0, mCols/4, 0, mRows/4 );
		resultEndPos = getCoordination( mCols*3/4, mCols, mRows*3/4, mRows );

		custom(matrix, resultStartPos, resultEndPos );
	}

	/**
	 * @title Used to set Map with blocks and empties.
	 * @parameter matrix: initialized Map, start: Start Position..., end: ...
	 * @return none
	 */
	const custom = (matrix, start, end) => {
		const cols = mapSizeCols,
				rows = mapSizeRows,
				box = document.getElementById("root");

		box._start = start;
		box._end = end;

		matrix = matrix || box._matrix || [[]];

		if (cols > matrix[0].length) matrix.forEach((a,i) => matrix[i] = a.concat(Array(cols-a.length).fill(3)));
		else if (cols < matrix[0].length) matrix.forEach(a => a.splice(cols, a.length - cols));

		if (rows > matrix.length) matrix = matrix.concat([...Array(rows-matrix.length)].map(e => Array(cols).fill(1)));
		else if (rows < matrix.length) matrix.splice(rows, matrix.length - rows);

		matrix = matrix.map(r => r.map(t => t ? 1 : 0));
		showMatrix(matrix, box._start, box._end, box);
	}

	/**
	 * @title Used to draw Map with some features.
	 * @parameter matrix: Map, start: Start Position of Tank1, end: ... , _box: Battle Field.
	 * @return none.
	 */
	const showMatrix = (matrix, start, end, _box) => {
		resultMatrix = matrix;
		resultStartPos = start;
		resultEndPos = end;

		if (!start || start[0] >= matrix[0].length || start[1] >= matrix.length) start = [0, 0];
		if (!end || end[0] >= matrix[0].length || end[1] >= matrix.length)
			end = [matrix[0].length-1, matrix.length-1];

		const path = shortestPath(matrix, start, end);
		resultPath = path;

		console.log("matrix:", JSON.stringify(matrix));
		console.log("path:", path.join("|"));

		path.forEach(b => matrix[b[1]][b[0]] = 2); //merge path into matrix
		
		matrix[start[1]][start[0]] = 3; //identify start
		matrix[end[1]][end[0]] = 4; //identify end
		
		let block = document.createElement("div");
		const box = _box || block.cloneNode();

		box.className = "matrix";
		box.innerHTML = "";
		box.style.gridTemplateColumns = "1fr ".repeat(matrix[0].length);
		
		const pathPos = {};
		
		path.forEach((a,i) => pathPos[a.join("x")] = i);
		matrix.forEach((r, y) => r.forEach((t, x) => {
			block = block.cloneNode(false);
			block.className = "element cell-"
			block.className += className(t);
			//block.setAttribute("p", pathPos[x+"x"+y]!==undefined ? pathPos[x+"x"+y] : "");
			block._xy = [x,y];
			box.appendChild(block);
		}));

		if (!_box) return document.body.appendChild(box);
		forwardTank();
	}

	/**
	 * @title Used to calculate the finding shortest path.
	 * @parameter arr: matrix for Map, start: Positin for tank1, end: Position for tank2
	 * @return shortest path []
	 */
	const shortestPath = (arr, start, end) => {
		arr = arr.map(a => [...a]); //clone matrix, so we can re-use it by updating which coordinates we've visited
		if (!start) start = [0, 0];
		if (!end) end = [arr[0].length-1, arr.length-1];

		arr[start[1]][start[0]] = 0; //set start position as unavailable
		
		const paths = [[start]];
		while (paths.length) {
			const path = paths.shift(), //remove first path out of all paths (we'll add it back to the end if it's not a dead end)
				cur = path[path.length-1], //get last coordinates from the path
				next = [ //next coordinates from current position
					[cur[0], cur[1] + 1],
					[cur[0] + 1, cur[1]],
					[cur[0], cur[1] - 1],
					[cur[0] - 1, cur[1]],
				];

			for (let i = 0, pos; i < next.length; i++) {
				pos = next[i];
				if (pos[0] == end[0] && pos[1] == end[1]) return path.concat([end]); //found end position

				if (pos[0] < 0 || pos[0] >= arr[0].length || //check boundaries for x
					pos[1] < 0 || pos[1] >= arr.length || //check boundaries for y
					!arr[pos[1]][pos[0]]) //position available?
				{
					continue;
				}

				arr[pos[1]][pos[0]] = 0; //mark position unavailable
				paths.push(path.concat([pos])); //add position to the path
			}
		}
		return [start]; //return start coordinates if no path found
	}

	/**
	 * @title Used to write className of cells.
	 * @parameter t: constant value
	 * @return constant string.
	 */
	const className = ( t ) => {
		switch (t) {
			case C.BLOCK_NUM: return C.BLOCK; 
			case C.EMPTY_NUM: return C.EMPTY; 
			case C.START_TRACE_NUM: return C.START_TRACE; 
			case C.END_TRACE_NUM: return C.END_TRACE; 
			case C.START_NUM: return C.START; 
			case C.END_NUM: return C.END; 
			case C.STARTMEET_NUM: return C.STARTMEET; 
			case C.ENDMEET_NUM: return C.ENDMEET; 
			default: return;
		}
	}

	/**
	 * @title Used to simulate behavior of Tanks
	 * @parameter none
	 * @return none
	 */
	const forwardTank = () => {
		let i=0, j=0;
		let block;    
		let cellList = document.getElementsByClassName( "element" );
		
		for( i=0; i<resultMatrix.length; i++ ) {
			for( j=0; j<resultMatrix[i].length; j++ ) {
				let tmp = i*resultMatrix[i].length + j;

				cellList[tmp].id = j + ':' + i;

				if( resultMatrix[i][j] === 0 ) cellList[tmp].className = "element cell-block";
				else cellList[tmp].className = "element cell-empty";
			}
		}
		
		block = document.getElementById( resultPath[0][0] + ":" + resultPath[0][1] );
		rotateTank( block, 0, C.STARTMEET_NUM );
		block = document.getElementById( resultPath[resultPath.length-1][0] + ":" + resultPath[resultPath.length-1][1] );
		rotateTank( block, 0, C.ENDMEET_NUM );

		let tank1;
		let tank2;
		let tank1Step = 0;
		let tank2Step = resultPath.length - 1;
		let tank1Trace = [];
		let tank2Trace = [];
		let totalLength = resultPath.length;
		let middlePos = Math.floor( resultPath.length / 2 );
		let x1, y1, x2, y2;
		
		const stepInterval = ( lastPoses ) => {
			const stepInterval = setInterval( () => {
				if( totalLength % 2 ) {
					if(  tank1Step > middlePos ) {
						lastPoses( [ startLastPos, endLastPos ] );
						clearInterval( stepInterval );
					}
					else{
						if( tank1Step == middlePos ) {
							tank1Trace = resultPath[tank1Step++];
							tank1 = document.getElementById(tank1Trace[0] + ":" + tank1Trace[1]);
							rotateTank(tank1, 0, C.START_TRACE_NUM );
							startLastPos = tank1Trace;
						}else{
							tank1Trace = resultPath[tank1Step];
							tank2Trace = resultPath[tank2Step];

							startLastPos = tank1Trace;
							endLastPos = tank2Trace;
							
							const isTarget =  findTarget( tank1Trace, tank2Trace, tank1Step );
							if( isTarget ) {
								lastPoses( [ startLastPos, endLastPos ] );
								clearInterval( stepInterval );
							}
							
							tank1 = document.getElementById(tank1Trace[0] + ":" + tank1Trace[1]);
							tank2 = document.getElementById(tank2Trace[0] + ":" + tank2Trace[1]);
							
							if( tank1Step ) {
								rotateTank(tank1, 0, C.START_TRACE_NUM);
								rotateTank(tank2, 0, C.END_TRACE_NUM);
							}

							tank1Step++;
							tank2Step--;
						}
					}
				}else{
					if(  tank1Step >= middlePos ) {
						clearInterval( stepInterval );
						lastPoses( [ startLastPos, endLastPos ] );
					} else{
						tank1Trace = resultPath[tank1Step];
						tank2Trace = resultPath[tank2Step];

						startLastPos = tank1Trace;
						endLastPos = tank2Trace;

						const isTarget =  findTarget( tank1Trace, tank2Trace, tank1Step );
						if( isTarget ) {
							lastPoses( [ startLastPos, endLastPos ] );
							clearInterval( stepInterval );
						}

						tank1 = document.getElementById(tank1Trace[0] + ":" + tank1Trace[1]);
						tank2 = document.getElementById(tank2Trace[0] + ":" + tank2Trace[1]);

						if( tank1Step ) {
							rotateTank( tank1, 0, C.START_TRACE_NUM );
							rotateTank( tank2, 0, C.END_TRACE_NUM );
						}

						tank1Step++;
						tank2Step--;
					}
				}
			}, 300 );
		}

		stepInterval( ( lastPoses ) => {
			startLastPos = lastPoses[0];
			endLastPos = lastPoses[1];

			x1 = startLastPos[0];
			y1 = startLastPos[1];
			x2 = endLastPos[0];
			y2 = endLastPos[1];
			
			tank1 = document.getElementById(startLastPos[0] + ":" + startLastPos[1]);
			tank2 = document.getElementById(endLastPos[0] + ":" + endLastPos[1]);

			setTimeout(() => {
				findDirection( x1, y1, x2, y2 );
			
				if( topDirection ) {
					rotateTank( tank1, 0, C.START_NUM );
					rotateTank( tank2, 180, C.END_NUM );
				}else if( bottomDirection ) {
					rotateTank( tank1, 180, C.START_NUM );
					rotateTank( tank2, 0, C.END_NUM );
				}else if( leftDirection ) {
					rotateTank( tank1, 270, C.START_NUM );
					rotateTank( tank2, 90, C.END_NUM );
				}else if( rightDirection ) {
					rotateTank( tank1, 90, C.START_NUM );
					rotateTank( tank2, 270, C.END_NUM );
				}
			}, 50);

			console.log(tank1Obj, tank2Obj);
			tank1Obj._power > tank2Obj._power ? tank1Obj._isWinner = true : tank2Obj._isWinner = true;
			setTimeout(() => {
				setOpen( true );
			}, 1500);
			
			if( tank1Obj._isWinner ) setWinnerName( tank1Obj._owner );
			else setWinnerName( tank2Obj._owner );

			console.log( tank1Obj );
			console.log( tank2Obj );
		});
	}

	/**
	 * @title Used to determine direction.
	 * @parameter x1, y1: Coordination of Pos1, x2, y2: Coordination of Pos2.
	 * @return none
	 */
	const findDirection = ( x1, y1, x2, y2 ) => {
		topDirection = x1 == x2 && y1 > y2;
		bottomDirection = x1 == x2 && y1 < y2;
		leftDirection = y1 == y2 && x1 > x2;
		rightDirection = y1 == y2 && x1 < x2;
	}

	/**
	 * @title Used to stop two tanks, if they findout each other.
	 * @parameter t1: current position of tank1, t2: current position of tank2, ts: Count about steps of of Tank1
	 * @return none
	 */
	const findTarget = ( t1, t2, t1s ) => {
		let tank1Trace = t1;
		let tank2Trace = t2;
		let tank1Step = t1s;
		let nextTrace = resultPath[tank1Step+1];
		let x1 = tank1Trace[0];
		let y1 = tank1Trace[1];
		let x2 = tank2Trace[0];
		let y2 = tank2Trace[1];
		let xi = nextTrace[0];
		let yi = nextTrace[1];
		let i = 0;
		let cnt = 0;

		findDirection( x1, y1, xi, yi );

		if( topDirection ) {
			if(x1 != x2) return false;
			else{
				cnt = y1 - y2;

				for( i=0; i < ( y1-y2 ); i++ ) {
					let tmp = y1 - i;
					let tmpPos = resultMatrix[tmp][x1];

					if( tmpPos === 2 ) cnt--;
				}

				if( cnt === 0 ) return true;
				else return false;
			}
		}else if( bottomDirection ) {
			if(x1 != x2) return false;
			else{
				cnt = y2 - y1;

				for( i=0; i < ( y2-y1 ); i++ ) {
					let tmp = y1 + i;
					let tmpPos = resultMatrix[tmp][x1];

					if( tmpPos === 2 ) cnt--;
				}

				if( cnt === 0 ) return true;
				else return false;
			}
		}else if( leftDirection ) {
			if(y1 != y2) return false;
			else{
				cnt = x1 - x2;

				for( i=0; i < ( x1-x2 ); i++ ) {
					let tmp = x1 - i;
					let tmpPos = resultMatrix[y1][tmp];

					if( tmpPos === 2 ) cnt--;
				}

				if( cnt === 0 ) return true;
				else return false;
			}
		}else if( rightDirection ) {
			if(y1 != y2) return false;
			else{
				cnt = x2 - x1;

				for( i=0; i < ( x2-x1 ); i++ ) {
					let tmp = x1 + i;
					let tmpPos = resultMatrix[y1][tmp];

					if( tmpPos === 2 ) cnt--;
				}

				if( cnt === 0 ) return true;
				else return false;
			}
		}
	}

	/**
	 * @title Used to write the properties of tanks
	 * @parameter block: a piece of Map, rotateDeg: angle degree to rotate.
	 * @return className as string.
	 */
	const rotateTank = ( block, rotateDeg, flg ) => {
		switch ( flg ) {
			case C.BLOCK_NUM: block.className = "element cell-" + C.BLOCK; break;
			case C.EMPTY_NUM: block.className = "element cell-" + C.EMPTY; break;
			case C.START_TRACE_NUM: block.className = "element cell-" + C.START_TRACE; break;
			case C.END_TRACE_NUM: block.className = "element cell-" + C.END_TRACE; break;
			case C.START_NUM: block.className = "element cell-" + C.START + " rotate-" + rotateDeg; break;
			case C.END_NUM: block.className = "element cell-" + C.END + " rotate-" + rotateDeg; break;
			case C.STARTMEET_NUM: block.className = "element cell-" + C.STARTMEET; break;
			case C.ENDMEET_NUM: block.className = "element cell-" + C.ENDMEET; break;
			default: return;
		}    
	}

	/**
	 * @title Used to start Game.
	 * @parameter cols: Column Size of Map, rows: Row Size of Map
	 * @return none
	 */
	const init = ( cols, rows ) => {
		if( account ){
			mapSizeRows = rows, mapSizeCols = cols;

			while( resultPath.length < 5 ) {
				random( mapSizeRows, mapSizeCols );
			}
		}else{

		}
	}

	useEffect(() => {
		init( 50, 50 );
	}, []);

	return (
		<div className="matrix">
			<CustomDialog 
				open = { open } setOpen = { setOpen }
				winnerName = { winnerName }
				tankMintContractWithSigner = { props.tankMintContractWithSigner }
			/>
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
		</div>
	);
}

export default Board;