import React from 'react';
import ReactDOM from 'react-dom';
import { MoralisProvider } from 'react-moralis';
import App from './App';
import Moralis from 'moralis';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider';
import './index.css';

const appId = process.env.REACT_APP_MORALIS_APP_ID ?? '';
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL ?? '';

Moralis.start({ serverUrl, appId });
const web3 = new Moralis.Web3();
console.log('Moralis', web3);
// const contract = new web3.eth.Contract(contractAbi, contractAddress);
const user = Moralis.User.current();
console.log('user', user);

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
