// contracts/RideScheduler.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RideScheduler{

    uint one_time_fee = 100 * 10**18; // one-time fee for registartion of a new driver, can be changed by governance in the future
    address token_address = 0x0ADD4Bf8134907e9e4e7C02472999B190beD0e50;

    struct driver {
        bool driver_validity_status; // if driver violates our rules, he can be removed by governance (will be implemented in the future)
        address allocated_passenger;
        address driver;
        uint ride_status; // 0 means that ride has not been started, // 1 means that the ride is on-going, // 2 means that ride is completed
        uint ride_amount;
        bool ride_verification_by_passenger;
    }

    address[] public drivers;

    mapping(address => driver) public address_to_driver;

    IERC20 token = IERC20(token_address);

    function fetch_one_time_fee() public view returns(uint){
        return one_time_fee;
    }

    function register_as_driver() public returns(uint){
        // require driver to stake a one-time fee of 100 tokens before registering as a driver to ensure that he sticks to the rules
        require(token.balanceOf(msg.sender)>=one_time_fee, "Driver doesn't have enough balance to register, recharge and try again");
        require(token.allowance(msg.sender, address(this)) == one_time_fee, "Driver has not approved the contract to withdraw its funds"); 
        token.transferFrom(msg.sender, address(this), one_time_fee);
        drivers.push(msg.sender);
        address_to_driver[msg.sender] = driver(true, address(0), msg.sender, 0, 0, false);
        return 1;
    }

    function is_driver_valid() public view returns(bool){
        driver storage curr = address_to_driver[msg.sender];
        if(curr.driver_validity_status==true)
            return true;
        else
            return false;
    }

    function allocate_driver_to_passenger(address passenger, uint fare) public returns(uint){
        driver storage curr = address_to_driver[msg.sender];
        require(curr.driver_validity_status==true, "Driver hasn't registered yet");
        require(curr.ride_status==0, "Ride has already been started, wait for the ride to complete");
        curr.allocated_passenger = passenger;
        curr.ride_amount = fare;
        return 1;
    }
    
    function pay_to_driver(address driver_address, uint amount) public returns(uint){
        // function to transfer money to contract 
        // passenger should have approved the contract to allow the contract to withdraw money from his account first
        driver storage curr = address_to_driver[driver_address];
        require(curr.driver_validity_status == true, "Driver has not registered yet");
        require(msg.sender == curr.allocated_passenger, "Sorry, not your cab!");
        require(curr.ride_amount==amount, "Agreed amount not matching");
        require(token.balanceOf(msg.sender) >= amount, "Passenger doesn't have enough balance in their wallet");
        require(token.allowance(msg.sender, address(this))==amount, "Passenger did not approve contract to withdraw funds from passeger");
        require(address_to_driver[driver_address].ride_status==0, "Ride has already been started");
        curr.ride_status = 1;
        token.transferFrom(msg.sender, address(this), amount);
        return 1;
    }

    function complete_ride_by_passenger(address driver_address) public returns (uint){
        driver storage curr = address_to_driver[driver_address];
        require(curr.driver_validity_status == true, "Driver has not registered yet");
        require(msg.sender == curr.allocated_passenger, "Sorry, not your cab!");
        require(curr.ride_status==1, "Ride must be on-going to end the ride");
        curr.ride_verification_by_passenger = true;
        curr.ride_status = 2;
        return 1;
    }

    function withdraw_earnings_from_ride() public returns(uint){
        driver storage curr = address_to_driver[msg.sender];
        require(curr.driver_validity_status == true, "Driver has not registered yet");
        require(curr.ride_verification_by_passenger==true, "Passenger has not approved the ride completion");
        require(curr.ride_status==2, "Ride has not ended yet");
        uint earnings = curr.ride_amount;
        require(token.balanceOf(address(this))>=earnings, "Ensure our contract has sufficient balance before paying driver");
        token.transfer(msg.sender, earnings);
        curr.ride_status=0;
        curr.ride_verification_by_passenger=false;
        return 1;
    }

}