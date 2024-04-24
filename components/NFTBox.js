import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftAbi from "../constants/BubbleNFT.json"
import marketplaceAbi from "../constants/BubbleMarketplace.json"
import { marketplaceAddress, nftAddress } from "../constants/ContractAddresses"
import Image from "next/image"
import { Card, Skeleton, useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import CenteredLoading from './CenteredLoading'

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars + 2)
    )
}

export default function NFTBox({ tokenId }) {

    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenOwner, setTokenOwner] = useState("")
    const [sellingNftId, setSellingNftId] = useState("")
    const [currentPrice, setCurrentPrice] = useState("")
    const [lockTimestamp, setLockTimestamp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: getOwnerOf } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "ownerOf",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: getSellingNftId } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "sellingNftId",
        params: {},
    })

    const { runContractFunction: getPrice } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "currentPrice",
        params: {},
    })

    const { runContractFunction: getLockTimestamp } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "lockTimestamp",
        params: {},
    })

    const { runContractFunction: purchase } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "purchase",
        msgValue: currentPrice,
        params: {},
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        const nftOwner = await getOwnerOf()
        const nftId = await getSellingNftId()
        const nftPrice = await getPrice()
        const lockTimestamp = await getLockTimestamp()
        console.log(`The TokenURI is ${tokenURI}`)
        console.log(`The token owner is ${nftOwner}`)
        console.log(`The sellingNftId is ${nftId}`)
        console.log(`The price is ${nftPrice}`)
        console.log(`The lockTimestamp is ${lockTimestamp}`)
        if (tokenURI) {
            // IPFS Gateway: A server that can be used to access IPFS content via HTTP   
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenOwner(nftOwner)
            setSellingNftId(nftId)
            setCurrentPrice(nftPrice)
            setLockTimestamp(lockTimestamp)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled]) // eslint-disable-line react-hooks/exhaustive-deps

    const HandleCardClick = () => {
        if (sellingNftId == tokenId) {
            purchase({
                onError: (error) => {
                    console.log(error)
                    dispatch({
                        type: "error",
                        message: "",
                        title: "Transaction failed",
                        position: "topR",
                    })
                },
                onSuccess: handlePurchaseSuccess,
            })
        }
    }


    const handlePurchaseSuccess = async (tx) => {
        setIsLoading(true)
        await tx.wait(1)
        setIsLoading(false)
        dispatch({
            type: "success",
            message: "",
            title: "NFT Bought",
            position: "topR",
        })
        setTimeout(() => {
            window.location.reload(true)
        }, 4000)
    }

    return (
        <div>
            {isLoading && <CenteredLoading />}
            <div className="font-mono">
                {imageURI ?
                    <Card title={tokenName} onClick={HandleCardClick} isDisabled={(sellingNftId != tokenId) || (lockTimestamp != "0")} >
                        <div className="p-2 flex flex-col items-end gap-2">
                            <div className="italic text-sm font-mono">
                                Owned by {tokenOwner.toLowerCase() === account.toLowerCase() ? "you" : truncateStr(tokenOwner.toLowerCase() || "", 15)}
                            </div>
                            <Image
                                className="rounded-md"
                                loader={({ src }) => src}
                                src={imageURI}
                                height="700"
                                width="700"
                                unoptimized
                                priority
                                alt=""
                            />
                            <div className="flex font-mono font-bold">
                                {lockTimestamp != "0" ?
                                    <div className="font-mono font-bold text-red-500">Locked</div>
                                    : (sellingNftId == tokenId ?
                                        <div className="font-mono font-bold">{parseFloat(ethers.utils.formatUnits(currentPrice, "ether")).toFixed(10)} ETH</div>
                                        : <div className="font-mono font-bold">N/A</div>
                                    )
                                }
                            </div>
                        </div>
                    </Card>
                    :
                    <Skeleton
                        className="flex grid grid-cols-2 gap-x-40 gap-y-60 p-20"
                        animationColor="#0F7FFF"
                        backgroundColor="#003470"
                        height="300px"
                        theme="image"
                        width="250px"
                    />}
            </div>
        </div >
    )
}
