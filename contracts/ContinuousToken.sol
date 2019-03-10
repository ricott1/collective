pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./BancorBondingCurve.sol";
import "./CappedGasPrice.sol";

contract ContinuousToken is BancorBondingCurve, Ownable, ERC20, CappedGasPrice {
    using SafeMath for uint256;

    uint256 public scale = 10**18;
    uint256 public reserveBalance = 10*scale;
    uint256 public reserveRatio;

    event ContinuousMint(
        address _from,
        uint256  _amount,
        uint256 _deposit
    );

    event ContinuousBurn(
        address _from,
        uint256  _amount,
        uint256 _reimbursement
    );

    constructor(
        uint256 _reserveRatio
    ) public {
        reserveRatio = _reserveRatio;
        _mint(msg.sender, 1*scale);
    }

    function mint() public payable validGasPrice {
        require(msg.value > 0, "Must send ether to buy tokens.");
        _continuousMint(msg.value, msg.sender);
    }

    function burn(uint256 _amount) public validGasPrice {
        uint256 returnAmount = _continuousBurn(_amount);
        msg.sender.transfer(returnAmount);
    }

    function () external payable  { mint(); }

    function calculateContinuousMintReturn(uint256 _amount)
        public view returns (uint256 mintAmount)
    {
        return calculatePurchaseReturn(totalSupply(), reserveBalance, uint32(reserveRatio), _amount);
    }

    function calculateContinuousBurnReturn(uint256 _amount)
        public view returns (uint256 burnAmount)
    {
        return calculateSaleReturn(totalSupply(), reserveBalance, uint32(reserveRatio), _amount);
    }

    function _continuousMint(uint256 _deposit, address _beneficiary)
        internal returns (uint256)
    {
        require(_deposit > 0, "Deposit must be non-zero.");
        uint256 amount = calculateContinuousMintReturn(_deposit);
        _mint(_beneficiary, amount);
        reserveBalance = reserveBalance.add(_deposit);
        emit ContinuousMint(_beneficiary, amount, _deposit);
        return amount;
    }

    function _continuousBurn(uint256 _amount)
        internal returns (uint256)
    {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint256 reimburseAmount = calculateContinuousBurnReturn(_amount);
        reserveBalance = reserveBalance.sub(reimburseAmount);
        _burn(msg.sender, _amount);
        emit ContinuousBurn(msg.sender, _amount, reimburseAmount);
        return reimburseAmount;
    }
}