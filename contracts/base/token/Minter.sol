// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "../../lib/Math.sol";
import "../../interface/IVe.sol";
import "../../interface/IERC20.sol";
import "../../interface/IVoter.sol";
import "../../interface/IVeDist.sol";
import "../../interface/IController.sol";
import "../../lib/AccessControl.sol";

contract Minter is AccessControl {
    uint256 internal constant _MONTH = 86400 * 7 * 4; // allows minting once per month
    uint256 public veDistRatio;
    uint256 public constant VE_DIST_RATIO_MAX = 10000;

    IERC20 public immutable _token;
    IVe public immutable _ve;
    address public immutable controller;
    uint256 public activeperiod;

    event Send(
        address indexed sender,
        uint256 veDistAmount,
        uint256 voterAmount
    );

    constructor(address __ve, address __controller) {
        _token = IERC20(IVe(__ve).token());
        _ve = IVe(__ve);
        controller = __controller;
        activeperiod = (block.timestamp / _MONTH) * _MONTH;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "forbidden");
        _;
    }

    function adminSetVeRatio(uint256 _veDistRatio) public onlyAdmin {
        veDistRatio = _veDistRatio;
    }

    function _veDist() internal view returns (IVeDist) {
        return IVeDist(IController(controller).veDist());
    }

    function _voter() internal view returns (IVoter) {
        return IVoter(IController(controller).voter());
    }

    function updatePeriod() external onlyAdmin returns (uint256) {
        uint256 _period = activeperiod;
        if (block.timestamp >= _period + _MONTH) {
            _period = (block.timestamp / _MONTH) * _MONTH;
            activeperiod = _period;

            uint256 _balanceOf = _token.balanceOf(address(this));
            uint256 veDistAmount = (_balanceOf * veDistRatio) /
                VE_DIST_RATIO_MAX;

            require(
                _token.transfer(address(_veDist()), veDistAmount),
                "Transfer Fail"
            );
            _veDist().checkpointToken();
            _veDist().checkpointTotalSupply();

            uint256 voterAmount = _balanceOf - veDistAmount;
            _token.approve(address(_voter()), voterAmount);
            _voter().notifyRewardAmount(voterAmount);

            emit Send(msg.sender, veDistRatio, veDistAmount);
        }
        return _period;
    }
}
