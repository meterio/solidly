// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

library Math {
    function min(uint a, uint b) internal pure returns (uint) {
        return a < b ? a : b;
    }
}

interface erc20 {
    function totalSupply() external view returns (uint256);
    function transfer(address recipient, uint amount) external returns (bool);
    function balanceOf(address) external view returns (uint);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
}

interface ve {
    function token() external view returns (address);
    function balanceOfNFT(uint) external view returns (uint);
    function isApprovedOrOwner(address, uint) external view returns (bool);
    function ownerOf(uint) external view returns (address);
    function transferFrom(address, address, uint) external;
    function attach(uint tokenId) external;
    function detach(uint tokenId) external;
    function voting(uint tokenId) external;
    function abstain(uint tokenId) external;
}

interface IBaseV1Factory {
    function isPair(address) external view returns (bool);
}

interface IBaseV1Core {
    function claimFees() external returns (uint, uint);
    function tokens() external returns (address, address);
}

interface IBaseV1GaugeFactory {
    function createGauge(address, address, address) external returns (address);
}

interface IBaseV1BribeFactory {
    function createBribe() external returns (address);
}

interface IGauge {
    function notifyRewardAmount(address token, uint amount) external;
    function getReward(address account, address[] memory tokens) external;
    function claimFees() external returns (uint claimed0, uint claimed1);
    function left(address token) external view returns (uint);
}

interface IBribe {
    function _deposit(uint amount, uint tokenId) external;
    function _withdraw(uint amount, uint tokenId) external;
    function getRewardForOwner(uint tokenId, address[] memory tokens) external;
}

interface IMinter {
    function update_period() external returns (uint);
}

