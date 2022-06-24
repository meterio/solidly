// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.11;

library Math {
    function max(uint a, uint b) internal pure returns (uint) {
        return a >= b ? a : b;
    }
}

interface ve {
    function token() external view returns (address);
    function totalSupply() external view returns (uint);
    function create_lock_for(uint, uint, address) external returns (uint);
    function transferFrom(address, address, uint) external;
}

interface underlying {
    function approve(address spender, uint value) external returns (bool);
    function mint(address, uint) external;
    function totalSupply() external view returns (uint);
    function balanceOf(address) external view returns (uint);
    function transfer(address, uint) external returns (bool);
}

interface voter {
    function notifyRewardAmount(uint amount) external;
}

interface ve_dist {
    function checkpoint_token() external;
    function checkpoint_total_supply() external;
}

//根据 ve(3,3) 对铸币规则进行编码，从代币中抽象出来以支持任何允许铸币的代币
contract BaseV1Minter {

    uint internal constant week = 86400 * 7; // allows minting once per week (reset every Thursday 00:00 UTC)
    uint internal constant emission = 98;
    uint internal constant tail_emission = 2;
    uint internal constant target_base = 100; // 2% per week target emission
    uint internal constant tail_base = 1000; // 0.2% per week target emission
    underlying public immutable _token;
    voter public immutable _voter;
    ve public immutable _ve;
    ve_dist public immutable _ve_dist;
    uint public weekly = 20000000e18;
    uint public active_period;
    uint internal constant lock = 86400 * 7 * 52 * 4;

    address internal initializer;

    event Mint(address indexed sender, uint weekly, uint circulating_supply, uint circulating_emission);

    // https://ftmscan.com/address/0xc4209c19b183e72a037b2d1fb11fbe522054a90d
    constructor(
        address __voter, // https://ftmscan.com/address/0xdc819f5d05a6859d2facbb4a44e5ab105762dbae
        address  __ve, // https://ftmscan.com/address/0xcbd8fea77c2452255f59743f55a3ea9d83b3c72b
        address __ve_dist // https://ftmscan.com/address/0xa5cefac8966452a78d6692837b2ba83d19b57d07
    ) {
        initializer = msg.sender;
        _token = underlying(ve(__ve).token());
        _voter = voter(__voter);
        _ve = ve(__ve);
        _ve_dist = ve_dist(__ve_dist);
        active_period = (block.timestamp + (2*week)) / week * week;
    }

    // 0x5bDacBaE440A2F30af96147DE964CC97FE283305
    // 0xa96D2F0978E317e7a97aDFf7b5A76F4600916021
    // 0x95478C4F7D22D1048F46100001c2C69D2BA57380
    // 0xC0E2830724C946a6748dDFE09753613cd38f6767
    // 0x3293cB515Dbc8E0A8Ab83f1E5F5f3CC2F6bbc7ba
    // 0xffFfBBB50c131E664Ef375421094995C59808c97
    // 0x02517411F32ac2481753aD3045cA19D58e448A01
    // 0xF332789FAe0d1D6f058bfB040b3c060d76d06574
    // 0xdFf234670038dEfB2115Cf103F86dA5fB7CfD2D2
    // 0x0f2A144d711E7390d72BD474653170B201D504C8
    // 0x224002428cF0BA45590e0022DF4b06653058F22F
    // 0x26D70e4871EF565ef8C428e8782F1890B9255367
    // 0xA5fC0BbfcD05827ed582869b7254b6f141BA84Eb
    // 0x4D5362dd18Ea4Ba880c829B0152B7Ba371741E59
    // 0x1e26D95599797f1cD24577ea91D99a9c97cf9C09
    // 0xb4ad8B57Bd6963912c80FCbb6Baea99988543c1c
    // 0xF9E7d4c6d36ca311566f46c81E572102A2DC9F52
    // 0xE838c61635dd1D41952c68E47159329443283d90
    // 0x111731A388743a75CF60CCA7b140C58e41D83635
    // 0x0EDfcc1b8D082Cd46d13Db694b849D7d8151C6D5
    // 0xD0Bb8e4E4Dd5FDCD5D54f78263F5Ec8f33da4C95
    // 0x9685c79e7572faF11220d0F3a1C1ffF8B74fDc65
    // 0xa70b1d5956DAb595E47a1Be7dE8FaA504851D3c5
    // 0x06917EFCE692CAD37A77a50B9BEEF6f4Cdd36422
    // 0x5b0390bccCa1F040d8993eB6e4ce8DeD93721765
    function initialize(
        address[] memory claimants, // [0x19761C8725Bf4CC3Dcee58e51A7Eb12dD4d895c6]
        uint[] memory amounts, // [800000000000000000000000,2376588000000000000000000,1331994000000000000000000,1118072000000000000000000,1070472000000000000000000,1023840000000000000000000,864361000000000000000000,812928000000000000000000,795726000000000000000000,763362000000000000000000,727329000000000000000000,688233000000000000000000,681101000000000000000000,677507000000000000000000,676304000000000000000000,642992000000000000000000,609195000000000000000000,598412000000000000000000,591573000000000000000000,587431000000000000000000,542785000000000000000000,536754000000000000000000,518240000000000000000000,511920000000000000000000,452870000000000000000000]
        uint max // sum amounts / 100,000,000.000000000000000000 max = % ownership of top protocols, so if initial 20m is distributed, and target is 25% protocol ownership, then max - 4 x 20m = 80m
    ) external {
        require(initializer == msg.sender);
        _token.mint(address(this), max);
        _token.approve(address(_ve), type(uint).max);
        for (uint i = 0; i < claimants.length; i++) {
            _ve.create_lock_for(amounts[i], lock, claimants[i]);
        }
        initializer = address(0);
        active_period = (block.timestamp + week) / week * week;
    }

    // 将循环供应计算为总代币供应 - 锁定供应
    // 40,243,496.472853318526107032
    function circulating_supply() public view returns (uint) {
        // 循环供应量 = token总量 - token质押在ve的总量
        return _token.totalSupply() - _ve.totalSupply();
    }

    // 释放量计算是通过循环/总供应量调整的铸币厂可用供应量的 2%
    // 31,746.107982601868862051
    function calculate_emission() public view returns (uint) {
        // 释放量 = 20,000,000e18 * 循环供应量 * 98 / 100 / token总量
        return weekly * emission * circulating_supply() / target_base / _token.totalSupply();
    }

    // 每周释放量取计算（又名目标）释放量与循环尾端释放量的最大值
    // 80,486.992945706637052214
    function weekly_emission() public view returns (uint) {
        // 最大值(释放量,循环释放量)
        return Math.max(calculate_emission(), circulating_emission());
    }

    // 计算尾端（无限）排放量占总供应量的 0.2%
    // 80,486.992945706637052214
    function circulating_emission() public view returns (uint) {
        // 循环释放量 = 循环供应量 * 2 / 1000
        return circulating_supply() * tail_emission / tail_base;
    }

    // 计算通货膨胀并相应调整 ve 余额
    function calculate_growth(uint _minted) public view returns (uint) {
        // ve总量 * 每周释放量 / token总量
        return _ve.totalSupply() * _minted / _token.totalSupply();
    }

    // 更新周期每个周期（1周）只能调用一次
    function update_period() external returns (uint) {
        uint _period = active_period;
        // 如果 时间戳 >= 周期开始时间 + 7天 并且 已经初始化
        if (block.timestamp >= _period + week && initializer == address(0)) { // 仅在新周触发
            // 周期 = 按照7天取整
            _period = block.timestamp / week * week;
            // 重新赋值周期开始时间
            active_period = _period;
            // 每周释放量 80,494.963351905958472750
            weekly = weekly_emission();
            // 通货膨胀 48,100.451790362871970836
            uint _growth = calculate_growth(weekly);
            // 需求 = 通胀 + 每周释放量 
            uint _required = _growth + weekly;
            // 当前余额 28,288,733.555080511710863318
            uint _balanceOf = _token.balanceOf(address(this));
            // 如果余额不足
            if (_balanceOf < _required) {
                // 铸造 需求量 - 余额
                _token.mint(address(this), _required-_balanceOf);
            }

            // 将通胀发送到ve_dist
            require(_token.transfer(address(_ve_dist), _growth));
            _ve_dist.checkpoint_token(); // 刚刚在 ve_dist 中铸造的检查点令牌余额
            _ve_dist.checkpoint_total_supply(); // 检查点供应

            // 批准每周供应量
            _token.approve(address(_voter), weekly);
            // 向voter通知奖励
            _voter.notifyRewardAmount(weekly);

            // 触发事件
            emit Mint(msg.sender, weekly, circulating_supply(), circulating_emission());
        }
        return _period;
    }

}
