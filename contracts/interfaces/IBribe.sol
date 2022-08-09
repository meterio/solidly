// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IBribe {
    function _deposit(uint256 amount, uint256 tokenId) external;

    function _withdraw(uint256 amount, uint256 tokenId) external;

    function getRewardForOwner(uint256 tokenId, address[] memory tokens)
        external;

    function left(address token) external view returns (uint256);

    function notifyRewardAmount(address token, uint256 amount) external;
}
