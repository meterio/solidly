// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "../../lib/Math.sol";
import "../../lib/SafeERC20.sol";
import "../../interface/IUnderlying.sol";
import "../../interface/IVoter.sol";
import "../../interface/IVe.sol";
import "../../interface/IVeDist.sol";
import "../../interface/IMinter.sol";
import "../../interface/IERC20.sol";
import "../../interface/IController.sol";

/// @title 按照 ve(3,3) 编写铸币规则,从代币中抽象出来以支持任何允许铸造的代币
contract DystMinter is IMinter {
    using SafeERC20 for IERC20;

    /// @dev 允许每周铸币一次（每周四 00:00 UTC 重置）
    uint internal constant _WEEK = 86400 * 7;
    /// @dev 52周 * 4
    uint internal constant _LOCK_PERIOD = 86400 * 7 * 52 * 4;

    /// @dev 每周基础释放量减少 2%
    uint internal constant _WEEKLY_EMISSION_DECREASE = 98;
    uint internal constant _WEEKLY_EMISSION_DECREASE_DENOMINATOR = 100;

    /// @dev 结束游戏的每周排放阈值。 流通供应的1%。
    uint internal constant _TAIL_EMISSION = 1;
    uint internal constant _TAIL_EMISSION_DENOMINATOR = 100;

    /// @dev 减少对 ve 持有者的每周奖励。 全额的10%。
    uint internal constant _GROWTH_DIVIDER = 10;

    /// @dev 每周将 initialStubCirculationSupply 减少 1%。
    ///      仅当循环供应低于存根循环时才减少
    uint internal constant _INITIAL_CIRCULATION_DECREASE = 99;
    uint internal constant _INITIAL_CIRCULATION_DECREASE_DENOMINATOR = 100;

    /// @dev 存根初始循环供应以避免锁定金额的第一周缺口.
    ///      应该等于预期的未锁定代币百分比.
    uint internal constant _STUB_CIRCULATION = 10;
    uint internal constant _STUB_CIRCULATION_DENOMINATOR = 100;

    /// @dev 确定整个排放动态的核心参数.
    ///       每周都会减少.
    uint internal constant _START_BASE_WEEKLY_EMISSION = 20_000_000e18;

    /// @dev 底层资产
    IUnderlying public immutable token;
    /// @dev veNFT合约
    IVe public immutable ve;
    /// @dev 控制器,管理veDist和voter合约地址
    address public immutable controller;
    /// @dev 基础每周释放量 = 初始基础每周释放量
    uint public baseWeeklyEmission = _START_BASE_WEEKLY_EMISSION;
    /// @dev 存根初始循环
    uint public initialStubCirculation;
    /// @dev 活跃周期
    uint public activePeriod;

    /// @dev 初始化开关
    address internal initializer;

    event Mint(
        address indexed sender,
        uint weekly,
        uint growth,
        uint circulatingSupply,
        uint circulatingEmission
    );

    /**
     * @dev 构造函数
     * @param ve_ veNFT地址
     * @param controller_ 控制器合约地址
     * @param warmingUpPeriod 热身周期,0
     */
    constructor(
        address ve_, // the ve(3,3) system that will be locked into
        address controller_, // controller with veDist and voter addresses
        uint warmingUpPeriod // 2 by default
    ) {
        initializer = msg.sender;
        token = IUnderlying(IVe(ve_).token());
        ve = IVe(ve_);
        controller = controller_;
        // 活跃周期 = (当前时间戳 + (热身周期 * 7天)) / 7天 * 7天
        activePeriod =
            ((block.timestamp + (warmingUpPeriod * _WEEK)) / _WEEK) *
            _WEEK;
    }

    /**
     * @dev 向持有者铸造初始供应并将其锁定为 ve 代币
     * @param claimants 地址列表
     * @param amounts 对应数量
     * @param totalAmount 总量
     */
    function initialize(
        address[] memory claimants,
        uint[] memory amounts,
        uint totalAmount
    ) external {
        // 确认初始化权限
        require(initializer == msg.sender, "Not initializer");
        // 向当前合约铸造总量
        token.mint(address(this), totalAmount);
        // 存根初始循环 = 总量 * 10%
        initialStubCirculation =
            (totalAmount * _STUB_CIRCULATION) /
            _STUB_CIRCULATION_DENOMINATOR;
        // ve批准Max
        token.approve(address(ve), type(uint).max);
        uint sum;
        // 循环地址列表
        for (uint i = 0; i < claimants.length; i++) {
            // 调用ve.createLockFor(地址对应数量,4年,地址)
            ve.createLockFor(amounts[i], _LOCK_PERIOD, claimants[i]);
            // 累加数量
            sum += amounts[i];
        }
        // 确认总量和累加相等
        require(sum == totalAmount, "Wrong totalAmount");
        // 初始化开关
        initializer = address(0);
        // 活跃周期为一周后时间按周取整
        activePeriod = ((block.timestamp + _WEEK) / _WEEK) * _WEEK;
    }

    /// @dev 从controller合约获取veDist合约地址
    function _veDist() internal view returns (IVeDist) {
        return IVeDist(IController(controller).veDist());
    }

    /// @dev 从controller合约获取voter合约地址
    function _voter() internal view returns (IVoter) {
        return IVoter(IController(controller).voter());
    }

    /// @dev 将循环供应计算为总代币供应 - 锁定供应 - veDist 余额 - 铸币者余额
    function circulatingSupply() external view returns (uint) {
        return _circulatingSupply();
    }

    /// @dev 将循环供量 = token总代币供应 - veNFT锁定量 - veDist余额 - 当前合约余额
    function _circulatingSupply() internal view returns (uint) {
        return
            token.totalSupply() - // token总供应量 -
            IUnderlying(address(ve)).totalSupply() - // ve总供应量
            // 从流通中排除 veDist 代币余额 - 用户无法在没有锁定的情况下领取它们
            // 逾期索赔将导致错误的流通供应计算
            token.balanceOf(address(_veDist())) -
            // 排除铸币厂余额，显然是锁定的
            token.balanceOf(address(this));
    }

    /// @dev 循环供应调整值
    function _circulatingSupplyAdjusted() internal view returns (uint) {
        // 当大量代币被分发和锁定时，我们需要一个存根供应来弥补初始缺口
        // Max(循环供应量, 存根初始循环)
        return Math.max(_circulatingSupply(), initialStubCirculation);
    }

    /// @dev 释放量计算为铸币厂可用供应量的 2%，由流通/总供应量调整
    function calculateEmission() external view returns (uint) {
        return _calculateEmission();
    }

    function _calculateEmission() internal view returns (uint) {
        // 使用调整后的流通供应来避免第一周的缺口
        // 基础每周释放量 应该每周减少
        // 基础每周释放量 * 循环供应调整值 / token总供应量
        return
            (baseWeeklyEmission * _circulatingSupplyAdjusted()) /
            token.totalSupply();
    }

    /// @dev 每周释放量取计算（又名目标）释放量与循环尾端释放量的最大值
    function weeklyEmission() external view returns (uint) {
        return _weeklyEmission();
    }

    function _weeklyEmission() internal view returns (uint) {
        // Max(计算释放量, 循环释放量)
        return Math.max(_calculateEmission(), _circulatingEmission());
    }

    /// @dev 将尾端（无限）排放计算为总供应量的 0.2%
    function circulatingEmission() external view returns (uint) {
        return _circulatingEmission();
    }

    /// @dev 循环释放量 = 循环供应量 * 1%
    function _circulatingEmission() internal view returns (uint) {
        return
            (_circulatingSupply() * _TAIL_EMISSION) /
            _TAIL_EMISSION_DENOMINATOR;
    }

    /// @dev 计算通货膨胀并相应调整 ve 余额
    function calculateGrowth(uint _minted) external view returns (uint) {
        return _calculateGrowth(_minted);
    }

    /// @dev 计算通胀 = ve锁定量 * 铸造量 / token总量 / 10
    function _calculateGrowth(uint _minted) internal view returns (uint) {
        return
            (IUnderlying(address(ve)).totalSupply() * _minted) /
            token.totalSupply() /
            _GROWTH_DIVIDER;
    }

    /// @dev 更新周期每个周期（1 周）只能调用一次
    function updatePeriod() external override returns (uint) {
        uint _period = activePeriod;
        // 仅在新周触发
        if (block.timestamp >= _period + _WEEK && initializer == address(0)) {
            // 新周期 = 当前时间按周取整
            _period = (block.timestamp / _WEEK) * _WEEK;
            // 赋值新周期
            activePeriod = _period;
            // 每周释放量
            uint _weekly = _weeklyEmission();
            // 每周排放量略有减少
            // 基础每周释放量 = 基础每周释放量 * 98%
            baseWeeklyEmission =
                (baseWeeklyEmission * _WEEKLY_EMISSION_DECREASE) /
                _WEEKLY_EMISSION_DECREASE_DENOMINATOR;
            // 如果高于实际流通量，则每周减少存根供应
            // 如果 存根初始循环 > 循环供应量 * 1%
            if (initialStubCirculation > _circulatingEmission()) {
                // 存根初始循环 = 存根初始循环 * 99%
                initialStubCirculation =
                    (initialStubCirculation * _INITIAL_CIRCULATION_DECREASE) /
                    _INITIAL_CIRCULATION_DECREASE_DENOMINATOR;
            }

            // 通胀 = 根据每周释放量计算通胀
            uint _growth = _calculateGrowth(_weekly);
            // 需求量 = 通胀 + 每周释放量
            uint _required = _growth + _weekly;
            // 当前合约余额
            uint _balanceOf = token.balanceOf(address(this));
            // 如果当前合约余额 < 需求量
            if (_balanceOf < _required) {
                // 铸币
                token.mint(address(this), _required - _balanceOf);
            }

            // 将通胀发送到veDist合约
            IERC20(address(token)).safeTransfer(address(_veDist()), _growth);
            // 刚刚在 veDist 中铸造的检查点令牌余额
            _veDist().checkpointToken();
            // 检查点供应
            _veDist().checkpointTotalSupply();

            // 将每周释放量发送到voter合约,并通知奖励
            token.approve(address(_voter()), _weekly);
            _voter().notifyRewardAmount(_weekly);

            // 触发事件
            emit Mint(
                msg.sender, // 调用账户
                _weekly, // 每周释放量
                _growth, // 通胀
                _circulatingSupply(), // 循环供应量
                _circulatingEmission() // 循环释放量
            );
        }
        return _period;
    }
}
