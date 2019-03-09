pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
  string public constant name = "TestToken";
  string public constant symbol = "TT";
  uint8 public constant decimals = 18;

  constructor(address _sender) public  {
    uint256 initialSupply = 1000 * (10 ** uint256(decimals));
    _mint(_sender, initialSupply);
  }

}
