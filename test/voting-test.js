import { expect } from "chai";  // Import Chai's expect function
import { network } from "hardhat";
const { ethers } = await network.connect();
import { describe, it, beforeEach } from "mocha";  // Import Hardhat's ethers

const customDescribe = (description, callback) => {
  console.log(`Custom Suite: ${description}`);
  
  // Create a Mocha suite and pass the callback to it
  const suite = new Mocha.Suite(description);

  // Use Mocha's internal functions to add hooks and tests
  suite.beforeEach(async function () {
    console.log("Running beforeEach hook");
    await callback();  // Run the test setup
  });

  Mocha.prototype.suite.addSuite(suite);  // Add suite to the Mocha test runner
};

customDescribe("Voting Contract", function () {
  let Voting, voting, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.deployed();

    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");
  });

  it("Should allow voting and prevent double voting", async function () {
    await voting.connect(addr1).vote(1);
    const candidate = await voting.getCandidate(1);
    expect(candidate.voteCount).to.equal(1);

    await expect(voting.connect(addr1).vote(1)).to.be.revertedWith("Already voted.");
  });

  it("Should not allow voting for invalid candidate", async function () {
    await expect(voting.connect(addr1).vote(3)).to.be.revertedWith("Invalid candidate.");
  });
});