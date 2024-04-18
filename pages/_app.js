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
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
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
