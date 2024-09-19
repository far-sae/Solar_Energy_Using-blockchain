
# Solar Energy Trading Platform

This project is a decentralized platform for trading solar energy between users, utilizing blockchain technology for secure and transparent energy transfers. The platform includes a web-based front-end for user interactions, a Solidity smart contract for handling energy transactions, and a server-side API for authentication and OTP verification.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login with username and password.
- **OTP Generation and Verification**: Two-factor authentication using OTP (One-Time Password).
- **Energy Trading**: Users can initiate and complete energy transfers via blockchain-based transactions.
- **Responsive UI**: A simple, user-friendly interface for trading solar energy.
- **Blockchain Integration**: Smart contract handles all energy trading operations.

## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js**: You can install Node.js from [here](https://nodejs.org/).
- **npm**: This comes with Node.js.
- **Solidity**: The smart contract is written in Solidity, and you will need a local Ethereum development environment like Truffle or Hardhat.
- **A blockchain wallet**: e.g., MetaMask, to interact with the smart contract.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/far-sae/Solar_Energy_Using-blockchain.git
   ```

2. Navigate to the project directory:

   ```bash
   cd solar-energy-trading
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

4. Compile the smart contract:

   Use Truffle or Hardhat to compile `SolarEnergyTrading.sol`.

   ```bash
   truffle compile
   ```

5. Deploy the smart contract to a local blockchain (e.g., Ganache):

   ```bash
   truffle migrate
   ```

6. Run the server:

   ```bash
   node server.js
   ```

7. Open the `index.html` in your browser to interact with the platform.

## Usage

### Login and OTP Verification

- Open the platform in your browser.
- Enter your username and password to log in.
- Generate an OTP using the "Generate OTP" button.
- Enter the OTP to verify your login.

### Energy Transfer

1. **Initiate Transfer**:  
   Users can initiate an energy transfer by entering the receiver’s address and the amount of energy to transfer.
   
2. **Complete Transfer**:  
   After initiating the transfer, complete it by providing the transaction ID and the OTP generated.

## Smart Contract

The `SolarEnergyTrading.sol` smart contract handles all blockchain-based energy transfers. Here’s a quick overview of its functionality:

- **Energy Transfer**:  
  Allows a user to send energy to another user by recording the transaction on the blockchain.

- **Verification**:  
  The smart contract interacts with the backend server for OTP-based transaction confirmation.

### Contract Deployment

The smart contract is deployed on an Ethereum-compatible blockchain. You can deploy it locally for testing or on a public network like Ropsten.

## API Endpoints

The server uses a RESTful API to handle authentication, OTP generation, and energy transfers. Below are the key endpoints:

- **POST /login**  
  Authenticate the user with a username and password.

- **POST /generate-otp**  
  Generate a One-Time Password for 2FA.

- **POST /verify-otp**  
  Verify the OTP for user login or transaction completion.

- **POST /initiate-energy-transfer**  
  Initiate an energy transfer by providing the receiver’s address and amount.

- **POST /complete-energy-transfer**  
  Complete an energy transfer using the transaction ID and OTP.

