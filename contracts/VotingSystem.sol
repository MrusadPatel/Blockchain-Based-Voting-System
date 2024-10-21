// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {

    // Structure to define a Voter
    struct Voter {
        bool isRegistered;  // If true, the voter is allowed to vote
        bool hasVoted;      // If true, the voter has already voted
        uint votedCandidateId; // ID of the voted candidate
    }

    // Structure to define a Candidate
    struct Candidate {
        uint id;            // Unique ID of the candidate
        string name;        // Name of the candidate
        uint voteCount;     // Number of accumulated votes
    }

    address public electionCommission;  // The Election Commission (admin of the voting process)
    mapping(address => Voter) public voters; // A mapping to track each voter's information
    mapping(uint => Candidate) public candidates; // Mapping to store candidates by ID
    mapping(string => bool) public isCandidateRegistered; // Mapping to check if a candidate is already registered
    uint public candidatesCount; // To store the total number of candidates

    // Constructor to initialize the contract and create the candidates
    constructor() {
        electionCommission = msg.sender;
        voters[electionCommission].isRegistered = true;
    }

    // Function to add candidates, only the election commission can call this
    function addCandidate(string memory candidateName) public {
        require(msg.sender == electionCommission, "Only the election commission can add candidates.");
        require(!isCandidateRegistered[candidateName], "Candidate is already registered.");

        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, candidateName, 0);
        isCandidateRegistered[candidateName] = true; // Mark candidate as registered
    }

    // Function to register a voter, only the election commission can call this
    function registerVoter(address voterAddress) public {
        require(msg.sender == electionCommission, "Only the election commission can register voters.");
        require(!voters[voterAddress].isRegistered, "Voter is already registered.");
        voters[voterAddress].isRegistered = true;
    }

    // Function to cast a vote for a candidate by their ID
    function vote(uint candidateId) public {
        Voter storage sender = voters[msg.sender];
        require(sender.isRegistered, "You must be a registered voter.");
        require(!sender.hasVoted, "You have already voted.");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID.");

        sender.hasVoted = true;
        sender.votedCandidateId = candidateId;

        // Increment the vote count for the selected candidate
        candidates[candidateId].voteCount += 1;
    }

    // Function to get the winning candidate based on the votes
    function winningCandidate() public view returns (uint winningCandidateId) {
        uint maxVoteCount = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVoteCount) {
                maxVoteCount = candidates[i].voteCount;
                winningCandidateId = candidates[i].id;
            }
        }
    }

    // Function to get the name of the winning candidate
    function winnerName() public view returns (string memory winnerCandidateName) {
        uint winnerId = winningCandidate();
        winnerCandidateName = candidates[winnerId].name;
    }
}
