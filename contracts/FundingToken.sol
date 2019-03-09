pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./ContinuousToken.sol";

contract FundingToken is ContinuousToken {
    using SafeMath for uint256;

    uint256 public timeframe;
    uint256 public totalFunds;
    uint constant public winnerListSize = 2;
    uint256 constant public contractFee = 5;

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
        uint field;
        uint256 time;
        uint pointer;      
    }

    mapping (address => Project) public projects;
    address[] public projectList;
    address[] public winnerList;

    
    constructor(uint256 _reserveRatio, uint256 _timeframe) ContinuousToken(_reserveRatio) public {
        timeframe = _timeframe;
        totalFunds = 0;
    }

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
        returns(uint256 votes, uint256 min, uint256 max, uint field, uint256 time)
    {
        Project memory p = projects[addr];
        return (p.votes, p.minPayment, p.maxPayment, p.field, p.time);
    }

    function getProjectByIndex(uint index)
        public
        view
        returns(uint256 votes, uint256 min, uint256 max, uint field, uint256 time)
    {
        require (index >= 0 && index < getProjectCount(), "Invalid index");
        address _addr = projectList[index];
        Project memory p = projects[_addr];
        return (p.votes, p.minPayment, p.maxPayment, p.field, p.time);
    }

    function getProjectVotesByAddress(address addr)
        public
        view
        returns(uint256 votes)
    {
        Project memory p = projects[addr];
        return p.votes;
    }

    function getProjectVotesByIndex(uint index)
        public
        view
        returns(uint256 votes)
    {
        require (index >= 0 && index < getProjectCount(), "Invalid index");
        address _addr = projectList[index];
        Project memory p = projects[_addr];
        return p.votes;
    }

    function getProjectPointerByAddress(address addr)
        public
        view
        returns(uint pointer)
    {
        Project memory p = projects[addr];
        return p.pointer;
    }


    function voteByAddress (address addr, uint256 amount) 
        external returns(bool res)  
    {
        require(amount > 0, "Must spend tokens to vote.");
        //transfer amount to smart contract
        transfer(owner(), amount);
        totalFunds += amount;
        projects[addr].votes += amount;
        //update winnerList
        updateWinnerList(addr);
        emit Voting(msg.sender, addr, amount);
        return true;
    }

    function newProject (uint256 min, uint256 max, uint field) 
    //can create or fund a project only when not distributing
        external returns(bool res)  
    {
        require(msg.sender != owner(), "Contract owner cannot create a new project");
        //check the user didn't submit another project already. We are gonna extend this to allow for multiple projects per user/account (maybe)
        require(!isProject(msg.sender), "Applicant already sent a project, delete it before submitting a new one");
        Project memory _newProject = Project({votes:0, minPayment:min, maxPayment:max, field:field, time:now, pointer:0});
        projects[msg.sender] = _newProject;
        projects[msg.sender].pointer = projectList.push(msg.sender) - 1;
        emit NewProject(msg.sender);
        return true;
    }

    function getProjectCount() 
        public view 
        returns(uint count) 
    {
        return projectList.length;
    }

    function deleteProjectByAddress(address addr) public onlyOwner returns(bool success) {
        require(isProject(addr), "Project not present, cannot delete it");
        uint rowToDelete = projects[addr].pointer;
        address keyToMove   = projectList[projectList.length-1];
        projectList[rowToDelete] = keyToMove;
        projects[keyToMove].pointer = rowToDelete;
        projectList.length--;
        return true;
    }

    function distributeFunds () 
        public onlyOwner 
        returns(bool res) 
    {
        uint256 prize = calculatePrize();
        uint wIndex = findMostVotedIndex();
        address wAddr = winnerList[wIndex];
        //make sure ties get the same prize

        for (uint i=0; i<winnerList.length; i++) {
            Project memory p = projects[winnerList[i]];
            p.votes = 0;
        }
        winnerList.length = 0;
        transfer(wAddr, prize);
        totalFunds = 0;
        
        return true;
    }

    function updateWinnerList(address addr) 
        internal 
        returns(bool res)
    {
        Project memory p = projects[addr];
        if (winnerList.length < winnerListSize) {
            winnerList.push(addr);
        } else {
            uint index = findLeastVotedIndex();
            if(projects[winnerList[index]].votes < p.votes) {
                winnerList[index] = addr;
            }     
        }

        return true;
    }

    function findLeastVotedIndex () 
        internal view
        returns(uint index)  
    {
        require (winnerList.length > 0);
        require (projectList.length >= winnerList.length);
        
        uint _index = 0;
        Project memory p = projects[winnerList[_index]];
        uint256 smallest = p.votes;

        for (uint i=winnerList.length - 1; i>=0; i--) {
            p = projects[winnerList[i]];
            if(p.votes < smallest) {
                _index = i;
                smallest = p.votes;
            }
        }

        return _index;
    }

    function findMostVotedIndex () 
        internal view
        returns(uint index)  
    {
        require (winnerList.length > 0);
        require (projectList.length >= winnerList.length);
        
        uint _index = 0;
        Project memory p = projects[winnerList[_index]];
        uint256 largest = p.votes;

        for (uint i=winnerList.length - 1; i>=0; i--) {
            p = projects[winnerList[i]];
            if(p.votes > largest) {
                _index = i;
                largest = p.votes;
            }
        }

        return _index;
    }
    
    function calculatePrize () 
        view internal
        returns(uint256 prize) 
    {
        return totalFunds * (100 - contractFee) / 100;
    }
    
    


          
}