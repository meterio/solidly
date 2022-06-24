// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

library Math {
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}

interface erc20 {
    function totalSupply() external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address) external view returns (uint256);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);
}

interface ve {
    function token() external view returns (address);

    function balanceOfNFT(uint256) external view returns (uint256);

    function isApprovedOrOwner(address, uint256) external view returns (bool);

    function ownerOf(uint256) external view returns (address);

    function transferFrom(
        address,
        address,
        uint256
    ) external;
}

interface IBaseV1Factory {
    function isPair(address) external view returns (bool);
}

interface IBaseV1Core {
    function claimFees() external returns (uint256, uint256);

    function tokens() external returns (address, address);
}

interface IBribe {
    function notifyRewardAmount(address token, uint256 amount) external;

    function left(address token) external view returns (uint256);
}

interface Voter {
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
}

//Gauges 用于激励矿池，它们在 7 天内为质押的 LP 代币发放奖励代币
contract Gauge {
    address public immutable stake; // the LP token that needs to be staked for rewards
    address public immutable _ve; // the ve token used for gauges
    address public immutable bribe;
    address public immutable voter;

    uint256 public derivedSupply;
    mapping(address => uint256) public derivedBalances;

    uint256 internal constant DURATION = 7 days; // rewards are released over 7 days
    uint256 internal constant PRECISION = 10**18;

    // default snx staking contract implementation
    mapping(address => uint256) public rewardRate;
    mapping(address => uint256) public periodFinish;
    mapping(address => uint256) public lastUpdateTime;
    mapping(address => uint256) public rewardPerTokenStored;

    mapping(address => mapping(address => uint256)) public lastEarn;
    mapping(address => mapping(address => uint256))
        public userRewardPerTokenStored;

    mapping(address => uint256) public tokenIds;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    address[] public rewards;
    mapping(address => bool) public isReward;

    /// @notice A checkpoint for marking balance
    struct Checkpoint {
        uint256 timestamp;
        uint256 balanceOf;
    }

    /// @notice A checkpoint for marking reward rate
    struct RewardPerTokenCheckpoint {
        uint256 timestamp;
        uint256 rewardPerToken;
    }

    /// @notice A checkpoint for marking supply
    struct SupplyCheckpoint {
        uint256 timestamp;
        uint256 supply;
    }

    /// @notice 每个账户的余额检查点记录，按索引
    mapping(address => mapping(uint256 => Checkpoint)) public checkpoints;
    /// @notice 每个账户的检查点数
    mapping(address => uint256) public numCheckpoints;
    /// @notice 每个代币的余额检查点记录，按索引
    mapping(uint256 => SupplyCheckpoint) public supplyCheckpoints;
    /// @notice 检查点数
    uint256 public supplyNumCheckpoints;
    /// @notice 每个代币的余额检查点记录，按索引
    mapping(address => mapping(uint256 => RewardPerTokenCheckpoint))
        public rewardPerTokenCheckpoints;
    /// @notice 每个令牌的检查点数
    mapping(address => uint256) public rewardPerTokenNumCheckpoints;

    uint256 public fees0;
    uint256 public fees1;

    event Deposit(address indexed from, uint256 tokenId, uint256 amount);
    event Withdraw(address indexed from, uint256 tokenId, uint256 amount);
    event NotifyReward(
        address indexed from,
        address indexed reward,
        uint256 amount
    );
    event ClaimFees(address indexed from, uint256 claimed0, uint256 claimed1);
    event ClaimRewards(
        address indexed from,
        address indexed reward,
        uint256 amount
    );

    // https://scan-warringstakes.meter.io/address/0x5e76a76f6f69fe4ad16fefd49edae250dc108390
    constructor(
        address _stake, // VolatileV1 AMM - MTR/MTRG (vAMM-MTR/MTRG) https://scan-warringstakes.meter.io/address/0x936f9456dfb1469b1b63e4fafad4f12b0aa78fd2
        address _bribe, // https://scan-warringstakes.meter.io/address/0xf2A022cA30b0a6b2A2C7c53f43E3B74c7535c51a
        address __ve, // veNFT https://scan-warringstakes.meter.io/address/0x19761C8725Bf4CC3Dcee58e51A7Eb12dD4d895c6
        address _voter // https://scan-warringstakes.meter.io/address/0x9C10D9b626DAa2f6aAfdD1dbf53aA4b3608eb294
    ) {
        stake = _stake;
        bribe = _bribe;
        _ve = __ve;
        voter = _voter;
    }

    // simple re-entrancy check
    uint256 internal _unlocked = 1;
    modifier lock() {
        require(_unlocked == 1);
        _unlocked = 2;
        _;
        _unlocked = 1;
    }

    /// @dev 领取手续费
    function claimFees()
        external
        lock
        returns (uint256 claimed0, uint256 claimed1)
    {
        return _claimFees();
    }

    /// @dev 领取手续费
    function _claimFees()
        internal
        returns (uint256 claimed0, uint256 claimed1)
    {
        // 索取累计购买无人认领的费用（可通过可索取的 0 和可索取的 1 查看）
        (claimed0, claimed1) = IBaseV1Core(stake).claimFees();
        if (claimed0 > 0 || claimed1 > 0) {
            uint256 _fees0 = fees0 + claimed0;
            uint256 _fees1 = fees1 + claimed1;
            (address _token0, address _token1) = IBaseV1Core(stake).tokens();
            if (_fees0 > IBribe(bribe).left(_token0) && _fees0 / DURATION > 0) {
                fees0 = 0;
                _safeApprove(_token0, bribe, _fees0);
                IBribe(bribe).notifyRewardAmount(_token0, _fees0);
            } else {
                fees0 = _fees0;
            }
            if (_fees1 > IBribe(bribe).left(_token1) && _fees1 / DURATION > 0) {
                fees1 = 0;
                _safeApprove(_token1, bribe, _fees1);
                IBribe(bribe).notifyRewardAmount(_token1, _fees1);
            } else {
                fees1 = _fees1;
            }

            emit ClaimFees(msg.sender, claimed0, claimed1);
        }
    }

    /**
     * @notice 确定一个账户截至区块编号的先前余额
     * @dev 区块编号必须是最终区块，否则此功能将恢复以防止错误信息。
     * @param account 要检查的账户地址
     * @param timestamp 获取余额的时间戳
     * @return 账户截至给定区块的余额
     */
    function getPriorBalanceIndex(address account, uint256 timestamp)
        public
        view
        returns (uint256)
    {
        uint256 nCheckpoints = numCheckpoints[account];
        if (nCheckpoints == 0) {
            return 0;
        }

        // 首先检查最近的余额
        if (checkpoints[account][nCheckpoints - 1].timestamp <= timestamp) {
            return (nCheckpoints - 1);
        }

        // 接下来检查隐式零余额
        if (checkpoints[account][0].timestamp > timestamp) {
            return 0;
        }

        // 二分查找
        uint256 lower = 0;
        uint256 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint256 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
            Checkpoint memory cp = checkpoints[account][center];
            if (cp.timestamp == timestamp) {
                return center;
            } else if (cp.timestamp < timestamp) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return lower;
    }

    /// @dev 获取前一个供应索引
    function getPriorSupplyIndex(uint256 timestamp)
        public
        view
        returns (uint256)
    {
        uint256 nCheckpoints = supplyNumCheckpoints;
        if (nCheckpoints == 0) {
            return 0;
        }

        // First check most recent balance
        if (supplyCheckpoints[nCheckpoints - 1].timestamp <= timestamp) {
            return (nCheckpoints - 1);
        }

        // Next check implicit zero balance
        if (supplyCheckpoints[0].timestamp > timestamp) {
            return 0;
        }

        uint256 lower = 0;
        uint256 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint256 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
            SupplyCheckpoint memory cp = supplyCheckpoints[center];
            if (cp.timestamp == timestamp) {
                return center;
            } else if (cp.timestamp < timestamp) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return lower;
    }

    /// @dev 获取前一个每token奖励
    function getPriorRewardPerToken(address token, uint256 timestamp)
        public
        view
        returns (uint256, uint256)
    {
        uint256 nCheckpoints = rewardPerTokenNumCheckpoints[token];
        if (nCheckpoints == 0) {
            return (0, 0);
        }

        // First check most recent balance
        if (
            rewardPerTokenCheckpoints[token][nCheckpoints - 1].timestamp <=
            timestamp
        ) {
            return (
                rewardPerTokenCheckpoints[token][nCheckpoints - 1]
                    .rewardPerToken,
                rewardPerTokenCheckpoints[token][nCheckpoints - 1].timestamp
            );
        }

        // Next check implicit zero balance
        if (rewardPerTokenCheckpoints[token][0].timestamp > timestamp) {
            return (0, 0);
        }

        uint256 lower = 0;
        uint256 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint256 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
            RewardPerTokenCheckpoint memory cp = rewardPerTokenCheckpoints[
                token
            ][center];
            if (cp.timestamp == timestamp) {
                return (cp.rewardPerToken, cp.timestamp);
            } else if (cp.timestamp < timestamp) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return (
            rewardPerTokenCheckpoints[token][lower].rewardPerToken,
            rewardPerTokenCheckpoints[token][lower].timestamp
        );
    }

    /// @dev 写入检查点
    function _writeCheckpoint(address account, uint256 balance) internal {
        uint256 _timestamp = block.timestamp;
        // 用户检查点
        uint256 _nCheckPoints = numCheckpoints[account];

        // 如果用户检查点 > 0 && 最后一个检查点 == 当前时间戳
        if (
            _nCheckPoints > 0 &&
            checkpoints[account][_nCheckPoints - 1].timestamp == _timestamp
        ) {
            // 更新最后一个检查点余额
            checkpoints[account][_nCheckPoints - 1].balanceOf = balance;
        } else {
            // 否则写入检查点
            checkpoints[account][_nCheckPoints] = Checkpoint(
                _timestamp,
                balance
            );
            // 用户检查点数 + 1
            numCheckpoints[account] = _nCheckPoints + 1;
        }
    }

    /// @dev 写入每token奖励检查点
    function _writeRewardPerTokenCheckpoint(
        address token,
        uint256 reward,
        uint256 timestamp
    ) internal {
        uint256 _nCheckPoints = rewardPerTokenNumCheckpoints[token];

        if (
            _nCheckPoints > 0 &&
            rewardPerTokenCheckpoints[token][_nCheckPoints - 1].timestamp ==
            timestamp
        ) {
            rewardPerTokenCheckpoints[token][_nCheckPoints - 1]
                .rewardPerToken = reward;
        } else {
            rewardPerTokenCheckpoints[token][
                _nCheckPoints
            ] = RewardPerTokenCheckpoint(timestamp, reward);
            rewardPerTokenNumCheckpoints[token] = _nCheckPoints + 1;
        }
    }

    /// @dev 写入供应检查点
    function _writeSupplyCheckpoint() internal {
        // 总检查点数
        uint256 _nCheckPoints = supplyNumCheckpoints;
        uint256 _timestamp = block.timestamp;

        // 总检查点数 > 0 && 最后一个检查点 == 当前时间戳
        if (
            _nCheckPoints > 0 &&
            supplyCheckpoints[_nCheckPoints - 1].timestamp == _timestamp
        ) {
            // 检查点总量 = 衍生总量
            supplyCheckpoints[_nCheckPoints - 1].supply = derivedSupply;
        } else {
            // 否则插入新检查点
            supplyCheckpoints[_nCheckPoints] = SupplyCheckpoint(
                _timestamp,
                derivedSupply
            );
            // 总检查点数 + 1
            supplyNumCheckpoints = _nCheckPoints + 1;
        }
    }

    /// @dev 奖励数组长度
    function rewardsListLength() external view returns (uint256) {
        return rewards.length;
    }

    // 返回上次修改奖励的时间，如果奖励已经结束，则返回 periodFinish
    function lastTimeRewardApplicable(address token)
        public
        view
        returns (uint256)
    {
        return Math.min(block.timestamp, periodFinish[token]);
    }

    /// @dev 获取奖励, 获取自己的奖励或者通过voter合约
    function getReward(address account, address[] memory tokens) external lock {
        require(msg.sender == account || msg.sender == voter);
        _unlocked = 1;
        // 发送并通知奖励
        Voter(voter).distribute(address(this));
        _unlocked = 2;

        // 循环token数组长度
        for (uint256 i = 0; i < tokens.length; i++) {
            // 更新每token奖励
            (
                rewardPerTokenStored[tokens[i]],
                lastUpdateTime[tokens[i]]
            ) = _updateRewardPerToken(tokens[i]);
            // 计算奖励
            uint256 _reward = earned(tokens[i], account);
            // 更新最后领取时间戳
            lastEarn[tokens[i]][account] = block.timestamp;
            // 用户每token奖励存储 = 每token奖励存储
            userRewardPerTokenStored[tokens[i]][account] = rewardPerTokenStored[
                tokens[i]
            ];
            // 如果奖励>0 发送奖励
            if (_reward > 0) _safeTransfer(tokens[i], account, _reward);

            emit ClaimRewards(msg.sender, tokens[i], _reward);
        }

        // 衍生余额
        uint256 _derivedBalance = derivedBalances[account];
        // 衍生总量 -= 衍生余额
        derivedSupply -= _derivedBalance;
        // 更新衍生余额
        _derivedBalance = derivedBalance(account);
        derivedBalances[account] = _derivedBalance;
        // 更新衍生总量
        derivedSupply += _derivedBalance;

        // 写入检查点
        _writeCheckpoint(account, derivedBalances[account]);
        // 写入总量检查点
        _writeSupplyCheckpoint();
    }

    /// @dev 每token奖励
    function rewardPerToken(address token) public view returns (uint256) {
        // 如果衍生总量 = 0
        if (derivedSupply == 0) {
            // 返回每token奖励
            return rewardPerTokenStored[token];
        }
        // 返回 (每token奖励 + (上次修改奖励的时间 - 最小(上次更新时间, 结束时间)) * 奖励比率 * 10**18) / 衍生总量
        return
            rewardPerTokenStored[token] +
            (((lastTimeRewardApplicable(token) -
                Math.min(lastUpdateTime[token], periodFinish[token])) *
                rewardRate[token] *
                PRECISION) / derivedSupply);
    }

    /// @dev 账户的衍生余额
    function derivedBalance(address account) public view returns (uint256) {
        uint256 _tokenId = tokenIds[account];
        uint256 _balance = balanceOf[account];
        // 衍生 = 余额 * 40 / 100
        uint256 _derived = (_balance * 40) / 100;
        uint256 _adjusted = 0;
        // ve总量
        uint256 _supply = erc20(_ve).totalSupply();
        //  如果 tokenId属于账户, 总量>0
        if (account == ve(_ve).ownerOf(_tokenId) && _supply > 0) {
            // 调整 = tokenId的余额(根据时长计算的点数)
            _adjusted = ve(_ve).balanceOfNFT(_tokenId);
            // 调整 = (((当前存款总量 * 调整) / ve总量) * 60) / 100
            _adjusted = (((totalSupply * _adjusted) / _supply) * 60) / 100;
        }
        // 返回 最小((衍生 + 调整), 存款余额)
        return Math.min((_derived + _adjusted), _balance);
    }

    function batchRewardPerToken(address token, uint256 maxRuns) external {
        (
            rewardPerTokenStored[token],
            lastUpdateTime[token]
        ) = _batchRewardPerToken(token, maxRuns);
    }

    function _batchRewardPerToken(address token, uint256 maxRuns)
        internal
        returns (uint256, uint256)
    {
        uint256 _startTimestamp = lastUpdateTime[token];
        uint256 reward = rewardPerTokenStored[token];

        if (supplyNumCheckpoints == 0) {
            return (reward, _startTimestamp);
        }

        if (rewardRate[token] == 0) {
            return (reward, block.timestamp);
        }

        uint256 _startIndex = getPriorSupplyIndex(_startTimestamp);
        uint256 _endIndex = Math.min(supplyNumCheckpoints - 1, maxRuns);

        for (uint256 i = _startIndex; i < _endIndex; i++) {
            SupplyCheckpoint memory sp0 = supplyCheckpoints[i];
            if (sp0.supply > 0) {
                SupplyCheckpoint memory sp1 = supplyCheckpoints[i + 1];
                (uint256 _reward, uint256 _endTime) = _calcRewardPerToken(
                    token,
                    sp1.timestamp,
                    sp0.timestamp,
                    sp0.supply,
                    _startTimestamp
                );
                reward += _reward;
                _writeRewardPerTokenCheckpoint(token, reward, _endTime);
                _startTimestamp = _endTime;
            }
        }

        return (reward, _startTimestamp);
    }

    function _calcRewardPerToken(
        address token,
        uint256 timestamp1,
        uint256 timestamp0,
        uint256 supply,
        uint256 startTimestamp
    ) internal view returns (uint256, uint256) {
        uint256 endTime = Math.max(timestamp1, startTimestamp);
        return (
            (((Math.min(endTime, periodFinish[token]) -
                Math.min(
                    Math.max(timestamp0, startTimestamp),
                    periodFinish[token]
                )) *
                rewardRate[token] *
                PRECISION) / supply),
            endTime
        );
    }

    function _updateRewardPerToken(address token)
        internal
        returns (uint256, uint256)
    {
        uint256 _startTimestamp = lastUpdateTime[token];
        uint256 reward = rewardPerTokenStored[token];

        if (supplyNumCheckpoints == 0) {
            return (reward, _startTimestamp);
        }

        if (rewardRate[token] == 0) {
            return (reward, block.timestamp);
        }

        uint256 _startIndex = getPriorSupplyIndex(_startTimestamp);
        uint256 _endIndex = supplyNumCheckpoints - 1;

        if (_endIndex - _startIndex > 1) {
            for (uint256 i = _startIndex; i < _endIndex - 1; i++) {
                SupplyCheckpoint memory sp0 = supplyCheckpoints[i];
                if (sp0.supply > 0) {
                    SupplyCheckpoint memory sp1 = supplyCheckpoints[i + 1];
                    (uint256 _reward, uint256 _endTime) = _calcRewardPerToken(
                        token,
                        sp1.timestamp,
                        sp0.timestamp,
                        sp0.supply,
                        _startTimestamp
                    );
                    reward += _reward;
                    _writeRewardPerTokenCheckpoint(token, reward, _endTime);
                    _startTimestamp = _endTime;
                }
            }
        }

        SupplyCheckpoint memory sp = supplyCheckpoints[_endIndex];
        if (sp.supply > 0) {
            (uint256 _reward, ) = _calcRewardPerToken(
                token,
                lastTimeRewardApplicable(token),
                Math.max(sp.timestamp, _startTimestamp),
                sp.supply,
                _startTimestamp
            );
            reward += _reward;
            _writeRewardPerTokenCheckpoint(token, reward, block.timestamp);
            _startTimestamp = block.timestamp;
        }

        return (reward, _startTimestamp);
    }

    // 赚取的是一个估计值，在供应 > rewardPerToken 计算运行之前它不会是准确的
    function earned(address token, address account)
        public
        view
        returns (uint256)
    {
        // 开始时间 = 最大(最后领取时间,每token奖励检查点)
        uint256 _startTimestamp = Math.max(
            lastEarn[token][account],
            rewardPerTokenCheckpoints[token][0].timestamp
        );
        if (numCheckpoints[account] == 0) {
            return 0;
        }

        // 开始索引 = 前一个余额索引
        uint256 _startIndex = getPriorBalanceIndex(account, _startTimestamp);
        // 结束索引 = 账户上一个检查点
        uint256 _endIndex = numCheckpoints[account] - 1;

        uint256 reward = 0;

        // 结束索引 - 开始索引
        if (_endIndex - _startIndex > 1) {
            // 从开始索引到结束索引循环
            for (uint256 i = _startIndex; i < _endIndex - 1; i++) {
                // 当前检查点
                Checkpoint memory cp0 = checkpoints[account][i];
                // 下一个检查点
                Checkpoint memory cp1 = checkpoints[account][i + 1];
                // 每token奖励存储0 = 获得前一个每token奖励(当前检查点)
                (uint256 _rewardPerTokenStored0, ) = getPriorRewardPerToken(
                    token,
                    cp0.timestamp
                );
                // 每token奖励存储1 = 获得前一个每token奖励(下一个检查点)
                (uint256 _rewardPerTokenStored1, ) = getPriorRewardPerToken(
                    token,
                    cp1.timestamp
                );
                // 奖励 += 当前检查点.余额 * (每token奖励存储1 - 每token奖励存储0) / 10**18
                reward +=
                    (cp0.balanceOf *
                        (_rewardPerTokenStored1 - _rewardPerTokenStored0)) /
                    PRECISION;
            }
        }

        // 最终检查点
        Checkpoint memory cp = checkpoints[account][_endIndex];
        // 每token奖励存储 = 获得前一个每token奖励(当前时间戳)
        (uint256 _rewardPerTokenStored, ) = getPriorRewardPerToken(
            token,
            cp.timestamp
        );
        // 奖励 += 当前检查点.余额 * (每token奖励 - 最大(每token奖励存储,用户的每token奖励存储)) / 10**18
        reward +=
            (cp.balanceOf *
                (rewardPerToken(token) -
                    Math.max(
                        _rewardPerTokenStored,
                        userRewardPerTokenStored[token][account]
                    ))) /
            PRECISION;

        return reward;
    }

    function depositAll(uint256 tokenId) external {
        deposit(erc20(stake).balanceOf(msg.sender), tokenId);
    }

    /// @dev 为指定tokenId存入数量
    function deposit(uint256 amount, uint256 tokenId) public lock {
        require(amount > 0);

        // 发送stake到当前合约
        _safeTransferFrom(stake, msg.sender, address(this), amount);
        // 更新总量
        totalSupply += amount;
        // 更新余额
        balanceOf[msg.sender] += amount;

        // 如果制定tokenId
        if (tokenId > 0) {
            // 确认tokenId属于msg.sender
            require(ve(_ve).ownerOf(tokenId) == msg.sender);
            // 如果没有记录msg.sender的tokenId
            if (tokenIds[msg.sender] == 0) {
                // 更新tokenId
                tokenIds[msg.sender] = tokenId;
                // 将token附属到Gauge
                Voter(voter).attachTokenToGauge(tokenId, msg.sender);
            }
            // 确认 msg.sender的tokenId
            require(tokenIds[msg.sender] == tokenId);
        } else {
            // 否则tokenId = msg.sender的tokenId
            tokenId = tokenIds[msg.sender];
        }

        // 衍生余额
        uint256 _derivedBalance = derivedBalances[msg.sender];
        // 衍生总量 -= 衍生余额
        derivedSupply -= _derivedBalance;
        // 计算衍生余额
        _derivedBalance = derivedBalance(msg.sender);
        // 更新衍生余额
        derivedBalances[msg.sender] = _derivedBalance;
        // 衍生总量 += 衍生余额
        derivedSupply += _derivedBalance;

        // 写入检查点
        _writeCheckpoint(msg.sender, _derivedBalance);
        // 写入总量检查点
        _writeSupplyCheckpoint();

        // 触发事件
        Voter(voter).emitDeposit(tokenId, msg.sender, amount);
        emit Deposit(msg.sender, tokenId, amount);
    }

    function withdrawAll() external {
        withdraw(balanceOf[msg.sender]);
    }

    function withdraw(uint256 amount) public {
        uint256 tokenId = 0;
        if (amount == balanceOf[msg.sender]) {
            tokenId = tokenIds[msg.sender];
        }
        withdrawToken(amount, tokenId);
    }

    function withdrawToken(uint256 amount, uint256 tokenId) public lock {
        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;
        _safeTransfer(stake, msg.sender, amount);

        if (tokenId > 0) {
            require(tokenId == tokenIds[msg.sender]);
            tokenIds[msg.sender] = 0;
            Voter(voter).detachTokenFromGauge(tokenId, msg.sender);
        } else {
            tokenId = tokenIds[msg.sender];
        }

        uint256 _derivedBalance = derivedBalances[msg.sender];
        derivedSupply -= _derivedBalance;
        _derivedBalance = derivedBalance(msg.sender);
        derivedBalances[msg.sender] = _derivedBalance;
        derivedSupply += _derivedBalance;

        _writeCheckpoint(msg.sender, derivedBalances[msg.sender]);
        _writeSupplyCheckpoint();

        Voter(voter).emitWithdraw(tokenId, msg.sender, amount);
        emit Withdraw(msg.sender, tokenId, amount);
    }

    function left(address token) external view returns (uint256) {
        if (block.timestamp >= periodFinish[token]) return 0;
        uint256 _remaining = periodFinish[token] - block.timestamp;
        return _remaining * rewardRate[token];
    }

    /// @dev 通知奖励数量
    function notifyRewardAmount(address token, uint256 amount) external lock {
        require(token != stake);
        require(amount > 0);
        if (rewardRate[token] == 0)
            _writeRewardPerTokenCheckpoint(token, 0, block.timestamp);
        (
            rewardPerTokenStored[token],
            lastUpdateTime[token]
        ) = _updateRewardPerToken(token);
        _claimFees();

        if (block.timestamp >= periodFinish[token]) {
            _safeTransferFrom(token, msg.sender, address(this), amount);
            rewardRate[token] = amount / DURATION;
        } else {
            uint256 _remaining = periodFinish[token] - block.timestamp;
            uint256 _left = _remaining * rewardRate[token];
            require(amount > _left);
            _safeTransferFrom(token, msg.sender, address(this), amount);
            rewardRate[token] = (amount + _left) / DURATION;
        }
        require(rewardRate[token] > 0);
        uint256 balance = erc20(token).balanceOf(address(this));
        require(
            rewardRate[token] <= balance / DURATION,
            "Provided reward too high"
        );
        periodFinish[token] = block.timestamp + DURATION;
        if (!isReward[token]) {
            isReward[token] = true;
            rewards.push(token);
        }

        emit NotifyReward(msg.sender, token, amount);
    }

    function _safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal {
        require(token.code.length > 0);
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(erc20.transfer.selector, to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))));
    }

    function _safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        require(token.code.length > 0);
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(erc20.transferFrom.selector, from, to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))));
    }

    function _safeApprove(
        address token,
        address spender,
        uint256 value
    ) internal {
        require(token.code.length > 0);
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(erc20.approve.selector, spender, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))));
    }
}

// https://ftmscan.com/address/0x25d220723ED3D9C55fDb9CfDddF044b52639ccae
contract BaseV1GaugeFactory {
    address public last_gauge;

    function createGauge(
        address _pool,
        address _bribe,
        address _ve
    ) external returns (address) {
        last_gauge = address(new Gauge(_pool, _bribe, _ve, msg.sender));
        return last_gauge;
    }

    function createGaugeSingle(
        address _pool,
        address _bribe,
        address _ve,
        address _voter
    ) external returns (address) {
        last_gauge = address(new Gauge(_pool, _bribe, _ve, _voter));
        return last_gauge;
    }
}
