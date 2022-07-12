import { ethers } from "ethers";
import Head from "next/head";
import { useEffect, useContext, useState, useCallback, useMemo } from "react";
import {
  ConnectWalletContext,
  useStakingContract,
} from "../components/context/connectWallet.context";
import { Input } from "../components/Input";
import Table from "../components/Table";
import apiProvider from "../provider/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Row } from "reactstrap";

export default function Home() {
  const { connected, address: account } = useContext(ConnectWalletContext);
  const [amount, setAmount] = useState(0);
  const [alreadyApproved, setalreadyApproved] = useState(false);
  const [error, setError] = useState("");
  const [balanceOf, setBalanceOf] = useState("0");
  const [symbol, setSymbol] = useState("");
  const [staked, setStaked] = useState("0");
  const [tableData, setTableData] = useState([]);
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
  const getRecord = async () => {
    setTableData(await apiProvider.getRecords());
  };

  useEffect(() => {
    getRecord();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
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

  const columns = useMemo(
    () => [
      {
        Header: "TxHash",
        accessor: "transactionHash",
      },
      {
        Header: "staker",
        accessor: "from",
      },
      {
        Header: "BlockNumber",
        accessor: "blockNumber",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
    ],
    []
  );

  return (
    <div>
      <Head>
        <title>Stake T-STK Token</title>
        <meta name="description" content="template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Row>
          <Col xs="12 mt-5">
            <div className="d-flex justify-content-center text-center">
              <Table columns={columns} data={tableData} />{" "}
            </div>
          </Col>
          <Col xs="12">
            <div className="text-center mt-5">
              <div>
                Balance: {ethers.utils.formatEther(balanceOf).toString()}{" "}
                {symbol}
              </div>
              <div>
                Staked: {ethers.utils.formatEther(staked).toString()} {symbol}
              </div>
              <div>
                {error ? (
                  <div>
                    {error}
                    <div>
                      <button onClick={() => setError("")}>Reset App</button>
                    </div>
                  </div>
                ) : connected ? (
                  <div className="d-flex justify-content-center mt-3">
                    <Input
                      type="number"
                      onChange={(e) => setAmount(e.target.value)}
                      value={amount}
                    />
                    <Button color="primary" onClick={handleSubmit}>
                      Stake
                    </Button>
                  </div>
                ) : (
                  "Please connect with Wallet before staking"
                )}
              </div>
            </div>
          </Col>
        </Row>
      </main>
    </div>
  );
}
