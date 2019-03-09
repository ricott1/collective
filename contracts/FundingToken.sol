pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./ContinuousToken.sol";

contract FundingToken is ContinuousToken {
    using SafeMath for uint256;

    event Voting(
        address _from,
        address  _to,
        uint256 _amount
    );

    event NewProject(
        address  _addr
    );

    struct Project {
        uint256 votes;        
    }

    mapping (address => Project) public projects;
    
    constructor(uint256 _reserveRatio) ContinuousToken(_reserveRatio) public {}
    
    function getProjectVotes(address addr)
        public
        view
        returns(uint256 votes)
    {
        return projects[addr].votes;
    }


    function vote (address addr, uint256 amount) 
        external returns(bool res)  
    {
        require(amount > 0, "Must spend tokens to vote.");
        //transfer amount to smart contract
        transfer(owner(), amount);
        projects[addr].votes += amount;
        emit Voting(msg.sender, addr, amount);
        return true;
    }

    function newProject () 
        external returns(bool res)  
    {
        Project memory _newProject = Project({votes:0});
        projects[msg.sender] = _newProject;
        emit NewProject(msg.sender);
        return true;
    }
          
}