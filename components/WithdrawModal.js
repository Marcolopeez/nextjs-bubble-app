import { useState } from 'react'
import { Modal, useNotification } from "@web3uikit/core"
import { Loading } from 'web3uikit'
import { useWeb3Contract } from "react-moralis"
import marketplaceAbi from "../constants/BubbleMarketplace.json"
import { ethers } from "ethers"
import { marketplaceAddress } from "../constants/ContractAddresses"

export default function WithdrawModal({ isVisible, onClose, balance }) {
    const dispatch = useNotification()
    const [loading, setLoading] = useState(false)

    const { runContractFunction: withdraw } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "withdraw",
        params: {},
    })

    const handleWithdrawSuccess = async (tx) => {
        setLoading(true)
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "",
            title: "Balance withdrawn",
            position: "topR",
        })
        onClose && onClose()
        setLoading(false)
        setTimeout(() => {
            window.location.reload(true)
        }, 4000)
    }

    return (
        <Modal
            id="regular"
            isVisible={isVisible}
            title="Withdraw"
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                withdraw({
                    onError: (error) => {
                        console.log(error)
                        setLoading(false)

                        dispatch({
                            type: "error",
                            message: "",
                            title: "Transaction failed",
                            position: "topR",
                        })
                        onClose && onClose()
                    },
                    onSuccess: handleWithdrawSuccess,
                })
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {loading ? (
                    <div
                        style={{
                            backgroundColor: '#ECECFE',
                            borderRadius: '8px',
                            padding: '20px'
                        }}
                    >
                        <Loading
                            size={30}
                            spinnerColor="#2E7DAF"
                        />
                    </div>
                ) : (
                    <>
                        <p className="text-2xl font-mono font-bold text-gray-500"> Earned Balance: {balance ? ethers.utils.formatUnits(balance, "ether") : "0"} ETH</p>
                        <p className="text-2xl font-mono text-gray-500">Proceed to withdrawal?</p>
                    </>
                )}
            </div>
        </Modal>
    )
}
