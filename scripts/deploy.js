async function main() {
  const EventTicket = await ethers.getContractFactory("TokenMaster");
  const CONTRACT_NAME = "TokenMaster";
  const SYMBOL = "TM";
  const eventTicket = await EventTicket.deploy(CONTRACT_NAME, SYMBOL);
  await eventTicket.deployed();
  console.log("EventTicket deployed to:", eventTicket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
