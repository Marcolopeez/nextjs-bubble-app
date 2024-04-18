import '../styles/globals.css'
import Head from 'next/head'
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import { Footer2 } from "../components/Footer2"
import { NotificationProvider } from "@web3uikit/core"

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Bubble Marketplace</title>
                <meta name="description" content="Next.js Dapp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}/*We are not using the Moralis server*/ >
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                    <Footer2 />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
