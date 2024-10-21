import Web3 from 'web3'

// Ensure Web3 is injected, usually provided by MetaMask or other Web3 browsers
if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    console.log("Web3 provider detected!");
    // Use the injected provider
    var web3 = new Web3(window.ethereum);
} else {
    console.log("No Web3 provider detected. Please install MetaMask.");
}

// Contract ABI (Application Binary Interface) - You can get this from the Remix after compiling your contract
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "candidateName",
                "type": "string"
            }
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "voterAddress",
                "type": "address"
            }
        ],
        "name": "registerVoter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "winningCandidate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "winningCandidateId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "winnerName",
        "outputs": [
            {
                "internalType": "string",
                "name": "winnerCandidateName",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Replace this with your contract address deployed from Remix IDE
const contractAddress = "0x7C4e30a43ecC4d3231b5B07ed082329020D141F3";

// Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Interact with the contract

// Request account access if needed
async function connectAccount() {
    try {
        // Request account access from MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]; // Take the first account
        console.log("Connected account:", account);
        return account;
    } catch (error) {
        console.error("Error connecting account:", error);
    }
}

// Function to add a candidate (Election Commission role required)
async function addCandidate(candidateName) {
    const account = await connectAccount();
    try {
        await contract.methods.addCandidate(candidateName).send({ from: account });
        console.log(`Candidate ${candidateName} added successfully!`);
    } catch (error) {
        console.error("Error adding candidate:", error);
    }
}

// Function to register a voter (Election Commission role required)
async function registerVoter(voterAddress) {
    const account = await connectAccount();
    try {
        await contract.methods.registerVoter(voterAddress).send({ from: account });
        console.log(`Voter ${voterAddress} registered successfully!`);
    } catch (error) {
        console.error("Error registering voter:", error);
    }
}

// Function to cast a vote for a candidate
async function vote(candidateId) {
    const account = await connectAccount();
    try {
        await contract.methods.vote(candidateId).send({ from: account });
        console.log(`Voted for candidate ID: ${candidateId}`);
    } catch (error) {
        console.error("Error voting:", error);
    }
}

// Function to get the winning candidate's ID
async function getWinningCandidate() {
    try {
        const winningCandidateId = await contract.methods.winningCandidate().call();
        console.log("Winning Candidate ID:", winningCandidateId);
        return winningCandidateId;
    } catch (error) {
        console.error("Error getting winning candidate:", error);
    }
}

// Function to get the name of the winning candidate
async function getWinnerName() {
    try {
        const winnerName = await contract.methods.winnerName().call();
        console.log("Winning Candidate Name:", winnerName);
        return winnerName;
    } catch (error) {
        console.error("Error getting winner name:", error);
    }
}
