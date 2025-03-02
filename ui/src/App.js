import { ethers } from "ethers";
import "./App.css";
import React from "react";
import Navigation from "./components/Navigation";
import Card from "./components/Card";
import Sort from "./components/Sort";
import SeatChart from "./components/SeatChart";
import TokenMaster from "./artifacts/TokenMaster.json";

function App() {
  const [account, setAccount] = React.useState(null);
  const [etherProvider, setEtherProvider] = React.useState(null);
  const [smartContract, setSmartContract] = React.useState(null);
  const [contractModifier, setContractModifier] = React.useState(null);
  const [occasions, setOccasions] = React.useState([]);
  const [occasion, setOccasion] = React.useState({});
  const [toggle, setToggle] = React.useState(false);

  const loadBlockchainData = async () => {
    const etherProvider = new ethers.BrowserProvider(window.ethereum);
    setEtherProvider(etherProvider);

    const smartContract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      TokenMaster.abi,
      etherProvider
    );
    setSmartContract(smartContract);

    // for making pupt request
    const signer = await etherProvider.getSigner();
    const contractWithSigner = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      TokenMaster.abi,
      signer
    );
    setContractModifier(contractWithSigner);

    const totalOccasions = Number(
      await smartContract.totalOccasions()
    ).toString();

    let occasions = [];
    for (let i = 1; i <= totalOccasions; i++) {
      const occasion = await smartContract.getOccasion(i);
      occasions.push(occasion);
    }
    setOccasions(occasions);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let formattedAccounts = [];
      for (let account of accounts) {
        formattedAccounts.push(ethers.getAddress(account));
      }
      setAccount(formattedAccounts[0]);
    });
  };

  React.useEffect(() => {
    loadBlockchainData();
  }, []);

  // React.useEffect(() => {
  // creating an event
  //   if (contractModifier) {
  //     contractModifier.list(
  //       "Holi Party",
  //       1,
  //       500,
  //       "March 14 2025",
  //       "10:00 IST",
  //       "Novotel Bengaluru"
  //     );
  //   }
  // }, [JSON.stringify(contractModifier)]);

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="header__title">
          <strong>Events</strong>
        </h2>
      </header>
      <Sort />
      <div className="cards">
        {occasions.map((occ, idx) => (
          <Card
            occasion={occ}
            setOccasion={setOccasion}
            id={idx + 1}
            key={idx}
            provider={etherProvider}
            tokenMaster={smartContract}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
          />
        ))}
      </div>
      {toggle && (
        <SeatChart
          occasion={occasion}
          tokenMaster={smartContract}
          provider={etherProvider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;
