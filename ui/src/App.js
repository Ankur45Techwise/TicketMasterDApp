import { ethers } from "ethers";
import "./App.css";
import React from "react";
import Navigation from "./components/Navigation";
import Card from "./components/Card";
import Sort from "./components/Sort";
import SeatChart from "./components/SeatChart";
import TokenMaster from "./artifacts/TokenMaster.json";
import EventCreationForm from "./components/EventCreationForm";

const CONTRACT_ADDRESS = "0x58D251C73ab1B6f0B9d10433D7e47aCCC15349C6";

function App() {
  const [account, setAccount] = React.useState(null);
  const [etherProvider, setEtherProvider] = React.useState(null);
  const [smartContract, setSmartContract] = React.useState(null);
  const [contractModifier, setContractModifier] = React.useState(null);
  const [occasions, setOccasions] = React.useState([]);
  const [occasion, setOccasion] = React.useState({});
  const [toggle, setToggle] = React.useState(false);
  const [filteredOccasions, setFilteredOccasions] = React.useState(occasions);

  const loadBlockchainData = async () => {
    try {
      const etherProvider = new ethers.BrowserProvider(window.ethereum);
      setEtherProvider(etherProvider);

      const smartContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        TokenMaster.abi,
        etherProvider
      );
      setSmartContract(smartContract);

      // for making put request
      const signer = await etherProvider.getSigner();
      const contractWithSigner = new ethers.Contract(
        CONTRACT_ADDRESS,
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
    } catch (e) {
      console.error("Error loading blockchain data:", e);
    }
  };

  React.useEffect(() => {
    loadBlockchainData();
  }, []);

  React.useEffect(() => {
    setFilteredOccasions(occasions);
  }, [occasions]);

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="header__title">
          <strong>Events</strong>
        </h2>
      </header>
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "20px",
          height: "100%",
        }}
      >
        <div style={{ padding: "10px", flex: 1 }}>
          <Sort
            occasions={occasions}
            setFilteredOccasions={setFilteredOccasions}
          />
          <div className="cards">
            {filteredOccasions.map((occ, idx) => (
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
        </div>
        <div
          style={{ width: "2px", height: "100%", backgroundColor: "darkgray" }}
        ></div>

        <EventCreationForm
          contractModifier={contractModifier}
          loadBlockchainData={loadBlockchainData}
        />
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
