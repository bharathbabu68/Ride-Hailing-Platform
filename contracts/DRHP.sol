// contracts/DRHPToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DRHPToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Decentralized Ride Hailing Platform", "DRHP") {
        initialSupply = initialSupply * 10**18;
        _mint(msg.sender, initialSupply);
    }

    function mint(uint amount) public returns(uint){
        amount = amount * 10**18;
        _mint(msg.sender, amount);
        return 1;
    }
}