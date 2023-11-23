import {
	time,
	loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it } from "mocha";

describe("Lock", function () {
	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshot in every test.
	async function deployFixture() {
		const [owner, otherAccount] = await ethers.getSigners();

		const ACFactory = await ethers.getContractFactory("AC", owner);
		const AC = await ACFactory.deploy();
		const ACTokenAddress = await AC.getAddress();

		const WalletFactory = await ethers.getContractFactory("SmartWallet", owner);
		const Wallet = await WalletFactory.deploy();
		const WalletAddress = await Wallet.getAddress();

		await AC.connect(owner).mint(owner.address, ethers.parseEther("1000"));
		await AC.connect(otherAccount).mint(
			otherAccount.address,
			ethers.parseEther("500")
		);

		return { owner, otherAccount, AC, ACTokenAddress, Wallet, WalletAddress };
	}

	describe("Authorization", function () {
		it("Should throw not authorized error", async function () {
			const { WalletAddress, otherAccount, Wallet } = await loadFixture(
				deployFixture
			);

			await expect(
				otherAccount.sendTransaction({
					to: WalletAddress,
					value: ethers.parseEther("1"),
				})
			).to.be.revertedWithCustomError(Wallet, "Unauthorized");
		});
		it("Should throw not authorized error", async function () {
			const { WalletAddress, otherAccount, Wallet } = await loadFixture(
				deployFixture
			);

			await expect(
				otherAccount.sendTransaction({
					to: WalletAddress,
					value: ethers.parseEther("1"),
				})
			).to.be.revertedWithCustomError(Wallet, "Unauthorized");
		});
		it("Should throw not authorized error", async function () {
			const { WalletAddress, otherAccount, Wallet } = await loadFixture(
				deployFixture
			);

			await expect(
				otherAccount.sendTransaction({
					to: WalletAddress,
					value: ethers.parseEther("1"),
				})
			).to.be.revertedWithCustomError(Wallet, "Unauthorized");
		});

		// describe("Events", function () {
		// 	it("Should emit an event on withdrawals", async function () {
		// 		const { lock, unlockTime, lockedAmount } = await loadFixture(
		// 			deployOneYearLockFixture
		// 		);

		// 		await time.increaseTo(unlockTime);

		// 		await expect(lock.withdraw())
		// 			.to.emit(lock, "Withdrawal")
		// 			.withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
		// 	});
		// });

		// describe("Transfers", function () {
		// 	it("Should transfer the funds to the owner", async function () {
		// 		const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
		// 			deployOneYearLockFixture
		// 		);

		// 		await time.increaseTo(unlockTime);

		// 		await expect(lock.withdraw()).to.changeEtherBalances(
		// 			[owner, lock],
		// 			[lockedAmount, -lockedAmount]
		// 		);
		// 	});
		// });
	});
});
