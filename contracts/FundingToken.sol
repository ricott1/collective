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
        uint256 minPayment;
        uint256 maxPayment; 
        uint pointer;      
    }

    mapping (address => Project) public projects;
    address[] public projectList;
    
    constructor(uint256 _reserveRatio) ContinuousToken(_reserveRatio) public {}

    function isProject(address addr) 
        public 
        view 
        returns(bool res) 
    {
        if(projectList.length == 0) {
            return false;
        }
        return (projectList[projects[addr].pointer] == addr);
    }

    function getProjectByAddress(address addr)
        public
        view
        returns(uint256 votes, uint256 min, uint256 max)
    {
        return (projects[addr].votes, projects[addr].minPayment, projects[addr].maxPayment);
    }

    function getProjectByIndex(uint index)
        public
        view
        returns(uint256 votes, uint256 min, uint256 max)
    {
        require (index >= 0 && index < getProjectCount(), "Invalid index");
        address _addr = projectList[index];
        return (projects[_addr].votes, projects[_addr].minPayment, projects[_addr].maxPayment);
    }


    function voteByAddress (address addr, uint256 amount) 
        external returns(bool res)  
    {
        require(amount > 0, "Must spend tokens to vote.");
        //transfer amount to smart contract
        transfer(owner(), amount);
        projects[addr].votes += amount;
        emit Voting(msg.sender, addr, amount);
        return true;
    }

    function newProject (uint256 min, uint256 max) 
        external returns(bool res)  
    {
        require(msg.sender != owner(), "Contract owner cannot create a new project");
        //check the user didn't submit another project already. We are gonna extend this to allow for multiple projects per user/account (maybe)
        require(!isProject(msg.sender), "Applicant already sent a project, delete it before submitting a new one");
        Project memory _newProject = Project({votes:0, minPayment:min, maxPayment:max, pointer:0});
        projects[msg.sender] = _newProject;
        projects[msg.sender].pointer = projectList.push(msg.sender) - 1;
        emit NewProject(msg.sender);
        return true;
    }

    function getProjectCount() public view returns(uint count) {
        return projectList.length;
    }

    function deleteProjectByAddress(address addr) public returns(bool success) {
        require(isProject(addr), "Project not present, cannot delete it");
        uint rowToDelete = projects[addr].pointer;
        address keyToMove   = projectList[projectList.length-1];
        projectList[rowToDelete] = keyToMove;
        projects[keyToMove].pointer = rowToDelete;
        projectList.length--;
        return true;
    }

          
}