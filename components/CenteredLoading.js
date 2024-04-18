import React from 'react'
import { Loading } from 'web3uikit'

const CenteredLoading = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente para cubrir los elementos detrás
                zIndex: '9999', // Asegura que esté por encima de otros elementos
            }}
        >
            <Loading size={70} spinnerColor="#2E7DAF" />
        </div>
    )
}

export default CenteredLoading