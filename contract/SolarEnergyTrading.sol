// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SolarEnergyTrading {
    address public owner;
    uint256 public energyPrice;

    struct User {
        address userAddress;
        uint256 balance;
        bool registered;
    }

    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        bytes32 otpHash;
        bool completed;
    }

    mapping(address => User) public users;
    mapping(bytes32 => Transaction) public transactions;

    event EnergyTransferInitiated(address indexed sender, address indexed receiver, uint256 amount, bytes32 otpHash);
    event EnergyTransferCompleted(address indexed sender, address indexed receiver, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(uint256 _energyPrice) {
        owner = msg.sender;
        energyPrice = _energyPrice;
    }

    function registerUser(address _user) public onlyOwner {
        require(!users[_user].registered, "User is already registered");
        users[_user] = User(_user, 0, true);
    }

    function generateOTPHash(bytes32 _otp) public view returns (bytes32) {
        return keccak256(abi.encodePacked(_otp, msg.sender));
    }

    function initiateEnergyTransfer(address _receiver, uint256 _amount, bytes32 _otpHash) public {
        require(users[msg.sender].registered, "Sender is not registered");
        require(users[_receiver].registered, "Receiver is not registered");
        require(users[msg.sender].balance >= _amount, "Insufficient balance");

        bytes32 transactionId = keccak256(abi.encodePacked(msg.sender, _receiver, _amount, block.timestamp));
        transactions[transactionId] = Transaction(msg.sender, _receiver, _amount, _otpHash, false);

        emit EnergyTransferInitiated(msg.sender, _receiver, _amount, _otpHash);
    }

    function completeEnergyTransfer(bytes32 _transactionId, bytes32 _otp) public {
        Transaction storage transaction = transactions[_transactionId];
        require(transaction.receiver == msg.sender, "Only the receiver can complete this transaction");
        require(transaction.completed == false, "Transaction already completed");
        require(transaction.otpHash == keccak256(abi.encodePacked(_otp, transaction.receiver)), "Invalid OTP");

        transaction.completed = true;
        users[transaction.sender].balance -= transaction.amount;
        users[transaction.receiver].balance += transaction.amount;

        emit EnergyTransferCompleted(transaction.sender, transaction.receiver, transaction.amount);
    }

    function depositEnergy(uint256 _amount) public {
        require(users[msg.sender].registered, "User is not registered");
        users[msg.sender].balance += _amount;
    }

    function getBalance() public view returns (uint256) {
        require(users[msg.sender].registered, "User is not registered");
        return users[msg.sender].balance;
    }
}
