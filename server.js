const express = require('express');
const Web3 = require('web3');
const session = require('express-session');
const speakeasy = require('speakeasy');
const path = require('path'); // For serving the HTML file

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const web3 = new Web3('HTTP://127.0.0.1:7545'); // Replace with your Ethereum node URL
web3.eth.getAccounts()
    .then(accounts => console.log('Connected accounts:', accounts))
    .catch(error => console.error('Error connecting to Web3:', error));

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_energyPrice",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EnergyTransferCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "otpHash",
				"type": "bytes32"
			}
		],
		"name": "EnergyTransferInitiated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_transactionId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_otp",
				"type": "bytes32"
			}
		],
		"name": "completeEnergyTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "depositEnergy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "energyPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_otp",
				"type": "bytes32"
			}
		],
		"name": "generateOTPHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "_otpHash",
				"type": "bytes32"
			}
		],
		"name": "initiateEnergyTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "transactions",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "otpHash",
				"type": "bytes32"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "registered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; // Replace with your deployed contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the index.html file
});

// Setup sessions to keep track of users
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Example in-memory users (for demo purposes)
const users = {
  'farazs156@gmail.com': { password: 'Candy@123', address: '0xC10df762ed4FeD26ba0837bBfa8a57C54bf9816c', otpSecret: '' },
  'user2': { password: 'password2', address: '0xAddress2', otpSecret: '' }
};

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    // Generate an OTP secret for the user
    const secret = speakeasy.generateSecret({ length: 20 });
    users[username].otpSecret = secret.base32;

    // Save the user session
    req.session.user = username;

    res.json({ status: 'Logged in', otpSecret: secret.otpauth_url });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Route to generate OTP
app.post('/generate-otp', (req, res) => {
  const username = req.session.user;
  if (!username) return res.status(401).json({ error: 'Not authenticated' });

  const token = speakeasy.totp({
    secret: users[username].otpSecret,
    encoding: 'base32'
  });

  res.json({ otp: token });
});

// Route to verify OTP and interact with smart contract
app.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  const username = req.session.user;

  if (!username) return res.status(401).json({ error: 'Not authenticated' });

  const verified = speakeasy.totp.verify({
    secret: users[username].otpSecret,
    encoding: 'base32',
    token: otp
  });

  if (verified) {
    // Interact with blockchain (example)
    const accounts = await web3.eth.getAccounts();
    await contract.methods.registerUser(users[username].address).send({ from: accounts[0] });
    res.json({ status: 'OTP verified and user registered on blockchain' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// Route to initiate energy transfer
app.post('/initiate-energy-transfer', async (req, res) => {
  const username = req.session.user;
  const { receiverAddress, amount } = req.body;

  if (!username) return res.status(401).json({ error: 'Not authenticated' });

  const otp = speakeasy.totp({
    secret: users[username].otpSecret,
    encoding: 'base32'
  });

  const otpHash = web3.utils.soliditySha3({ type: 'bytes32', value: otp });

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.initiateEnergyTransfer(receiverAddress, amount, otpHash)
      .send({ from: accounts[0] });

    res.json({ status: 'Energy transfer initiated, OTP sent', otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error initiating energy transfer' });
  }
});

// Route to complete energy transfer
app.post('/complete-energy-transfer', async (req, res) => {
  const { transactionId, otp } = req.body;
  const username = req.session.user;

  if (!username) return res.status(401).json({ error: 'Not authenticated' });

  const otpHash = web3.utils.soliditySha3({ type: 'bytes32', value: otp });

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.completeEnergyTransfer(transactionId, otpHash)
      .send({ from: accounts[0] });

    res.json({ status: 'Energy transfer completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error completing energy transfer' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
