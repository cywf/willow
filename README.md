# Willow - A Real Estate NFT Decentralized Application

[//]:"inspired-by-Zillow" 

## 🎯 Live Demo

**Demo Site:** https://cywf.github.io/willow

The demo site runs in demo mode showing sample properties. To interact with the blockchain features, install MetaMask and connect to a local Hardhat network.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)
- (Optional) Install [MetaMask](https://metamask.io/) browser extension for blockchain interaction

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 7. Start frontend
`$ npm run start`

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The demo mode allows users to view the application without needing MetaMask installed.

**Important:** For the automated deployment to work, GitHub Pages must be enabled in repository Settings > Pages with source set to "GitHub Actions". See [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md) for detailed setup instructions.

### Manual Deployment
To manually deploy:
```bash
npm run build
npm run deploy
```

## Features

- **Demo Mode**: Automatically detects if MetaMask is not available and shows demo data
- **Blockchain Integration**: Connect with MetaMask to interact with real smart contracts
- **Real Estate NFTs**: Properties are represented as ERC-721 tokens
- **Escrow System**: Secure purchase process with buyer, seller, inspector, and lender roles
- **Responsive Design**: Works on desktop and mobile devices