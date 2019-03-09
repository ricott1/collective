pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./ContinuousToken.sol";

contract FundingToken is ContinuousToken {
    using SafeMath for uint256;

    uint256 public timeframe;
    uint256 public totalFunds;
    uint constant public winnerListSize = 3;
    uint256 constant public contractFeePerThousand = 1;
    

    event Voting(
        address _from,
        address  _to,
        uint256 _amount
    );

    event NewProject(
        address  _addr
    );

    event FundDistributed(
        address addr, 
        uint256 fund
    );
    

    struct Project {
        uint256 funds; 
        uint256 minFunding;
        uint field;
        uint256 time;
        uint pointer;      
    }

    mapping (address => Project) public projects;
    mapping (address => uint) public subscriptions;
    address[] public projectList;
    address[] public winnerList;

    
    constructor(uint256 _reserveRatio, uint256 _timeframe) ContinuousToken(_reserveRatio) public {
        timeframe = _timeframe;
        totalFunds = 0;
    }
    

    function burnExtraFunds (uint256 _amount) 
        internal onlyOwner 
        returns(bool res)
    {
        burn(_amount);
        return true;
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
        returns(uint256 funds, uint256 min, uint field, uint256 time)
    {
        Project memory p = projects[addr];
        return (p.funds, p.minFunding, p.field, p.time);
    }

    function getProjectByIndex(uint index)
        public
        view
        returns(uint256 funds, uint256 min, uint field, uint256 time)
    {
        require (index >= 0 && index < getProjectCount(), "Invalid index");
        address _addr = projectList[index];
        Project memory p = projects[_addr];
        return (p.funds, p.minFunding, p.field, p.time);
    }

    function getProjectVotesByAddress(address addr)
        public
        view
        returns(uint256 funds)
    {
        Project memory p = projects[addr];
        return p.funds;
    }

    function getProjectVotesByIndex(uint index)
        public
        view
        returns(uint256 funds)
    {
        require (index >= 0 && index < getProjectCount(), "Invalid index");
        address _addr = projectList[index];
        Project memory p = projects[_addr];
        return p.funds;
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
        projects[addr].funds += amount;
        //update winnerList
        updateWinnerList(addr);
        emit Voting(msg.sender, addr, amount);
        return true;
    }

    function newProject (uint256 min,  uint field) 
    //can create or fund a project only when not distributing
        external 
        returns(bool res)  
    {
        require(msg.sender != owner(), "Contract owner cannot create a new project");
        //check the user didn't submit another project already. We are gonna extend this to allow for multiple projects per user/account (maybe)
        require(!isProject(msg.sender), "Applicant already sent a project, delete it before submitting a new one");
        Project memory _newProject = Project({funds:0, minFunding:min, field:field, time:now, pointer:0});
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

        require (winnerList.length == winnerListSize);
        
        //make sure ties get the same prize. Right now is time ordered (not even sure)
        uint256 extraFunds = totalFunds;
        for (uint i=0; i<winnerList.length; i++) {
            //popWinner, it returns the most voted project address and removes it from the winnerList
            address wAddress = popWinner();
            Project memory p = projects[wAddress];
            uint256 wPrize = calculatePrize(i, p.funds);
            transfer(wAddress, wPrize);
            extraFunds -= wPrize;
            emit FundDistributed(wAddress, wPrize);
        }
        winnerList.length = 0;

        resetVotes();
        burnExtraFunds(extraFunds);
        totalFunds = 0;
        
        return true;
    }

    function resetVotes() 
        internal view
        returns(bool res)  
    {
        //reset funds to 0
        for (uint i=0; i<projectList.length; i++) {
            //popWinner, it returns the most voted project and removes it from the winnerList
            Project memory p = projects[projectList[i]];
            p.funds = 0;
        }

        return true;
    }
    

    function popWinner () 
        internal
        returns(address wAddress)  
    {
        uint wIndex = findMostVotedIndex();
        address wAddr = winnerList[wIndex];
        //remove winner from winnerList
        if(wIndex != winnerList.length - 1) {
            //copy last project to wIndex
            winnerList[wIndex] = winnerList[winnerList.length - 1];
        }
        //remove last project
        winnerList.length--;
        return wAddr;
        
    }
    

    function updateWinnerList(address addr) 
        internal 
        returns(bool res)
    {
        Project memory p = projects[addr];
        //check if the project reached the minFunding
        if (p.funds >= p.minFunding) {
            if (winnerList.length < winnerListSize) {
                
                winnerList.push(addr);
            } else {
                uint index = findLeastVotedIndex();
                if(projects[winnerList[index]].funds < p.funds) {
                    winnerList[index] = addr;
                }     
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
        uint256 smallest = p.funds;

        for (uint i=winnerList.length - 1; i>=0; i--) {
            p = projects[winnerList[i]];
            if(p.funds < smallest) {
                _index = i;
                smallest = p.funds;
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
        uint256 largest = p.funds;

        for (uint i=winnerList.length - 1; i>=0; i--) {
            p = projects[winnerList[i]];
            if(p.funds > largest) {
                _index = i;
                largest = p.funds;
            }
        }

        return _index;
    }
    
    function calculateModifiedTotalPrize () 
        view internal
        returns(uint256 prize) 
    {
        return totalFunds * (1000 - contractFeePerThousand) / 1000;
    }

    function calculatePrize (uint prizeIndex, uint256 funds) 
        view public
        returns(uint256 prize) 
    {
        
        require (funds <= totalFunds, "Funds are more than the total funds pool");
        require (prizeIndex >= 0 && prizeIndex < winnerListSize, "Prize not present");
        
        uint256 propPrizePerThousand = 1000 * funds/ totalFunds;
        uint256 prizeModPerThousand = getRankingPrizePerThousand(prizeIndex, winnerList.length) + propPrizePerThousand;
        uint256 _prize = calculateModifiedTotalPrize() * prizeModPerThousand/1000/2;//the 2 is because we assign half funds proportionally and half based on ranking.
        //this are all rounded down numbers, in this case it is fine (we are not gonna spend all of the totalFunds).

        return _prize;
    }          


    //returns rangking prizes modifier dividing them as (total # of prizes - prizeIndex)**2/normalization
    function getRankingPrizePerThousand (uint prizeIndex, uint n) 
        internal pure
        returns(uint256 rp) 
    {
        uint256 norm = n * (2*n**2 + 3*n + 1) / 6;
        return 1000*(n - prizeIndex)**2/norm;
    }
    
}