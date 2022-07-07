import "../styles/globals.css";
import { ConnectWalletProvider } from "../components/context/connectWallet.context";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <ConnectWalletProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConnectWalletProvider>
  );
}

export default MyApp;
