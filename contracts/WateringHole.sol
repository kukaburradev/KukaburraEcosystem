// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

interface IKuka {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function deliver(uint256 tAmount) external;
}

interface IPair {
    function sync() external;
}

contract WateringHole is Ownable {
    // The address of the Kukaburra token contract
    address public kukaburra;

    // The timestamp of the last drip
    uint public lastDrip;

    // How many seconds to wait between drips. block.timestamp must be greater than or equal to this (when added to the lastDrip variable) when calling `drip()`
    uint public nextDrip;

    // percentage (minimum 000.01%) to drip to holders via `deliver()` function
    uint public dripShare;

    // percentage (minimum 000.01%) to burn
    uint public burnShare;

    // scale percentages from 000.01% to 100.00
    uint constant DIVISOR = 10000;

    // Array of all the AMM pair addresses to sync after dripping
    address[] public pairs;

    modifier validateParameters(uint _nextDrip, uint _dripShare, uint _burnShare) {
        require(_nextDrip <= 2628000, "WateringHole: Next drip must be less than one month away.");
        require(_nextDrip >= 3600, "WateringHole: Next drip must be at least 1 hour away.");
        require(_dripShare <= 500, "WateringHole: Drip share too large. Maximum 5%");
        require(_burnShare <= 500, "WateringHole: Burn share too large. Maximum 5%");

        _;
    }

    modifier validatePairs(address[] memory _pairs) {
        for(uint x = 0; x < _pairs.length; x++) {
            (bool success, bytes memory data) = _pairs[x].call(
                abi.encodeWithSignature("sync()")
            );

            require(success, "WateringHole: Invalid pairs");
        }

        _;
    }

    constructor (address _kukaburra, uint _nextDrip, uint _dripShare, uint _burnShare) 
    validateParameters(_nextDrip, _dripShare, _burnShare) {
        kukaburra = _kukaburra;
        nextDrip = _nextDrip;
        dripShare = _dripShare;
        burnShare = _burnShare;
    }

    function _getInfo ()
    internal view returns (uint, uint, uint) {
        // this variable stores the calculation of how many seconds are left
        uint dripTimer;

        // load the amount of tokens held by this contract
        uint balance = IKuka(kukaburra).balanceOf(address(this));

        // calculate how many tokens to deliver to holders
        uint dripAmount = (balance / DIVISOR) * dripShare;
        // calculate how many tokens to burn
        uint burnAmount = (balance / DIVISOR) * burnShare;

        // if the drip timer has elapsed then we set the timer to 0 because we don't need to wait anymore
        if(block.timestamp >= lastDrip + nextDrip)
            dripTimer = 0;
        // if the drip timer hasnt elapsed then we return how many seconds are needed until it does
        else
            dripTimer = (lastDrip + nextDrip) - block.timestamp;

        return (dripTimer, dripAmount, burnAmount);
    }

    function _syncPairs()
    internal {
        for(uint x = 0; x < pairs.length; x++)
            IPair(pairs[x]).sync();
    }

    function changeSettings(uint _nextDrip, uint _dripShare, uint _burnShare)
    external validateParameters(_nextDrip, _dripShare, _burnShare) onlyOwner {
        nextDrip = _nextDrip;
        dripShare = _dripShare;
        burnShare = _burnShare;
    }

    function updatePairs(address[] calldata _pairs)
    external validatePairs(_pairs) onlyOwner {
        pairs = _pairs;
    }

    function drip()
    external {
        // check if this contract can drip or not, save gas by not loading the other info yet if we need to revert
        require(block.timestamp >= lastDrip + nextDrip, "WateringHole: Wait longer.");

        uint dripAmount;
        uint burnAmount;

        // load the information needed
        (, dripAmount, burnAmount) = _getInfo();

        // stream the drip amount directly to holders
        IKuka(kukaburra).deliver(dripAmount);
        // burn the burn amount by transferring it to the dead address
        IKuka(kukaburra).transfer(address(0x000000000000000000000000000000000000dEaD), burnAmount);

        // update the last drip tracker to the current timestamp
        lastDrip = block.timestamp;

        // loop through all of the AMM pairs and call sync()
        _syncPairs();
    }

    // returns the information related to the next drip event
    function viewNextDrip()
    external view returns (uint, uint, uint) {
        return _getInfo();
    }
}
