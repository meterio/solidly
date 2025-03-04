// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

interface solidly_pair {
    function metadata()
        external
        view
        returns (
            uint256 dec0,
            uint256 dec1,
            uint256 r0,
            uint256 r1,
            bool st,
            address t0,
            address t1
        );
}

interface solidly_router {
    function pairFor(
        address tokenA,
        address tokenB,
        bool stable
    ) external view returns (address pair);
}

contract SolidlyLibrary {
    solidly_router internal router;

    constructor(address _router) {
        router = solidly_router(_router);
    }

    function _f(uint256 x0, uint256 y) internal pure returns (uint256) {
        return
            (x0 * ((((y * y) / 1e18) * y) / 1e18)) /
            1e18 +
            (((((x0 * x0) / 1e18) * x0) / 1e18) * y) /
            1e18;
    }

    function _d(uint256 x0, uint256 y) internal pure returns (uint256) {
        return
            (3 * x0 * ((y * y) / 1e18)) /
            1e18 +
            ((((x0 * x0) / 1e18) * x0) / 1e18);
    }

    function _get_y(
        uint256 x0,
        uint256 xy,
        uint256 y
    ) internal pure returns (uint256) {
        for (uint256 i = 0; i < 255; i++) {
            uint256 y_prev = y;
            uint256 k = _f(x0, y);
            if (k < xy) {
                uint256 dy = ((xy - k) * 1e18) / _d(x0, y);
                y = y + dy;
            } else {
                uint256 dy = ((k - xy) * 1e18) / _d(x0, y);
                y = y - dy;
            }
            if (y > y_prev) {
                if (y - y_prev <= 1) {
                    return y;
                }
            } else {
                if (y_prev - y <= 1) {
                    return y;
                }
            }
        }
        return y;
    }

    function getTradeDiff(
        uint256 amountIn,
        address tokenIn,
        address tokenOut,
        bool stable
    ) external view returns (uint256 a, uint256 b) {
        (
            uint256 dec0,
            uint256 dec1,
            uint256 r0,
            uint256 r1,
            bool st,
            address t0,

        ) = solidly_pair(router.pairFor(tokenIn, tokenOut, stable)).metadata();
        uint256 sample = tokenIn == t0 ? (r0 * dec1) / r1 : (r1 * dec0) / r0;
        a =
            (_getAmountOut(sample, tokenIn, r0, r1, t0, dec0, dec1, st) *
                1e18) /
            sample;
        b =
            (_getAmountOut(amountIn, tokenIn, r0, r1, t0, dec0, dec1, st) *
                1e18) /
            amountIn;
    }

    function getTradeDiff(
        uint256 amountIn,
        address tokenIn,
        address pair
    ) external view returns (uint256 a, uint256 b) {
        (
            uint256 dec0,
            uint256 dec1,
            uint256 r0,
            uint256 r1,
            bool st,
            address t0,

        ) = solidly_pair(pair).metadata();
        uint256 sample = tokenIn == t0 ? (r0 * dec1) / r1 : (r1 * dec0) / r0;
        a =
            (_getAmountOut(sample, tokenIn, r0, r1, t0, dec0, dec1, st) *
                1e18) /
            sample;
        b =
            (_getAmountOut(amountIn, tokenIn, r0, r1, t0, dec0, dec1, st) *
                1e18) /
            amountIn;
    }

    function getSample(
        address tokenIn,
        address tokenOut,
        bool stable
    ) external view returns (uint256) {
        (
            uint256 dec0,
            uint256 dec1,
            uint256 r0,
            uint256 r1,
            bool st,
            address t0,

        ) = solidly_pair(router.pairFor(tokenIn, tokenOut, stable)).metadata();
        uint256 sample = tokenIn == t0 ? (r0 * dec1) / r1 : (r1 * dec0) / r0;
        return
            (_getAmountOut(sample, tokenIn, r0, r1, t0, dec0, dec1, st) *
                1e18) / sample;
    }

    function getMinimumValue(
        address tokenIn,
        address tokenOut,
        bool stable
    )
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        (
            uint256 dec0,
            uint256 dec1,
            uint256 r0,
            uint256 r1,
            ,
            address t0,

        ) = solidly_pair(router.pairFor(tokenIn, tokenOut, stable)).metadata();
        uint256 sample = tokenIn == t0 ? (r0 * dec1) / r1 : (r1 * dec0) / r0;
        return (sample, r0, r1);
    }

    function getAmountOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut,
        bool stable
    ) external view returns (uint256) {
        (
            uint256 dec0,
            uint256 dec1,
            uint256 r0,
            uint256 r1,
            bool st,
            address t0,

        ) = solidly_pair(router.pairFor(tokenIn, tokenOut, stable)).metadata();
        return
            (_getAmountOut(amountIn, tokenIn, r0, r1, t0, dec0, dec1, st) *
                1e18) / amountIn;
    }

    function _getAmountOut(
        uint256 amountIn,
        address tokenIn,
        uint256 _reserve0,
        uint256 _reserve1,
        address token0,
        uint256 decimals0,
        uint256 decimals1,
        bool stable
    ) internal pure returns (uint256) {
        if (stable) {
            uint256 xy = _k(_reserve0, _reserve1, stable, decimals0, decimals1);
            _reserve0 = (_reserve0 * 1e18) / decimals0;
            _reserve1 = (_reserve1 * 1e18) / decimals1;
            (uint256 reserveA, uint256 reserveB) = tokenIn == token0
                ? (_reserve0, _reserve1)
                : (_reserve1, _reserve0);
            amountIn = tokenIn == token0
                ? (amountIn * 1e18) / decimals0
                : (amountIn * 1e18) / decimals1;
            uint256 y = reserveB - _get_y(amountIn + reserveA, xy, reserveB);
            return (y * (tokenIn == token0 ? decimals1 : decimals0)) / 1e18;
        } else {
            (uint256 reserveA, uint256 reserveB) = tokenIn == token0
                ? (_reserve0, _reserve1)
                : (_reserve1, _reserve0);
            return (amountIn * reserveB) / (reserveA + amountIn);
        }
    }

    function _k(
        uint256 x,
        uint256 y,
        bool stable,
        uint256 decimals0,
        uint256 decimals1
    ) internal pure returns (uint256) {
        if (stable) {
            uint256 _x = (x * 1e18) / decimals0;
            uint256 _y = (y * 1e18) / decimals1;
            uint256 _a = (_x * _y) / 1e18;
            uint256 _b = ((_x * _x) / 1e18 + (_y * _y) / 1e18);
            return (_a * _b) / 1e18; // x3y+y3x >= k
        } else {
            return x * y; // xy >= k
        }
    }
}
