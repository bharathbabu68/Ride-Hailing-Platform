// DRHP Token and Staking Contract
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DRHPToken is ERC20 {

    address owner;
    address[] internal stakeholders;
    mapping(address=>uint) internal stakes;
    mapping(address => uint256) internal rewards;
    uint public rewardfactor=0;
    mapping(address=>uint) public  address_to_rewardfactor;
    uint256 totalstakes=0;
    mapping(address=>uint) public user_total_stakes;
    mapping(address=>uint) public user_total_rewards;
    uint current_reward_percentage=10;
    uint totalrewards=0;
    
    constructor(uint256 initialSupply) ERC20("Decentralized Ride Hailing Platform", "DRHP") {
       owner = msg.sender;
       initialSupply = initialSupply * 10**18;
        _mint(msg.sender, initialSupply);
    }

    function mint(uint amount) public returns(uint){
       amount = amount * 10**18;
        _mint(msg.sender, amount);
        return 1;
    }
    function getotalstakes() public view returns(uint){
        return totalstakes;
    }
    function getusertotalstake() public view returns(uint){
        return user_total_stakes[msg.sender];
    }
    function getusertotalreward() public view returns(uint){
        return user_total_rewards[msg.sender];
    }
    function getcurrentrewardpercentage() public view returns(uint){
        return current_reward_percentage;
    }
    function getusercurrentstake() public view returns(uint){
        uint staked_amount = stakes[msg.sender];
        return staked_amount;
    }

    function gettotalreward() public view returns(uint){
        return totalrewards;
    }
    
    function depositstake(uint _amount) public returns (uint){
        require(balanceOf(msg.sender)>=_amount);
         _burn(msg.sender,_amount);
        //  check if user has already staked
         if(stakes[msg.sender]==0)
        {
            bool is_stakeholder=false;
            for(uint i=0;i<stakeholders.length;i++)
            {
                if(stakeholders[i]==msg.sender)
                {
                    is_stakeholder=true;
                    break;
                }

            }
            if(is_stakeholder==false)
            {
                stakeholders.push(msg.sender);
            }
        }
        stakes[msg.sender]+=_amount;
        user_total_stakes[msg.sender]+=_amount;
        // storing current rewardfactor to the depositor
        address_to_rewardfactor[msg.sender]=rewardfactor;
        totalstakes+=_amount;
        return 1;
    }

    function removestake(uint256 amount) public{
        //check if stakeholder's current stake is greater than amount
        require(stakes[msg.sender]>=amount);
        stakes[msg.sender]-=amount;
        // mint tokens to the stakeholder without any reward
        _mint(msg.sender,amount);
    }
   
    function distributeRewards( uint reward_percentage) public
   {
    // function can only be called by the owner
       require(msg.sender == owner);
       require(totalstakes>0);
       current_reward_percentage=reward_percentage;
       rewardfactor+=(reward_percentage*(10**10)/totalstakes);
   }

  
   function claim_reward() public{
       uint deposited_amount=stakes[msg.sender];
       // Calculate reward based on current rewardfactor and the rewardfactor at the time he deposited his stake
        uint256 reward = (stakes[msg.sender]*(rewardfactor-address_to_rewardfactor[msg.sender]))/(10**10);
        user_total_rewards[msg.sender]+=reward;
        totalrewards+=reward;
        totalstakes-=deposited_amount;
        stakes[msg.sender]=0;
        uint amount=deposited_amount+reward;
       _mint(msg.sender,amount);
   }
     
}
