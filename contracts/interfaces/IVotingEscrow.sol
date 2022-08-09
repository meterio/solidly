// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IVotingEscrow {
    struct Point {
        int128 bias;
        int128 slope; // # -dweight / dt
        uint256 ts;
        uint256 blk; // block
    }

    function user_point_epoch(uint256 tokenId) external view returns (uint256);

    function epoch() external view returns (uint256);

    function user_point_history(uint256 tokenId, uint256 loc)
        external
        view
        returns (Point memory);

    function point_history(uint256 loc) external view returns (Point memory);

    function checkpoint() external;

    function deposit_for(uint256 tokenId, uint256 value) external;

    function token() external view returns (address);

    function totalSupply() external view returns (uint256);

    function create_lock_for(
        uint256,
        uint256,
        address
    ) external returns (uint256);

    function transferFrom(
        address,
        address,
        uint256
    ) external;

    function isApprovedOrOwner(address, uint256) external view returns (bool);

    function balanceOfNFT(uint256) external view returns (uint256);

    function ownerOf(uint256) external view returns (address);

    function attach(uint256 tokenId) external;

    function detach(uint256 tokenId) external;

    function voting(uint256 tokenId) external;

    function abstain(uint256 tokenId) external;
}
