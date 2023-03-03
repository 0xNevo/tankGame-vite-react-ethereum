import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import {ethers} from './ethers';
import tankMintABI from './artifacts/tankMintABI';

import Home from './components/Home';
import Mint from './components/Mint';
import StartPage from './components/StartPage';
import Board from './components/Board';

import * as C from './const';
import "./App.css";

const App = () => {
	const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

	const contractABI = tankMintABI;
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const tankMintContract = new ethers.Contract( C.CONTRACT_ADDRESS, contractABI, signer);
	const tankMintContractWithSigner = tankMintContract.connect(signer);

	return (
		<Routes>
			<Route
				index
				element={
					<Home
						isMetamaskInstalled = { isMetamaskInstalled } setIsMetamaskInstalled = { setIsMetamaskInstalled }
					/>
				}
			/>
			<Route
				path="minting/1"
				element={
					<Mint
						player = {1} tankMintContractWithSigner = {tankMintContractWithSigner}
					/>
				}
			/>
			<Route
				path="minting/2"
				element={
					<Mint
						player = {2} tankMintContractWithSigner = {tankMintContractWithSigner}
					/>
				}
			/>
			<Route path="start" 
				element={
					<StartPage tankMintContractWithSigner = {tankMintContractWithSigner}/>} 
			/>
			<Route path="battle" element={<Board tankMintContractWithSigner = {tankMintContractWithSigner}/>} />
		</Routes>
	);
}

export default App;
