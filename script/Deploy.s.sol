// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import "forge-std/Script.sol";
import "../contracts/AutoGig.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast(0x023425ca665f73a3125f9ebd4dfce3d78851e1a2eee81d2e12ffe080d3111e58);
        new AutoGig(0x036CbD53842c5426634e7929541eC2318f3dCF7e);
        vm.stopBroadcast();
    }
}
