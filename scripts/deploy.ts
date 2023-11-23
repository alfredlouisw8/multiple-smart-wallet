import { ethers } from "hardhat";

async function main() {
	const [owner, wallet2] = await ethers.getSigners();
	console.log("Owner: " + owner.address + " \nWallet2: " + wallet2.address);
	console.log();

	const ACFactory = await ethers.getContractFactory("AC", owner);
	const AC = await ACFactory.deploy();
	const ACTokenAddress = await AC.getAddress();
	console.log("AC Token Address: ", ACTokenAddress);

	const WalletFactory = await ethers.getContractFactory("SmartWallet", owner);
	const Wallet = await WalletFactory.deploy();
	const WalletAddress = await Wallet.getAddress();
	console.log("Wallet Address: ", WalletAddress);

	await AC.connect(owner).mint(owner.address, ethers.parseEther("1000"));
	await AC.connect(wallet2).mint(wallet2.address, ethers.parseEther("500"));

	console.log(
		"Owner's AC Token Balance: ",
		ethers.formatEther(await AC.balanceOf(owner.address))
	);
	console.log(
		"Wallet2's AC Token Balance: ",
		ethers.formatEther(await AC.balanceOf(wallet2.address))
	);

	console.log("add wallet2 as authorized address");
	await Wallet.connect(owner).addAuthorizedAddress(wallet2);

	console.log("approving smart wallet");
	await AC.connect(wallet2).approve(WalletAddress, ethers.parseEther("500"));

	const allowance = await AC.connect(wallet2).allowance(
		wallet2.address,
		WalletAddress
	);

	console.log("allowance: " + allowance);

	await Wallet.connect(wallet2).depositToken(
		ACTokenAddress,
		ethers.parseEther("100")
	);

	console.log("Transferred 100 $AC from wallet2 to smart wallet . . .");
	console.log(
		"wallet2's AC Token Balance: ",
		ethers.formatEther(await AC.balanceOf(wallet2.address))
	);
	console.log(
		"smart wallet's AC Token Balance: ",
		ethers.formatEther(await AC.balanceOf(WalletAddress))
	);

	console.log(
		"Test getUserTokenBalance: ",
		ethers.formatEther(
			await Wallet.getUserTokenBalance(wallet2.address, ACTokenAddress)
		)
	);

	// console.log();
	// await Wallet.withdrawToOwner(ACTokenAddress, ethers.parseEther("50"));
	// console.log("Withdrawing 50 $AC . . .");
	// console.log(
	// 	"Owner's AC Token Balance: ",
	// 	ethers.formatEther(await AC.balanceOf(owner.address))
	// );
	// console.log(
	// 	"Owner's AC Token Balance: ",
	// 	ethers.formatEther(await AC.balanceOf(WalletAddress))
	// );

	// const sendEth = await owner.sendTransaction({
	// 	to: WalletAddress,
	// 	value: ethers.parseEther("1"),
	// });
	// console.log("\nSend 1 ETH from Owner to Smart Wallet . . .");
	// console.log("Tx Hash: ", sendEth.hash);
	// console.log(
	// 	"Smart Wallet ETH Balance: ",
	// 	ethers.formatEther(await Wallet.getETHBalance())
	// );
	// console.log(
	// 	"Owner's ETH Balance: ",
	// 	ethers.formatEther(await ethers.provider.getBalance(owner.address))
	// );
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
