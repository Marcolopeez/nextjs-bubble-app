import { useState } from 'react'
import { Modal, useNotification } from "@web3uikit/core"
import { Loading } from 'web3uikit'
import { useWeb3Contract } from "react-moralis"
import marketplaceAbi from "../constants/BubbleMarketplace.json"
import { marketplaceAddress } from "../constants/ContractAddresses"

export default function WithdrawModal({ isVisible, onClose, deploymentDate }) {
    const dispatch = useNotification()
    const [loading, setLoading] = useState(false)

    function convertUnixTimestampToUTC(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);

        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} at ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return formattedDate;
    }

    const { runContractFunction: tryLock } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "tryLock",
        params: {},
    })

    const handleTryLockSuccess = async (tx) => {
        setLoading(true)
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "",
            title: "Transaction confirmed",
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
            title="Lock"
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                tryLock({
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
                    onSuccess: handleTryLockSuccess,
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
                        <p className="text-2xl font-mono font-bold text-gray-500"> Deployment date:  {convertUnixTimestampToUTC(parseFloat(deploymentDate))} (UTC) </p>
                        <p className="text-2xl font-mono text-gray-500">Try to lock?</p>
                    </>
                )}
            </div>
        </Modal>
    )
}
