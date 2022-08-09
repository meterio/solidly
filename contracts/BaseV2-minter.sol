// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.11;

import "./lib/Math.sol";
import "./interfaces/IVotingEscrow.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IBaseV1Voter.sol";
import "./interfaces/IVeDist.sol";
import "./access/AccessControl.sol";

contract BaseV2Minter is AccessControl {
    uint256 internal constant month = 86400 * 7 * 4; // allows minting once per month
    uint256 public ve_dist_ratio;
    uint256 public constant ve_dist_ratio_max = 10000;

    IERC20 public immutable _token;
    IBaseV1Voter public immutable _voter;
    IVotingEscrow public immutable _ve;
    IVeDist public immutable _ve_dist;
    uint256 public active_period;

    event Send(
        address indexed sender,
        uint256 ve_dist_amount,
        uint256 voter_amount
    );

    constructor(
        address __voter,
        address __ve,
        address __ve_dist
    ) {
        _token = IERC20(IVotingEscrow(__ve).token());
        _voter = IBaseV1Voter(__voter);
        _ve = IVotingEscrow(__ve);
        _ve_dist = IVeDist(__ve_dist);
        active_period = (block.timestamp / month) * month;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "forbidden");
        _;
    }

    function adminSetVeRatio(uint256 _ve_dist_ratio) public onlyAdmin {
        ve_dist_ratio = _ve_dist_ratio;
    }

    function update_period() external onlyAdmin returns (uint256) {
        uint256 _period = active_period;
        if (block.timestamp >= _period + month) {
            _period = (block.timestamp / month) * month;
            active_period = _period;

            uint256 _balanceOf = _token.balanceOf(address(this));
            uint256 ve_dist_amount = (_balanceOf * ve_dist_ratio) /
                ve_dist_ratio_max;

            require(_token.transfer(address(_ve_dist), ve_dist_amount));
            _ve_dist.checkpoint_token();
            _ve_dist.checkpoint_total_supply();

            uint256 voter_amount = _balanceOf - ve_dist_amount;
            _token.approve(address(_voter), voter_amount);
            _voter.notifyRewardAmount(voter_amount);

            emit Send(msg.sender, ve_dist_ratio, ve_dist_amount);
        }
        return _period;
    }
}
