import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

function LotteryEntrance() {
  let { chainId, isWeb3Enabled} = useMoralis();
  //console.log(parseInt(chainId))  // returns the hex value value, so we parseInt it
  chainId = parseInt(chainId);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification()



  const { runContractFunction:  enterRaffle,  data: enterTxResponse, isLoading,  isFetching  } = useWeb3Contract({

    abi: abi,
    contractAddress: raffleAddress, //we need to specify the network
    functionName: "enterRaffle",
    params: {}, //no params
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //we need to specify the network
    functionName: "getEntranceFee",
    params: {}, //no params
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //we need to specify the network
    functionName: "getNumberOfPlayers",
    params: {}, //no params
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //we need to specify the network
    functionName: "getRecentWinner",
    params: {}, //no params
  });

  async function updateUIValues() {

    const entranceFeeFromCall = (await getEntranceFee()).toString()
    const numPlayersFromCall = (await getNumberOfPlayers()).toString()
    const recentWinnerFromCall = await getRecentWinner();

    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);

    console.log(numPlayers);
    console.log(entranceFee);
    console.log(recentWinner);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();

      }

  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
     try {
      await tx.wait(1)
      handleNewNotification(tx)
      updateUIValues()
    } catch (error) {
      console.log(error)
    }

  }
  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      dismissAfter: 5000,
      position: "topR",
      icon: "checkmark",
      title: "Transaction Notification"
    })
  }
  return (
    <div className="p-5">
      Hi from LotteryEntrance
      {raffleAddress ? (
        <div className="">
          <button className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded font-bold"
            onClick={async () => {
              console.log("I have been clicked")
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error)
              })
              console.log("I have entered the raffle")
            }}
           disabled= {isLoading || isFetching}>
            {isLoading || isFetching ? (<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>) : (<div>Enter Raffle</div>)} 
          </button>
          <br/>
          Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          <br/>
          Players in Raffle: {numPlayers}
          <br />
          Recent Winner of Raffle: {recentWinner}
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
      <div></div>
    </div>
  );
}


export default LotteryEntrance;
