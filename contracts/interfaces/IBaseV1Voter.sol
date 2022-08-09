// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.11;

interface IBaseV1Voter {
    function notifyRewardAmount(uint256 amount) external;

    function attachTokenToGauge(uint256 _tokenId, address account) external;

    function detachTokenFromGauge(uint256 _tokenId, address account) external;

    function emitDeposit(
        uint256 _tokenId,
        address account,
        uint256 amount
    ) external;

    function emitWithdraw(
        uint256 _tokenId,
        address account,
        uint256 amount
    ) external;

    function distribute(address _gauge) external;

    function _ve() external view returns (address);
}
