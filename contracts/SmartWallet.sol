// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Unauthorized();
error NotEnoughToken(address user, address token, uint256 amount);
error NotEnoughETH(address user, uint256 amount);

contract SmartWallet is Ownable {
    //Declare an Event
    event DepositToken(
        address indexed from,
        address indexed token,
        uint256 amount
    );
    event DepositETH(address indexed from, uint256 amount);
    event WithdrawToken(
        address indexed to,
        address indexed token,
        uint256 amount
    );
    event WithdrawETH(address indexed to, uint256 amount);

    mapping(address => bool) public authorizedAddress;
    mapping(address => mapping(address => uint256)) public userTokenBalances;
    mapping(address => uint256) public userETHBalances;

    constructor() {
        //set owner as authorized address
        authorizedAddress[msg.sender] = true;
    }

    modifier onlyAuthorized() {
        if (authorizedAddress[msg.sender] != true) {
            revert Unauthorized();
        }
        _;
    }

    function addAuthorizedAddress(address addr) public onlyOwner {
        authorizedAddress[addr] = true;
    }

    function removeAuthorizedAddress(address addr) public onlyOwner {
        delete authorizedAddress[addr];
    }

    //deposit token from user
    function depositToken(
        address token,
        uint256 amount
    ) external onlyAuthorized {
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        userTokenBalances[msg.sender][token] =
            userTokenBalances[msg.sender][token] +
            amount;
        emit DepositToken(msg.sender, token, amount);
    }

    // withdraw token to user
    function withdrawToken(
        address token,
        uint256 amount
    ) external onlyAuthorized {
        if (getUserTokenBalance(msg.sender, token) < amount) {
            revert NotEnoughToken(msg.sender, token, amount);
        }

        userTokenBalances[msg.sender][token] =
            userTokenBalances[msg.sender][token] -
            amount;

        IERC20(token).transfer(msg.sender, amount);
        emit WithdrawToken(msg.sender, token, amount);
    }

    // get ERC20 balance
    function getUserTokenBalance(
        address user,
        address token
    ) public view returns (uint256) {
        return userTokenBalances[user][token];
    }

    function getTokenBalance(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function getETHBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUserETHBalance(address user) public view returns (uint256) {
        return userETHBalances[user];
    }

    function withdrawETH(
        address payable user,
        uint256 amount
    ) external onlyAuthorized {
        if (userETHBalances[user] < amount) {
            revert NotEnoughETH(user, amount);
        }
        userETHBalances[user] = userETHBalances[user] - amount;

        (bool sent, ) = user.call{value: amount}("");
        require(sent, "Failed to send Ether");

        emit WithdrawETH(msg.sender, amount);
    }

    receive() external payable onlyAuthorized {
        userETHBalances[msg.sender] = userETHBalances[msg.sender] + msg.value;
        emit DepositETH(msg.sender, msg.value);
    }
}
