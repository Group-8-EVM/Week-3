// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import { MyVoteToken } from "./My20Votes.sol";

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    MyVoteToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;
    mapping(address => uint256) public votePowerSpent;

    constructor(
        bytes32[] memory _proposalNames,
        MyVoteToken _tokenContract,
        uint256 _targetBlockNumber
    ) {
        tokenContract = _tokenContract;
        targetBlockNumber = _targetBlockNumber;
        require(_targetBlockNumber < block.number, "targetBlockNumber must be already mined.");
        for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 votePower = getVotePower(msg.sender);
        require(votePower >= amount, "error: trying to vote with more votes then available");
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function getVotePower(address voter) public returns (uint256) {
        return tokenContract.getPastVotes(voter, targetBlockNumber) - votePowerSpent[voter];
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}