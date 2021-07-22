// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

interface IKuka {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract KukaburraTimelock is Ownable {
    // The address of the Kukaburra token contract
    address public kukaburra;

    // the address of the destination that will receive the tokens (default is deployer)
    address public destination;

    // timestamp when the last token release was called
    uint public lastRelease;

    // gap of time between how often release() can be called by the owner
    uint public releaseGap = 24 hours;

    constructor (address _kukaburra) {
        kukaburra = _kukaburra;
        lastRelease = block.timestamp;
        destination = msg.sender;
    }

    function release(uint _amount)
    external onlyOwner {
        // only allow the caller to transfer up to 1% of the tokens held by the contract
        require(_amount <= IKuka(kukaburra).balanceOf(address(this)) / 100, "KukaburraTimelock: _amount must be less than 1% of contract balance.");

        // only allow this function to be called if the current timestamp is greater than the timestamp of the last release and the relase gap combined
        require(block.timestamp >= lastRelease + releaseGap, "KukaburraTimelock: Release not ready.");

        // update the last release variable
        lastRelease = block.timestamp;

        // transfer the specified amount of tokens to the owner
        IKuka(kukaburra).transfer(destination, _amount);
    }

    function setDestination(address _destination)
    external onlyOwner {
        destination = _destination;
    }

    function viewNextUnlockTimestamp()
    external view returns (uint) {
        return lastRelease + releaseGap;
    }

    function viewLockTimeRemaining()
    external view returns (uint) {
        uint lockTimer;

        if (block.timestamp >= lastRelease + releaseGap)
            lockTimer = 0;
        else
            lockTimer = (lastRelease + releaseGap) - block.timestamp;

        return lockTimer;
    }
}