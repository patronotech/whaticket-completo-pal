import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    TextField,
    Card,
    CardContent,
} from '@mui/material';
import { Cancel, Search, Send, SkipNext, SkipPrevious } from '@material-ui/icons';
import AudioModal from '../AudioModal';
import { Document, Page, pdfjs } from 'react-pdf';
import { makeStyles } from "@material-ui/core/styles";
import { grey } from '@material-ui/core/colors';
import { InputAdornment, InputBase } from '@material-ui/core';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
    },
    modal: {
        background: theme.palette.background.default,
    },
    messageInputWrapperPrivate: {
        padding: 6,
        marginRight: 7,
        background: theme.palette.background.paper,
        display: "flex",
        borderRadius: 20,
        flex: 1,
        position: "relative",
    },
    buttonEnable: {
        color: theme.mode === 'light' ? "grey" : "#eee",
    },
    buttonDisable: {
        color: grey[400]
    }
}));

const MessageUploadMedias = ({ isOpen, files, onClose, onSend, onCancelSelection }) => {
    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [captions, setCaptions] = useState(files.map(() => ''));
    const [numPages, setNumPages] = React.useState(null);
    const [componentMounted, setComponentMounted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [firstTyping, setFirstTyping] = useState(false);

    useEffect(() => {
        setFirstTyping(true);
        setComponentMounted(true);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleClose = () => {
        onClose();
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setFirstTyping(true);
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < files.length - 1) {
            setFirstTyping(true);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleTextFieldBlur = () => {
        setIsTyping(false);
    };

    const handleCaptionChange = (e) => {
        const value = e.target.value;
        setCaptions((prevCaptions) => {
            const updatedCaptions = [...prevCaptions];
            updatedCaptions[currentIndex] = value;
            return updatedCaptions;
        });
        if (firstTyping) {
            setIsTyping(true);
        }
    };

    const handleSend = () => {
        const selectedMedias = files.map((file, index) => ({
            file,
            caption: captions[index],
        }));
        onSend(selectedMedias);
        handleClose();
    };

    const renderFileContent = useMemo(() => {
        if (!componentMounted) {
            return null;
        }
        if (firstTyping) {
            const currentFile = files[currentIndex];
            if (currentFile.type.startsWith('image')) {
                return (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: "400px"
                            }}
                            className={classes.modal}
                        >
                            <img
                                alt={`Imagem ${currentIndex + 1}`}
                                src={URL.createObjectURL(currentFile)}
                                style={{
                                    maxWidth: "600px",
                                    maxHeight: "400px",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            className={classes.modal}

                        >
                            <Typography variant="h6">{currentFile.name}</Typography>
                        </div>
                    </>

                );
            } else if (currentFile.type === 'application/pdf') {
                return (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '400px'
                            }}
                            className={classes.modal}

                        >
                            <Document file={URL.createObjectURL(currentFile)} onLoadSuccess={onDocumentLoadSuccess} >
                                <Page pageNumber={1}
                                    width={200}
                                    height={300}
                                />
                            </Document>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            className={classes.modal}

                        >
                            <Typography variant="h6">{currentFile.name}</Typography>
                        </div>
                    </>
                );
            } else if (currentFile.type.startsWith('video')) {
                return (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '400px',
                            }}
                            className={classes.modal}

                        >
                            <video
                                src={URL.createObjectURL(currentFile)}
                                controls={true}
                                volume={localStorage.getItem("volume")}
                                style={{
                                    maxWidth: "600px",
                                    maxHeight: "400px",
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            className={classes.modal}

                        >
                            <Typography variant="h6">{currentFile.name}</Typography>
                        </div>
                    </>
                );
            } else if (currentFile.type.startsWith('audio')) {
                return (
                    <><div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '400px',
                        }}
                        className={classes.modal}

                    >
                        <AudioModal url={URL.createObjectURL(currentFile)} />
                    </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            className={classes.modal}

                        >
                            <Typography variant="h6">{currentFile.name}</Typography>
                        </div>
                    </>
                );
            } else {
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '400px', // Altura desejada para vídeos, documentos e áudios
                        }}
                        className={classes.modal}

                    >
                        <CardContent className={classes.modal}
                        >
                            <Typography variant="h6">Visualização não disponível</Typography>
                            <Typography variant="h6">{currentFile.name}</Typography>
                        </CardContent>
                    </div>
                );
            }
        }
        return null;
    }, [currentIndex, firstTyping]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            // const newCaptions = captions.slice();
            // newCaptions[currentIndex] += '\n';
            // setCaptions(newCaptions);
            return
        }
        switch (event.key) {
            case 'Escape':
                onCancelSelection();
                break;
            case 'Enter':
                handleSend();
                break;
            case 'ArrowRight':
                handleNext();
                break;
            case 'ArrowLeft':
                handlePrev();
                break;
            default:
                break;
        }
    };
    return (
        <div className={classes.modal}>
            <Dialog
                open={isOpen}
                fullWidth
                maxWidth="md"
                scroll="paper"
            >
                <DialogContent className={classes.modal}>
                    <Card>
                        {renderFileContent}
                        <CardContent className={classes.modal}>
                            <div className={classes.messageInputWrapperPrivate}>
                                <InputBase
                                    placeholder="Legenda (opcional)"
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    maxRows={5}
                                    value={captions[currentIndex]}
                                    onChange={handleCaptionChange}
                                    onBlur={handleTextFieldBlur}
                                    autoFocus
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions className={classes.modal}>
                    <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                        <SkipPrevious className={currentIndex === 0 ? classes.buttonDisable : classes.buttonEnable} />
                    </IconButton>
                    <IconButton onClick={onCancelSelection} >
                        <Cancel className={classes.buttonEnable} />
                    </IconButton>
                    <IconButton onClick={handleSend} >
                        <Send className={classes.buttonEnable} />
                    </IconButton>
                    <IconButton onClick={handleNext} disabled={currentIndex === files.length - 1}>
                        <SkipNext className={currentIndex === files.length - 1 ? classes.buttonDisable : classes.buttonEnable} />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MessageUploadMedias;
