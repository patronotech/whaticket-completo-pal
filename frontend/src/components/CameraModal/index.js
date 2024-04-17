import React, { useState } from 'react';
import Modal from 'react-modal';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

Modal.setAppElement('#root');


const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo transparente
  },
  content: {
    width: '80%',
    height: '70%',
    maxWidth: '780px',
    maxHeight: '85vh',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    border: 'none',
    padding: '0',
    background: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

const ModalCamera = ({ isOpen, onRequestClose, onCapture }) => {
  const [capturedImage, setCapturedImage] = useState(null);

  const handleTakePhoto = (dataUri) => {
    setCapturedImage(dataUri);
  };

  const handleConfirm = () => {

    // Converta a imagem capturada em um arquivo (Blob)
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        // Chame a função de retorno com o arquivo da imagem capturada
        onCapture(blob);
      });

    // Feche o modal
    setCapturedImage(null);
    onRequestClose();
  };

  return (
   <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}  
      style={customStyles}    
    >
       <div style={{ flex: 1 }}>
          <Camera
            onTakePhoto={handleTakePhoto}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            isImageMirror={false}
            style={customStyles}
          />
        </div>
        {capturedImage && 
          handleConfirm()
        }
    </Modal>
  );
};

export default ModalCamera;