// https://ftmscan.com/address/0xdC819F5d05a6859D2faCbB4A44E5aB105762dbaE#code
contract BaseV1Voter {

    address public immutable _ve; // the ve token that governs these contracts
    address public immutable factory; // the BaseV1Factory
    address internal immutable base;
    address public immutable gaugefactory;
    address public immutable bribefactory;
    uint internal constant DURATION = 7 days; // rewards are released over 7 days
    address public minter;

    uint public totalWeight; // total voting weight

    address[] public pools; // all pools viable for incentives
    mapping(address => address) public gauges; // pool => gauge
    mapping(address => address) public poolForGauge; // gauge => pool
    mapping(address => address) public bribes; // gauge => bribe
    mapping(address => int256) public weights; // pool => weight
    mapping(uint => mapping(address => int256)) public votes; // nft => pool => votes
    mapping(uint => address[]) public poolVote; // nft => pools
    mapping(uint => uint) public usedWeights;  // nft => total voting weight of user
    mapping(address => bool) public isGauge;
    mapping(address => bool) public isWhitelisted;

    event GaugeCreated(address indexed gauge, address creator, address indexed bribe, address indexed pool);
    event Voted(address indexed voter, uint tokenId, int256 weight);
    event Abstained(uint tokenId, int256 weight);
    event Deposit(address indexed lp, address indexed gauge, uint tokenId, uint amount);
    event Withdraw(address indexed lp, address indexed gauge, uint tokenId, uint amount);
    event NotifyReward(address indexed sender, address indexed reward, uint amount);
    event DistributeReward(address indexed sender, address indexed gauge, uint amount);
    event Attach(address indexed owner, address indexed gauge, uint tokenId);
    event Detach(address indexed owner, address indexed gauge, uint tokenId);
    event Whitelisted(address indexed whitelister, address indexed token);

    // https://ftmscan.com/address/0xdC819F5d05a6859D2faCbB4A44E5aB105762dbaE#code
    constructor(address __ve, address _factory, address  _gauges, address _bribes) {
        _ve = __ve; // https://ftmscan.com/address/0xcbd8fea77c2452255f59743f55a3ea9d83b3c72b
        factory = _factory; // https://ftmscan.com/address/0x3faab499b519fdc5819e3d7ed0c26111904cbc28
        base = ve(__ve).token(); // Solidly (SOLID) https://ftmscan.com/address/0x888ef71766ca594ded1f0fa3ae64ed2941740a20
        gaugefactory = _gauges; // https://ftmscan.com/address/0x25d220723ed3d9c55fdb9cfdddf044b52639ccae
        bribefactory = _bribes; // https://ftmscan.com/address/0xd0333a1a1abfd68b362c5aa71b95392745381379
        minter = msg.sender; // https://ftmscan.com/address/0xc4209c19b183e72a037b2d1fb11fbe522054a90d
    }

    // simple re-entrancy check
    uint internal _unlocked = 1;
    modifier lock() {
        require(_unlocked == 1);
        _unlocked = 2;
        _;
        _unlocked = 1;
    }

    // 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83 Fantom Finance: Wrapped Fantom Token
    // 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75 Centre: USD Coin 
    // 0x321162Cd933E2Be498Cd2267a90534A804051b11 Wrapped BTC Token
    // 0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E Maker: Dai Stablecoin
    // 0x82f0B8B456c1A451378467398982d4834b6829c1 MIM Abracadabra.money: MIM Token
    // 0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355 Frax Finance: FRAX Token
    // 0x1E4F97b9f9F913c46F1632781732927B9019C68b Curve.fi: CRV Token
    // 0x29b0Da86e484E1C0029B56e817912d778aC0EC69 Yearn Finance: YFI Token
    // 0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC SushiSwap: SUSHI Token
    // 0x7d016eec9c25232b01F23EF992D98ca97fc2AF5a Frax Finance: FXS Token
    // 0x468003B688943977e6130F4F68F23aad939a1040 Abracadabra.Money: Spell Token
    // 0xE55e19Fb4F2D85af758950957714292DAC1e25B2 Synapse: SYN Token
    // 0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37 Tomb Finance: TSHARE Token
    // 0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7 Tomb Finance: TOMB Token
    // 0x2A5062D22adCFaAfbd5C541d4dA82E4B450d4212 Keep3r: KP3R Token
    // 0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE SpookySwap: BOO Token
    // 0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0 Hector DAO: HEC Token
    // 0xaD996A45fd2373ed0B10Efa4A8eCB9de445A4302 Alpaca Finance: ALPACA Token
    // 0xd8321AA83Fb0a4ECd6348D4577431310A6E0814d Geist Finance: GEIST Token 
    // 0x5Cc61A78F164885776AA610fb0FE1257df78E59B SpiritSwap: SPIRIT Token
    // 0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9 Liquid Driver: LQDR Token 
    // 0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475 Scream.sh: SCREAM Token
    // 0x85dec8c4B2680793661bCA91a8F129607571863d PaintSwap Finance: BRUSH Token
    // 0x74b23882a30290451A17c44f4F05243b6b58C76d Wrapped Ether 
    // 0xf16e81dce15B08F326220742020379B855B87DF9 Popsicle Finance: ICE token
    // 0x9879aBDea01a879644185341F7aF7d8343556B7a TrueUSD: TUSD Token
    // 0x00a35FD824c717879BF370E70AC6868b95870Dfb Iron Bank: Iron Bank token
    // 0xC5e2B037D30a390e62180970B3aa4E91868764cD Tarot: TAROT Token
    // 0x10010078a54396F62c96dF8532dc2B4847d47ED3 Hundred Finance: HND Token

    // minter https://ftmscan.com/address/0xC4209c19b183e72A037b2D1Fb11fbe522054A90D
    function initialize(address[] memory _tokens, address _minter) external {
        require(msg.sender == minter);
        for (uint i = 0; i < _tokens.length; i++) {
            _whitelist(_tokens[i]);
        }
        minter = _minter;
    }

    function listing_fee() public view returns (uint) {
        return (erc20(base).totalSupply() - erc20(_ve).totalSupply()) / 200;
    }

    function reset(uint _tokenId) external {
        require(ve(_ve).isApprovedOrOwner(msg.sender, _tokenId));
        _reset(_tokenId);
        ve(_ve).abstain(_tokenId);
    }

    function _reset(uint _tokenId) internal {
        address[] storage _poolVote = poolVote[_tokenId];
        uint _poolVoteCnt = _poolVote.length;
        int256 _totalWeight = 0;

        for (uint i = 0; i < _poolVoteCnt; i ++) {
            address _pool = _poolVote[i];
            int256 _votes = votes[_tokenId][_pool];

            if (_votes != 0) {
                _updateFor(gauges[_pool]);
                weights[_pool] -= _votes;
                votes[_tokenId][_pool] -= _votes;
                if (_votes > 0) {
                    IBribe(bribes[gauges[_pool]])._withdraw(uint256(_votes), _tokenId);
                    _totalWeight += _votes;
                } else {
                    _totalWeight -= _votes;
                }
                emit Abstained(_tokenId, _votes);
            }
        }
        totalWeight -= uint256(_totalWeight);
        usedWeights[_tokenId] = 0;
        delete poolVote[_tokenId];
    }

    function poke(uint _tokenId) external {
        address[] memory _poolVote = poolVote[_tokenId];
        uint _poolCnt = _poolVote.length;
        int256[] memory _weights = new int256[](_poolCnt);

        for (uint i = 0; i < _poolCnt; i ++) {
            _weights[i] = votes[_tokenId][_poolVote[i]];
        }

        _vote(_tokenId, _poolVote, _weights);
    }

    function _vote(uint _tokenId, address[] memory _poolVote, int256[] memory _weights) internal {
        _reset(_tokenId);
        uint _poolCnt = _poolVote.length;
        int256 _weight = int256(ve(_ve).balanceOfNFT(_tokenId));
        int256 _totalVoteWeight = 0;
        int256 _totalWeight = 0;
        int256 _usedWeight = 0;

        for (uint i = 0; i < _poolCnt; i++) {
            _totalVoteWeight += _weights[i] > 0 ? _weights[i] : -_weights[i];
        }

        for (uint i = 0; i < _poolCnt; i++) {
            address _pool = _poolVote[i];
            address _gauge = gauges[_pool];

            if (isGauge[_gauge]) {
                int256 _poolWeight = _weights[i] * _weight / _totalVoteWeight;
                require(votes[_tokenId][_pool] == 0);
                require(_poolWeight != 0);
                _updateFor(_gauge);

                poolVote[_tokenId].push(_pool);

                weights[_pool] += _poolWeight;
                votes[_tokenId][_pool] += _poolWeight;
                if (_poolWeight > 0) {
                    IBribe(bribes[_gauge])._deposit(uint256(_poolWeight), _tokenId);
                } else {
                    _poolWeight = -_poolWeight;
                }
                _usedWeight += _poolWeight;
                _totalWeight += _poolWeight;
                emit Voted(msg.sender, _tokenId, _poolWeight);
            }
        }
        if (_usedWeight > 0) ve(_ve).voting(_tokenId);
        totalWeight += uint256(_totalWeight);
        usedWeights[_tokenId] = uint256(_usedWeight);
    }

    function vote(uint tokenId, address[] calldata _poolVote, int256[] calldata _weights) external {
        require(ve(_ve).isApprovedOrOwner(msg.sender, tokenId));
        require(_poolVote.length == _weights.length);
        _vote(tokenId, _poolVote, _weights);
    }

    function whitelist(address _token, uint _tokenId) public {
        if (_tokenId > 0) {
            require(msg.sender == ve(_ve).ownerOf(_tokenId));
            require(ve(_ve).balanceOfNFT(_tokenId) > listing_fee());
        } else {
            _safeTransferFrom(base, msg.sender, minter, listing_fee());
        }

        _whitelist(_token);
    }

    function _whitelist(address _token) internal {
        require(!isWhitelisted[_token]);
        isWhitelisted[_token] = true;
        emit Whitelisted(msg.sender, _token);
    }

    function createGauge(address _pool) external returns (address) {
        require(gauges[_pool] == address(0x0), "exists");
        require(IBaseV1Factory(factory).isPair(_pool), "!_pool");
        (address tokenA, address tokenB) = IBaseV1Core(_pool).tokens();
        require(isWhitelisted[tokenA] && isWhitelisted[tokenB], "!whitelisted");
        address _bribe = IBaseV1BribeFactory(bribefactory).createBribe();
        address _gauge = IBaseV1GaugeFactory(gaugefactory).createGauge(_pool, _bribe, _ve);
        erc20(base).approve(_gauge, type(uint).max);
        bribes[_gauge] = _bribe;
        gauges[_pool] = _gauge;
        poolForGauge[_gauge] = _pool;
        isGauge[_gauge] = true;
        _updateFor(_gauge);
        pools.push(_pool);
        emit GaugeCreated(_gauge, msg.sender, _bribe, _pool);
        return _gauge;
    }

    /// @dev 将token附属到Gauge
    function attachTokenToGauge(uint tokenId, address account) external {
        // 调用者为Gauge
        require(isGauge[msg.sender]);
        // tokenId > 0 
        if (tokenId > 0) ve(_ve).attach(tokenId);
        emit Attach(account, msg.sender, tokenId);
    }

    function emitDeposit(uint tokenId, address account, uint amount) external {
        require(isGauge[msg.sender]);
        emit Deposit(account, msg.sender, tokenId, amount);
    }

    function detachTokenFromGauge(uint tokenId, address account) external {
        require(isGauge[msg.sender]);
        if (tokenId > 0) ve(_ve).detach(tokenId);
        emit Detach(account, msg.sender, tokenId);
    }

    function emitWithdraw(uint tokenId, address account, uint amount) external {
        require(isGauge[msg.sender]);
        emit Withdraw(account, msg.sender, tokenId, amount);
    }

    function length() external view returns (uint) {
        return pools.length;
    }

    uint internal index;
    mapping(address => uint) internal supplyIndex;
    mapping(address => uint) public claimable;

    function notifyRewardAmount(uint amount) external {
        _safeTransferFrom(base, msg.sender, address(this), amount); // transfer the distro in
        uint256 _ratio = amount * 1e18 / totalWeight; // 1e18 adjustment is removed during claim
        if (_ratio > 0) {
            index += _ratio;
        }
        emit NotifyReward(msg.sender, base, amount);
    }

    function updateFor(address[] memory _gauges) external {
        for (uint i = 0; i < _gauges.length; i++) {
            _updateFor(_gauges[i]);
        }
    }

    function updateForRange(uint start, uint end) public {
        for (uint i = start; i < end; i++) {
            _updateFor(gauges[pools[i]]);
        }
    }

    function updateAll() external {
        updateForRange(0, pools.length);
    }

    function updateGauge(address _gauge) external {
        _updateFor(_gauge);
    }

    function _updateFor(address _gauge) internal {
        address _pool = poolForGauge[_gauge];
        int256 _supplied = weights[_pool];
        if (_supplied > 0) {
            uint _supplyIndex = supplyIndex[_gauge];
            uint _index = index; // get global index0 for accumulated distro
            supplyIndex[_gauge] = _index; // update _gauge current position to global position
            uint _delta = _index - _supplyIndex; // see if there is any difference that need to be accrued
            if (_delta > 0) {
                uint _share = uint(_supplied) * _delta / 1e18; // add accrued difference for each supplied token
                claimable[_gauge] += _share;
            }
        } else {
            supplyIndex[_gauge] = index; // new users are set to the default global state
        }
    }

    function claimRewards(address[] memory _gauges, address[][] memory _tokens) external {
        for (uint i = 0; i < _gauges.length; i++) {
            IGauge(_gauges[i]).getReward(msg.sender, _tokens[i]);
        }
    }

    function claimBribes(address[] memory _bribes, address[][] memory _tokens, uint _tokenId) external {
        require(ve(_ve).isApprovedOrOwner(msg.sender, _tokenId));
        for (uint i = 0; i < _bribes.length; i++) {
            IBribe(_bribes[i]).getRewardForOwner(_tokenId, _tokens[i]);
        }
    }

    function claimFees(address[] memory _fees, address[][] memory _tokens, uint _tokenId) external {
        require(ve(_ve).isApprovedOrOwner(msg.sender, _tokenId));
        for (uint i = 0; i < _fees.length; i++) {
            IBribe(_fees[i]).getRewardForOwner(_tokenId, _tokens[i]);
        }
    }

    function distributeFees(address[] memory _gauges) external {
        for (uint i = 0; i < _gauges.length; i++) {
            IGauge(_gauges[i]).claimFees();
        }
    }

    function distribute(address _gauge) public lock {
        IMinter(minter).update_period();
        _updateFor(_gauge);
        uint _claimable = claimable[_gauge];
        if (_claimable > IGauge(_gauge).left(base) && _claimable / DURATION > 0) {
            claimable[_gauge] = 0;
            IGauge(_gauge).notifyRewardAmount(base, _claimable);
            emit DistributeReward(msg.sender, _gauge, _claimable);
        }
    }

    function distro() external {
        distribute(0, pools.length);
    }

    function distribute() external {
        distribute(0, pools.length);
    }

    function distribute(uint start, uint finish) public {
        for (uint x = start; x < finish; x++) {
            distribute(gauges[pools[x]]);
        }
    }

    function distribute(address[] memory _gauges) external {
        for (uint x = 0; x < _gauges.length; x++) {
            distribute(_gauges[x]);
        }
    }

    function _safeTransferFrom(address token, address from, address to, uint256 value) internal {
        require(token.code.length > 0);
        (bool success, bytes memory data) =
        token.call(abi.encodeWithSelector(erc20.transferFrom.selector, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))));
    }
}
