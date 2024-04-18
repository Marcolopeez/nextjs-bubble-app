import { Modal } from "@web3uikit/core"

export default function NFTsReleasedModal({ isVisible, onClose, lockTimestamp }) {
    return (
        <Modal
            id="regular"
            isVisible={isVisible}
            title="Notice"
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={onClose}
        >
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <p className="text-2xl font-mono font-bold text-gray-500"> NFTs have already been released</p>

                <p className="text-2xl font-mono text-gray-500"> The Marketplace is no longer available</p>
            </div>
        </Modal>

    )
}
