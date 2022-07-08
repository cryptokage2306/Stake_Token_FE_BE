import { ethers } from "ethers";
import Head from "next/head";
import { useEffect, useContext, useState, useCallback } from "react";
import {
  ConnectWalletContext,
  useStakingContract,
} from "../components/context/connectWallet.context";
import { Input } from "../components/Input";

export default function Home() {
  const { connected, address: account } = useContext(ConnectWalletContext);
  const [amount, setAmount] = useState(0);
  const [alreadyApproved, setalreadyApproved] = useState(false);
  const [error, setError] = useState("");
  const [balanceOf, setBalanceOf] = useState("0");
  const [symbol, setSymbol] = useState("");
  const [staked, setStaked] = useState("0");
  const stakingContract = useStakingContract();
  useEffect(async () => {
    if (connected && account) {
      setBalanceOf((await stakingContract.balanceOf(account)).toString());
      setSymbol(await stakingContract.symbol());
      setStaked((await stakingContract.stakeOf(account)).toString());
      if (amount > 0) {
        const data = await stakingContract.allowance(
          account,
          process.env.NEXT_PUBLIC_STAKING_TOKEN_ADDRESS
        );

        if (ethers.utils.parseEther(amount).gt(data)) {
          setalreadyApproved(false);
        } else {
          setalreadyApproved(true);
        }
      }
    }
  }, [amount, account, connected]);

  const handleSubmit = useCallback(async () => {
    try {
      console.log(ethers.utils.parseEther(amount).toString());
      if (!alreadyApproved) {
        const tx = await stakingContract.approve(
          process.env.NEXT_PUBLIC_STAKING_TOKEN_ADDRESS,
          ethers.constants.MaxUint256
        );
        await tx.wait();
      }

      const stakeTx = await stakingContract.createStake(
        ethers.utils.parseEther(amount),
        {
          from: account,
        }
      );
      await stakeTx.wait();
    } catch (err) {
      setError(err.message);
    }
  }, [amount, alreadyApproved, error]);

  return (
    <div>
      <Head>
        <title>Next Tailwind Hardhat Template</title>
        <meta name="description" content="template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center items-center flex-col h-screen">
        <div className="">
          <div>
            Balance: {ethers.utils.formatEther(balanceOf).toString()} {symbol}
          </div>
          <div>
            Staked: {ethers.utils.formatEther(staked).toString()} {symbol}
          </div>
        </div>
        {error ? (
          <>
            {error}
            <div>
              <button onClick={() => setError("")}>Reset App</button>
            </div>
          </>
        ) : connected ? (
          <>
            <Input
            className="m-5"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Stake
            </button>
          </>
        ) : (
          "Please connect with Wallet before staking"
        )}
      </main>
    </div>
  );
}
