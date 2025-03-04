// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.11;

interface IVeDist {
    function checkpoint_token() external;

    function checkpoint_total_supply() external;
}
