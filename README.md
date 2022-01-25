# `Yu-Go DAO`

YU-GO DAO has a social background and a female-centered design model that utilizes blockchain technologies with its potential to empower marginalized communities through decentralization.

The main objective of the DAO is to involve non-governmental organizations and women's rights activists with the aim of protecting, emancipating and empowering women in the territory of the former Yugoslavia :  
- by promoting different forms of community value,  
- by improving the organization around common actions,  
- by engaging end users through democratic decision-making, an automated voting system and instantaneous transfer of funds for proposed actions thanks to blockchain technology.

This project was made with [react-moralis](https://github.com/MoralisWeb3/react-moralis) and [Moralis](https://moralis.io?utm_source=github&utm_medium=readme&utm_campaign=ethereum-boilerplate).

Take a look at [official documentation](https://docs.moralis.io/#user) for more information on Moralis functionalities.

# Table of Content

- [Quickstart](#-Quickstart)
- [ConceptT](#-Concept)
- [YG Token](#-yg-token)
- [Testing](#-Testing)

# Quickstart

📄 Clone or fork `Yu-Go`:

```sh
git clone https://github.com/aleksandraDev/YU-GO
```

💿 Install dependencies:

```sh
cd YU-GO
npm install
```

✏ Rename `.env.example` in `.env` in the root folder then add your Moralis `appId` and `serverUrl` ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server))
Example:

```jsx
REACT_APP_MORALIS_APPLICATION_ID = xxxxxxxxxxxx
REACT_APP_MORALIS_SERVER_URL = https://xxxxxx.grandmoralis.com:2053/server
```

✏ Or use our Testnet

```jsx
REACT_APP_MORALIS_APP_ID = 7xj9eFvOciZLstw0sL4zvJXG2Qc9uwLMkXwG3S32
REACT_APP_MORALIS_SERVER_URL = https://pinc0xztf3n2.usemoralis.com:2053/server

# Optional info for connecting your localChain and Moralis Database
moralisApiKey = xwyGYHiqB7hqy7a
moralisApiSecret = lWHYr0tsVbXdWsL
chain = ganache
moralisSubdomain = xxxxxxx.usemoralis.com
```

🚴‍♂️ Launch the app:

```sh
npm start
```

🚴‍♂️ Launch Ganach locally:

```sh
npm run devchain
```

🚴‍♂️ Deploy:

```sh
npm run deploy
```

# Links
You can also test directly on Moralis:  https://4inwhly3zm24.usemoralis.com/  

# Concept

![alt text](https://i.ibb.co/GCBR8jz/how-it-works.png)

The YU-GO DAO does not need a central authority. Instead, the group makes decisions collectively and democratically with transparency, fairness, and reliability by voting on 'actions' proposed by organizations. At the end of the vote, the winning organization can withdraw the funds and carry out on its action.

The funds for carrying out the actions come from Grant Organisations (organisations that receive funds from their donators), which have a budget dedicated to financing new projects (actions). A Grant Organisation offers funding through a competition where other organisations can apply with their proposal of action. Once the 'action proposal' deadline is reached on the date imposed by the competition, DAO members can vote for the proposed actions. The end of the vote is followed by automatic transfers of funds to the organizations of the winning actions.

Each organization is categorized by its theme and country. When a competition is proposed, only the organizations with matching themes and country can take part in the vote.

Voting history is stored transparently on the blockchain. However, user and organization data is stored (surname, first name, phone, etc.) on the Moralis database.

# YG Token

Each organization buys a participation token from the platform. An annual subscription. At the end of the subscription, the token is burned. The token can only be manipulated by the Manager contract.

# Testing
To lunch the test, in a terminal execute `npm run devchain` from the root folder which will launch Ganache in determisitic mode to always get the same public and private keys.  
In a second terminal, execute `truffle test --network develop` in the truffle folder.
