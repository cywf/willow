# Willow - A Real Estate NFT Decentralized Application

[//]:"inspired-by-Zillow" 

## 🎯 Live Demo

**Demo Site:** https://cywf.github.io/willow

The live site is a multi-page Astro application featuring:
- **Home**: Project overview and quick links
- **App** ([/app](https://cywf.github.io/willow/app)): The React DApp with demo mode or MetaMask integration
- **Statistics**: Repository insights and analytics
- **Discussions**: Community discussions from GitHub
- **Dev Board**: Project tracking and task management
- **Docs**: Complete documentation and setup guides
- **Visualizer**: Interactive Mermaid diagrams

### Demo Mode vs. Wallet-Connected

The DApp embedded at `/app` automatically detects your environment:
- **No MetaMask**: Shows demo mode with sample properties (no blockchain interaction)
- **MetaMask Installed**: Offers wallet connection for real blockchain transactions on local Hardhat network

## Technology Stack & Tools

### Smart Contracts
- Solidity (Writing Smart Contracts & Tests)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- OpenZeppelin Contracts

### Frontend DApp
- [React.js](https://reactjs.org/) (DApp UI Framework)
- Create React App
- Web3 Integration

### Documentation Site
- [Astro](https://astro.build/) (Static Site Generator)
- React Components (Charts, Theme Switcher, Mermaid Viewer)
- [TailwindCSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/) (Styling)
- Chart.js (Statistics Visualization)
- Mermaid.js (Diagram Rendering)

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

The site uses a multi-stage deployment process:

### CI/CD Pipeline (`.github/workflows/pages.yml`)

1. **Build React DApp**: The React app at the repository root is built and its output (`build/` or `dist/`) is copied to `site/public/app/`
2. **Fetch Repository Data**: Scripts collect statistics, discussions, and project data from GitHub API and save to JSON files
3. **Build Astro Site**: The Astro documentation site in `site/` is built with the embedded DApp
4. **Deploy to Pages**: The complete static site is deployed to GitHub Pages

### How the DApp is Embedded

The React DApp is built separately and embedded in the Astro site at the `/app` route:
- CI builds the React app: `npm ci && npm run build` 
- Output is copied to `site/public/app/`
- The `/app` page loads the DApp in an iframe or via direct rendering
- Demo mode is automatically activated when MetaMask is not detected

### Data Snapshots

Repository insights are captured during build time:
- `site/public/data/stats.json`: Stars, forks, watchers, languages, commit activity
- `site/public/data/discussions.json`: Latest 25 GitHub discussions
- `site/public/data/projects.json`: Project board items or issue-based fallback

**Note**: Data is refreshed on each deployment, not real-time.

**Important:** For automated deployment, GitHub Pages must be enabled in repository Settings > Pages with source set to "GitHub Actions". See [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md) for detailed setup instructions.

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