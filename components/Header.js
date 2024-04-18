import { useState, useEffect } from "react"
import { ConnectButton } from "@web3uikit/web3"
import { Button } from "@web3uikit/core"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Link from "next/link"
import WithdrawModal from "./WithdrawModal"
import marketplaceAbi from "../constants/BubbleMarketplace.json"
import { marketplaceAddress } from "../constants/ContractAddresses"

export default function Header() {
    const { isWeb3Enabled, account } = useMoralis()
    const [balance, setBalance] = useState("")
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const hideWithdrawModal = () => setShowWithdrawModal(false)

    async function updateBalance() {
        const balance = await getBalance()
        setBalance(balance)
        console.log(`The balance of ${account} is ${balance}`)
    }

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getBalance",
        params: { account: account },
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            updateBalance()
        }
    }, [isWeb3Enabled, account]) // eslint-disable-line react-hooks/exhaustive-deps

    const HandleButtonClick = () => {
        setShowWithdrawModal(true)
    }

    return (
        <div>
            <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
                <h1 className="py-4 px-4 font-mono font-bold text-3xl">
                    <Link href="/">
                        Bubble Marketplace
                    </Link>
                </h1>

                {isWeb3Enabled ? (
                    <div className="flex flex-row items-center">
                        <Button
                            onClick={HandleButtonClick}
                            text="Withdraw"
                            size="large"
                            theme="moneyPrimary"
                        />

                        <ConnectButton moralisAuth={false} /*We are not using Moralis database*/ />
                    </div>
                ) : (
                    <div className="flex flex-row items-center">
                        <ConnectButton moralisAuth={false} /*We are not using Moralis database*/ />
                    </div>
                )}

            </nav>
            <div>
                <WithdrawModal isVisible={showWithdrawModal} onClose={hideWithdrawModal} balance={balance} />
            </div>
        </div >
    )
}