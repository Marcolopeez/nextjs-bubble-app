import NFTBox from "../components/NFTBox"
import ProjectDescription_ES from "../components/ProjectDescription_ES"
import ProjectDescription_EN from "../components/ProjectDescription_EN"
import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import marketplaceAbi from "../constants/BubbleMarketplace.json"
import nftAbi from "../constants/BubbleNFT.json"
import LockModal from "../components/LockModal"
import NFTsReleasedModal from "../components/NFTsReleasedModal"
import { marketplaceAddress, nftAddress } from "../constants/ContractAddresses"

export default function Home() {
    const { isWeb3Enabled } = useMoralis()
    const [lockTimestamp, setLockTimestamp] = useState("")
    const [showLockModal, setShowLockModal] = useState(false)
    const [showNFTsReleasedModal, setShowNFTsReleasedModal] = useState(false)
    const hideLockModal = () => setShowLockModal(false)
    const hideShowNFTsReleasedModal = () => setShowNFTsReleasedModal(false)
    const nftComponents = []

    const { runContractFunction: getLockTimestamp } = useWeb3Contract({
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "lockTimestamp",
        params: {},
    })

    const { runContractFunction: getRegulatedState } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "regulatedState",
        params: {},
    })

    for (let i = 0; i < 10; i++) {
        nftComponents.push(
            <NFTBox
                tokenId={i.toString()}
            />
        )
    }

    async function checkLock() {
        const lockTimestamp = await getLockTimestamp() // 1711376054
        const regulatedState = await getRegulatedState()
        setLockTimestamp(lockTimestamp)
        console.log("lockTimestamp", lockTimestamp)
        if (lockTimestamp != "0") {
            if (!regulatedState) {
                setShowNFTsReleasedModal(true)
            } else {
                setShowLockModal(true)
            }
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            checkLock()
        }
    }, [isWeb3Enabled])

    return (
        <div className="container mx-auto">
            <LockModal isVisible={showLockModal} onClose={hideLockModal} lockTimestamp={lockTimestamp} />
            <NFTsReleasedModal isVisible={showNFTsReleasedModal} onClose={hideShowNFTsReleasedModal} />

            <img src="/bajo_header_marketplace.jpg" alt="bajo_header_marketplace" className="py-10 px-10 mx-auto " />

            <h1 className="py-10 px-10 font-mono font-bold text-2xl">Collection</h1>

            {isWeb3Enabled ? (
                <div className="flex flex-wrap justify-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-6 lg:gap-8 px-4 lg:px-8 xl:px-12">
                    {nftComponents}
                    <div />
                </div>
            ) : (
                <div>
                    <p className="py-4 px-4 font-mono text-2xl">Connect to Web3 to see it!</p>
                </div>
            )}

            <div className="py-20 px-10">
                <ProjectDescription_ES /></div>

            <img src="mosaicox4-NFTsanimado.gif" alt="mosaicox4-NFTsanimado" className="py-10 px-10 mx-auto" />

            <div className="py-20 px-10">
                <ProjectDescription_EN /></div>

            <img src="sobrefooterDeLogos.jpg" alt="sobrefooterDeLogos" className="py-10 px-10 mx-auto" />
        </div>
    )
}
