import { useState, useEffect } from "react"
import { ConnectButton } from "@web3uikit/web3"
import { Button } from "@web3uikit/core"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Link from "next/link"
import WithdrawModal from "./WithdrawModal"
import TryLockModal from "./TryLockModal"
import marketplaceAbi from "../constants/BubbleMarketplace.json"
import { marketplaceAddress } from "../constants/ContractAddresses"

export default function Header() {
    const { isWeb3Enabled, account } = useMoralis()
    const [balance, setBalance] = useState("")
    const [deploymentDate, setDeploymentDate] = useState("")
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const hideWithdrawModal = () => setShowWithdrawModal(false)
    const [showTryLockModal, setShowTryLockModal] = useState(false)
    const hideTryLockModal = () => setShowTryLockModal(false)

    async function updateBalance() {
        const balance = await getBalance()
        setBalance(balance)
        console.log(`The balance of ${account} is ${balance}`)
    }

    async function updateDaysElapsed() {
        const deploymentDate = await getDeploymentDate()
        console.log(`The deploymentDate is: ${deploymentDate}`)
        setDeploymentDate(deploymentDate)
    }

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getBalance",
        params: { account: account },
    })

    const { runContractFunction: getDeploymentDate } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getDeploymentTimestamp",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            updateBalance()
            updateDaysElapsed()
        }
    }, [isWeb3Enabled, account]) // eslint-disable-line react-hooks/exhaustive-deps

    const HandleWithdrawButtonClick = () => {
        setShowWithdrawModal(true)
    }

    const HandleLockButtonClick = () => {
        setShowTryLockModal(true)
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

                        <div className="flex flex-row items-center px-4">
                            <Button
                                onClick={HandleLockButtonClick}
                                text="Lock"
                                size="large"
                                theme="moneyPrimary"
                            />
                        </div>

                        <Button
                            onClick={HandleWithdrawButtonClick}
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
                <TryLockModal isVisible={showTryLockModal} onClose={hideTryLockModal} deploymentDate={deploymentDate} />
            </div>
        </div >
    )
}