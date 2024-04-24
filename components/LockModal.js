import { useState } from 'react'
import { Modal, useNotification } from "@web3uikit/core"
import { Loading } from 'web3uikit'
import { useWeb3Contract } from "react-moralis"
import marketplaceAbi from "../constants/BubbleMarketplace.json"
import { marketplaceAddress } from "../constants/ContractAddresses"

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

export default function LockModal({ isVisible, onClose, lockTimestamp }) {
    const dispatch = useNotification()
    const [loading, setLoading] = useState(false)


    const { runContractFunction: release } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "release",
        params: {},
    })

    const handleReleaseSuccess = async (tx) => {
        setLoading(true)
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "",
            title: "NFTs released",
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
            title="Notice"
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            okText="Release NFTs"
            onOk={() => {
                release({
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
                    onSuccess: handleReleaseSuccess,
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
                {loading ? ( // Mostrar el loading si el estado es true
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
                        <p className="text-2xl font-mono font-bold text-gray-500"> Marketplace is Locked. Healing time 481 days blockade activated</p>
                        <p className="text-2xl font-mono text-gray-500"> NFTs can be released from {convertUnixTimestampToUTC(parseFloat(lockTimestamp) + parseFloat(41558400)) /*Adding 481 days to the lockTimestamp*/} (UTC)</p>                    </>
                )}
            </div>
        </Modal>

    )
}
