import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';

// Demo data for when Web3 is not available
const DEMO_HOMES = [
    {
        "name": "Luxury NYC Penthouse",
        "address": "157 W 57th St APT 49B, New York, NY 10019",
        "description": "Luxury Penthouse located in the heart of NYC",
        "image": "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png",
        "id": "1",
        "attributes": [
            { "trait_type": "Purchase Price", "value": 20 },
            { "trait_type": "Type of Residence", "value": "Condo" },
            { "trait_type": "Bed Rooms", "value": 2 },
            { "trait_type": "Bathrooms", "value": 3 },
            { "trait_type": "Square Feet", "value": 2200 },
            { "trait_type": "Year Built", "value": 2013 }
        ]
    },
    {
        "name": "Luxury Miami Beach House",
        "address": "234 Ocean Drive, Miami Beach, FL 33139",
        "description": "Beautiful beachfront property with ocean views",
        "image": "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/2.png",
        "id": "2",
        "attributes": [
            { "trait_type": "Purchase Price", "value": 15 },
            { "trait_type": "Type of Residence", "value": "House" },
            { "trait_type": "Bed Rooms", "value": 4 },
            { "trait_type": "Bathrooms", "value": 3 },
            { "trait_type": "Square Feet", "value": 3500 },
            { "trait_type": "Year Built", "value": 2015 }
        ]
    },
    {
        "name": "San Francisco Victorian",
        "address": "789 Painted Ladies, San Francisco, CA 94117",
        "description": "Historic Victorian home in prime SF location",
        "image": "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/3.png",
        "id": "3",
        "attributes": [
            { "trait_type": "Purchase Price", "value": 10 },
            { "trait_type": "Type of Residence", "value": "House" },
            { "trait_type": "Bed Rooms", "value": 3 },
            { "trait_type": "Bathrooms", "value": 2 },
            { "trait_type": "Square Feet", "value": 2800 },
            { "trait_type": "Year Built", "value": 1890 }
        ]
    }
];

function App() {
    const [provider, setProvider] = useState(null)
    const [escrow, setEscrow] = useState(null)

    const [account, setAccount] = useState(null)

    const [homes, setHomes] = useState([])
    const [home, setHome] = useState({})
    const [toggle, setToggle] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    const loadBlockchainData = async () => {
        try {
            // Check if Web3 is available
            if (!window.ethereum) {
                console.log('MetaMask not detected, loading demo mode');
                setIsDemo(true);
                setHomes(DEMO_HOMES);
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(provider)
            const network = await provider.getNetwork()

            const realEstate = new ethers.Contract(config[network.chainId].realEstate.address, RealEstate, provider)
            const totalSupply = await realEstate.totalSupply()
            const homes = []

            for (var i = 1; i <= totalSupply; i++) {
                const uri = await realEstate.tokenURI(i)
                const response = await fetch(uri)
                const metadata = await response.json()
                homes.push(metadata)
            }

            setHomes(homes)

            const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider)
            setEscrow(escrow)

            window.ethereum.on('accountsChanged', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0])
                setAccount(account);
            })
        } catch (error) {
            console.error('Error loading blockchain data:', error);
            console.log('Falling back to demo mode');
            setIsDemo(true);
            setHomes(DEMO_HOMES);
        }
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])

    const togglePop = (home) => {
        setHome(home)
        toggle ? setToggle(false) : setToggle(true);
    }

    return (
        <div>
            {isDemo && (
                <div style={{
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    padding: '12px 20px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ffeeba'
                }}>
                    🎭 Demo Mode: MetaMask not detected. Showing sample properties. Install MetaMask to interact with blockchain.
                </div>
            )}
            <Navigation account={account} setAccount={setAccount} />
            <Search />

            <div className='cards__section'>

                <h3>Homes For You</h3>

                <hr />

                <div className='cards'>
                    {homes.map((home, index) => (
                        <div className='card' key={index} onClick={() => togglePop(home)}>
                            <div className='card__image'>
                                <img src={home.image} alt="Home" />
                            </div>
                            <div className='card__info'>
                                <h4>{home.attributes[0].value} ETH</h4>
                                <p>
                                    <strong>{home.attributes[2].value}</strong> bds |
                                    <strong>{home.attributes[3].value}</strong> ba |
                                    <strong>{home.attributes[4].value}</strong> sqft
                                </p>
                                <p>{home.address}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {toggle && (
                <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop} />
            )}

        </div>
    );
}

export default App;