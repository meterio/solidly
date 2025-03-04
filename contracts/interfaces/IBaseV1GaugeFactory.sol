// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IBaseV1GaugeFactory {
    function createGauge(
        address,
        address,
        address
    ) external returns (address);
}
