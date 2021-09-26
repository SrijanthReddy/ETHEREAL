import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BankingContract from "../../contracts/Banking.json";
import getWeb3 from "../../getWeb3";

import "./TransferMoney.css";

const TransferMoney = () => {
  const [contract, setContract] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  
  const[transferAmount,setTransferAmount]=useState("")
  const[transferSerial,setTransferSerial]=useState("")
  
  const { id }=useParams()
  useEffect(() => {
    const getBasicDetails = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = BankingContract.networks[networkId];
        const instance = new web3.eth.Contract(
          BankingContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(web3);
        setAccount(accounts[0]);
        setContract(instance);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    getBasicDetails();
  }, []);

  useEffect(() => {
    const getContractDetails = async () => {};
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      getContractDetails();
    }
  }, [web3, account, contract]);
  

  const handleTransaction=async(e)=>{
   e.preventDefault()
   await contract.methods.transactAmount(transferAmount,transferSerial,id).send({from:account,to:contract.options.address,value:transferAmount})
   
   .then((res)=>{
     console.log(res)
   })
   .catch((err)=>{
     console.log(err)
   })
  }


  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="transaction-section">
      <h1>Welcome to the transfers section</h1>

      <h2>Welcome to the transfers section</h2>

      <form onSubmit={handleTransaction}>
        <input type="text" placeholder="Enter the amount you want to transfer " value={transferAmount} onChange={(e)=>{setTransferAmount(e.target.value)}}></input>
        <input type="text" placeholder="Enter the serial number of the account you want to transfer this amount" value={transferSerial} onChange={(e)=>{setTransferSerial(e.target.value)}}/>
        <button className="transfer-button" type="submit">INITITATE TRANSFER</button>
      </form>
    </div>
  );
};

export default TransferMoney;
