// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IBaseV1Core {
    function claimFees() external returns (uint256, uint256);

    function tokens() external returns (address, address);
}
