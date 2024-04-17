import React, { useState, useEffect, useContext, useRef } from "react";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import MicRecorder from "mic-recorder-to-mp3";
import clsx from "clsx";


import { green } from "@material-ui/core/colors";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoodIcon from "@material-ui/icons/Mood";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import MicIcon from "@material-ui/icons/Mic";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { isString, isEmpty, isObject, has } from "lodash";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import RecordingTimer from "./RecordingTimer";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError";

import useQuickMessages from "../../hooks/useQuickMessages";


import {
  CircularProgress,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  ListItemText,
  Avatar,
  Tooltip,
  ListItem,
  ListItemAvatar,
  List,
  TextField
} from "@material-ui/core";
import { AttachFile, Comment, Create } from "@material-ui/icons";
import useCompanySettings from "../../hooks/useSettings/companySettings";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    background: theme.palette.tabHeaderBackground,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      bottom: 0,
      width: "100%",
    },
  },

  newMessageBox: {
    background: theme.palette.tabHeaderBackground,
    width: "100%",
    display: "flex",
    padding: "7px",
    alignItems: "center",
  },

  messageInputWrapper: {
    padding: 6,
    marginRight: 7,
    background: theme.palette.total,
    display: "flex",
    borderRadius: 20,
    flex: 1,
    position: "relative",
    border: 'none',
  },

  messageInput: {
    paddingLeft: 10,
    flex: 1,
    border: "none",
  },

  sendMessageIcons: {
    color: "grey",    
  },

  uploadInput: {
    display: "none",
  },
  dropInfo: {
    background: theme.palette.background.primary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    left: 0,
    right: 0,
  },
  dropInfoOut: {
    display: "none",
  },
  gridFiles: {
    maxHeight: "100%",
    maxWidth: "100%",
    // overflow: "scroll",
  },

  viewMediaInputWrapper: {
    maxHeight: "80%",
    display: "flex",
    padding: "10px 13px",
    position: "relative",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette.background.primary,
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  },

  emojiBox: {
    position: "absolute",
    bottom: 63,
    width: 40,
    borderTop: "1px solid #e8e8e8",
  },

  circleLoading: {
    color: green[500],
    opacity: "70%",
    position: "absolute",
    top: "20%",
    left: "50%",
    marginLeft: -12,
  },

  audioLoading: {
    color: green[500],
    opacity: "70%",
  },

  recorderWrapper: {
    display: "flex",
    alignItems: "center",
    alignContent: "middle",
  },

  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "25%"
  },

  cancelAudioIcon: {
    color: "red",
  },

  sendAudioIcon: {
    color: "green",
  },

  replyginMsgWrapper: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingLeft: 73,
    paddingRight: 7,
  },

  replyginMsgContainer: {
    flex: 1,
    marginRight: 5,
    overflowY: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: "7.5px",
    display: "flex",
    position: "relative",
  },

  replyginMsgBody: {
    padding: 10,
    height: "auto",
    display: "block",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
  },

  replyginContactMsgSideColor: {
    flex: "none",
    width: "4px",
    backgroundColor: "#35cd96",
  },

  replyginSelfMsgSideColor: {
    flex: "none",
    width: "4px",
    backgroundColor: "#6bcbef",
  },

  messageContactName: {
    display: "flex",
    color: "#6bcbef",
    fontWeight: 500,
  },

  switchs: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  }
}));

const EmojiOptions = (props) => {
  const { disabled, showEmoji, setShowEmoji, handleAddEmoji } = props;
  const classes = useStyles();
  return (
    <>
      <IconButton
        aria-label="emojiPicker"
        component="span"
        disabled={disabled}
        onClick={(e) => setShowEmoji((prevState) => !prevState)}
      >
        <MoodIcon className={classes.sendMessageIcons} />
      </IconButton>
      {showEmoji ? (
        <div className={classes.emojiBox}>
          <Picker
            perLine={16}
            showPreview={false}
            showSkinTones={false}
            onSelect={handleAddEmoji}
          />
        </div>
      ) : null}
    </>
  );
};

const ActionButtons = (props) => {
  const {
    inputMessage,
    loading,
    recording,
    ticketStatus,
    handleSendMessage,
    handleCancelAudio,
    handleUploadAudio,
    handleStartRecording,
  } = props;
  const classes = useStyles();
  if (inputMessage) {
    return (
      <IconButton
        aria-label="sendMessage"
        component="span"
        onClick={handleSendMessage}
        disabled={loading}
      >
        <SendIcon className={classes.sendMessageIcons} />
      </IconButton>
    );
  } else if (recording) {
    return (
      <div className={classes.recorderWrapper}>
        <IconButton
          aria-label="cancelRecording"
          component="span"
          fontSize="large"
          disabled={loading}
          onClick={handleCancelAudio}
        >
          <HighlightOffIcon className={classes.cancelAudioIcon} />
        </IconButton>
        {loading ? (
          <div>
            <CircularProgress className={classes.audioLoading} />
          </div>
        ) : (
          <RecordingTimer />
        )}

        <IconButton
          aria-label="sendRecordedAudio"
          component="span"
          onClick={handleUploadAudio}
          disabled={loading}
        >
          <CheckCircleOutlineIcon className={classes.sendAudioIcon} />
        </IconButton>
      </div>
    );
  } else {
    return (
      <IconButton
        aria-label="showRecorder"
        component="span"
        disabled={loading || (ticketStatus !== "open" && ticketStatus !== "group")}
        onClick={handleStartRecording}
      >
        <MicIcon className={classes.sendMessageIcons} />
      </IconButton>
    );
  }
};


const CustomInput = (props) => {
  const {
    loading,
    inputRef,
    ticketStatus,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    handleInputPaste,
    disableOption,
  } = props;
  const classes = useStyles();
  const [quickMessages, setQuickMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const { list: listQuickMessages } = useQuickMessages();

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Auto resize the textarea while typing
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Navigate between lines using Arrow Up and Arrow Down keys
      const input = inputRef.current;
      const caretPosition = input.selectionStart;
      const lines = input.value.split('\n');

      if (e.key === 'ArrowUp' && caretPosition === 0) {
        // Move to the end of the last line when Arrow Up is pressed at the beginning
        const lastLine = lines[lines.length - 1];
        input.setSelectionRange(input.value.length, input.value.length);
        input.scrollTop = input.scrollHeight;
      } else if (e.key === 'ArrowDown' && caretPosition === input.value.length) {
        // Move to the beginning of the first line when Arrow Down is pressed at the end
        input.setSelectionRange(0, 0);
        input.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const messages = await listQuickMessages({ companyId, userId: user.id });
      const options = messages.map((m) => {
        let truncatedMessage = m.message;
        if (isString(truncatedMessage) && truncatedMessage.length > 35) {
          truncatedMessage = m.message.substring(0, 35) + "...";
        }
        return {
          value: m.message,
          label: `/${m.shortcode} - ${truncatedMessage}`,
        };
      });
      setQuickMessages(options);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      isString(inputMessage) &&
      !isEmpty(inputMessage) &&
      inputMessage.length >= 1
    ) {
      const firstWord = inputMessage.charAt(0);
      setPopupOpen(firstWord.indexOf("/") > -1);

      const filteredOptions = quickMessages.filter(
        (m) => m.label.indexOf(inputMessage) > -1
      );
      setOptions(filteredOptions);
    } else {
      setPopupOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMessage]);

  const onKeyPress = (e) => {
    if (loading || e.shiftKey) return;
    else if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const onPaste = (e) => {
    if (ticketStatus === "open" || ticketStatus === "group") {
      handleInputPaste(e);
    }
  };

  const renderPlaceholder = () => {
    if (ticketStatus === "open" || ticketStatus === "group") {
      return i18n.t("messagesInput.placeholderOpen");
    }
    return i18n.t("messagesInput.placeholderClosed");
  };

  const setInputRef = (input) => {
    if (input) {
      input && input.focus();
      input && (inputRef.current = input);
    }
  };

  useEffect(() => {
    // Ajustar a altura do textarea quando o valor for alterado
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
  }, [inputMessage]);

  return (
    <div className={classes.messageInputWrapper}>
      <Autocomplete
        freeSolo
        open={popupOpen}
        id="grouped-demo"
        value={inputMessage}
        options={options}
        closeIcon={null}
        getOptionLabel={(option) => { 
          if (isObject(option)) {
            return option.label;
          } else {
            return option;
          }
        }}
        onChange={handleInputChange}
        // onInputChange={(event, opt, reason) => {
        //   if (reason === "input") {
        //     setInputMessage(event.target.value);
        //   }
        // }}
        onPaste={onPaste}
        onKeyPress={onKeyPress}
        style={{ width: "100%" }}
        disabled={disableOption()}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;
          return (
            <TextField
              {...params.InputProps}
              {...rest}
              // disabled={disableOption()}
              inputRef={setInputRef}
              placeholder={renderPlaceholder()}
              onKeyDown={handleKeyDown}
              multiline           
              maxRows={5}   
              value={inputMessage}
              variant="outlined"
            />
          );
        }}
      />
    </div>
  );
};

const MessageInputCustom = (props) => {
  const { ticketStatus, ticketId } = props;
  const classes = useStyles();

  const [medias, setMedias] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const inputRef = useRef();
  const { setReplyingMessage, replyingMessage } =
    useContext(ReplyMessageContext);
  const { user } = useContext(AuthContext);
  const [signMessagePar, setSignMessagePar] = useState();
  const [signMessage, setSignMessage] = useState();
  const [privateMessage, setPrivateMessage] = useState(false);
  const [onDragEnter, setOnDragEnter] = useState(false);
  const {get:getSetting} = useCompanySettings()

  useEffect(() => {
    async function fetchData() {
      const setting = await getSetting({
        "column":"sendSignMessage"
    });

      if (setting.sendSignMessage === "disabled") {
        setSignMessagePar(false)
      } else {
        setSignMessagePar(true)
        setSignMessage(true)
      }
    }
    setPrivateMessage(false)
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setOnDragEnter(false);
    }, 10000);
    // eslint-disable-next-line
  }, [onDragEnter === true]);

  useEffect(() => {
    inputRef.current.focus();
  }, [replyingMessage]);

  useEffect(() => {
    inputRef.current.focus();
    return () => {
      setInputMessage("");
      setShowEmoji(false);
      setMedias([]);
      setReplyingMessage(null);
    };
  }, [ticketId, setReplyingMessage]);

  // const handleChangeInput = e => {
  // 	if (isObject(e) && has(e, 'value')) {
  // 		setInputMessage(e.value);
  // 	} else {
  // 		setInputMessage(e.target.value)
  // 	}
  // };

  const handleAddEmoji = (e) => {
    let emoji = e.native;
    setInputMessage((prevState) => prevState + emoji);
  };

  const handleChangeMedias = (e) => {
    if (!e.target.files) {
      return;
    }

    const selectedMedias = Array.from(e.target.files);
    setMedias(selectedMedias);
  };

  const handleChangeSign = (e) => {
    setSignMessage(!signMessage);
  };

  const handlePrivateMessage = (e) => {
    setPrivateMessage(!privateMessage);
  };

  const handleInputPaste = (e) => {
    if (e.clipboardData.files[0]) {
      setMedias([e.clipboardData.files[0]]);
    }
  };

  const handleUploadMedia = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("fromMe", true);
    formData.append("isPrivate", privateMessage);
    medias.forEach((media) => {
      formData.append("medias", media);
      privateMessage ?
        formData.append("body", `\u200d`)
        :
        formData.append("body", "")
    });


    try {
      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err);
    }

    setLoading(false);
    setMedias([]);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    setLoading(true);

    const userName = privateMessage ? `${user.name} - Mensagem Privada`: user.name;

    const message = {
      read: 1,
      fromMe: true,
      mediaUrl: "",
      body: signMessage
        ? `*${userName}:*\n${inputMessage.trim()}`
        : inputMessage.trim(),
      quotedMsg: replyingMessage,
      isPrivate: privateMessage
    };

    try {
      await api.post(`/messages/${ticketId}`, message);
    } catch (err) {
      toastError(err);
    }

    setInputMessage("");
    setShowEmoji(false);
    setLoading(false);
    setReplyingMessage(null);
  };
  
  const handleInputDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      const selectedMedias = Array.from(e.dataTransfer.files);
      setMedias(selectedMedias);
    }
  };

  const handleStartRecording = async () => {
    setLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await Mp3Recorder.start();
      setRecording(true);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  const handleUploadAudio = async () => {
    setLoading(true);
    try {
      const [, blob] = await Mp3Recorder.stop().getMp3();
      if (blob.size < 10000) {
        setLoading(false);
        setRecording(false);
        return;
      }

      const formData = new FormData();
      const filename = `audio-record-site-${new Date().getTime()}.mp3`;
      formData.append("medias", blob, filename);
      formData.append("body", filename);
      formData.append("fromMe", true);

      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err);
    }

    setRecording(false);
    setLoading(false);
  };

  const handleCancelAudio = async () => {
    try {
      await Mp3Recorder.stop().getMp3();
      setRecording(false);
    } catch (err) {
      toastError(err);
    }
  };

  const disableOption = () => {
    return loading || recording || (ticketStatus !== "open" && ticketStatus !== "group");
  };

  const renderPlaceholder = () => {
    if (ticketStatus === "open" || ticketStatus === "group") {
      return i18n.t("messagesInput.placeholderOpen");
    }
    return i18n.t("messagesInput.placeholderClosed");
  };

  const handleInputChange = (e) => {
    const input = e.target;
    setInputMessage(input.value);

    // Auto resize the textarea while typing
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Prevent the default behavior of Enter key
      e.preventDefault();

      // Add a newline character when Enter is pressed
      setInputMessage((prevText) => prevText + '\n');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Navigate between lines using Arrow Up and Arrow Down keys
      const input = inputRef.current;
      const caretPosition = input.selectionStart;
      const lines = input.value.split('\n');

      if (e.key === 'ArrowUp' && caretPosition === 0) {
        // Move to the end of the last line when Arrow Up is pressed at the beginning
        const lastLine = lines[lines.length - 1];
        input.setSelectionRange(input.value.length, input.value.length);
        input.scrollTop = input.scrollHeight;
      } else if (e.key === 'ArrowDown' && caretPosition === input.value.length) {
        // Move to the beginning of the first line when Arrow Down is pressed at the end
        input.setSelectionRange(0, 0);
        input.scrollTop = 0;
      }
    }
  };

  const renderReplyingMessage = (message) => {
    return (
      <div className={classes.replyginMsgWrapper}>
        <div className={classes.replyginMsgContainer}>
          <span
            className={clsx(classes.replyginContactMsgSideColor, {
              [classes.replyginSelfMsgSideColor]: !message.fromMe,
            })}
          ></span>
          <div className={classes.replyginMsgBody}>
            {!message.fromMe && (
              <span className={classes.messageContactName}>
                {message.contact?.name}
              </span>
            )}
            {message.body}
          </div>
        </div>
        <IconButton
          aria-label="showRecorder"
          component="span"
          disabled={loading || (ticketStatus !== "open" && ticketStatus !== "group")}
          onClick={() => setReplyingMessage(null)}
        >
          <ClearIcon className={classes.sendMessageIcons} />
        </IconButton>
      </div>
    );
  };

  if (medias.length > 0)
    return (
      <Paper 
        elevation={0} 
        square 
        className={classes.viewMediaInputWrapper}
        onDragEnter={() => setOnDragEnter(true)}
        onDrop={(e) => handleInputDrop(e)}
      >
        <IconButton
          aria-label="cancel-upload"
          component="span"
          onClick={(e) => setMedias([])}
        >
          <CancelIcon className={classes.sendMessageIcons} />
        </IconButton>

        {loading ? (
          <div>
            <CircularProgress className={classes.circleLoading} />
          </div>
        ) : (
          <Grid item className={classes.gridFiles}>
            <Typography variant="h6" component="div">
              {i18n.t("uploads.titles.titleFileList")} ({medias.length})
            </Typography>
            <List>
              {medias.map((value, index) => {
                return (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar className={classes.avatar} alt={value.name} src={URL.createObjectURL(value)} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${value.name}`}
                      secondary={`${parseInt(value.size / 1024)} kB`}
                    />
                  </ListItem>
                );
              })}
            </List>
            <InputBase
              style={{ width: "0", height: "0" }}
              inputRef={function (input) {
                if (input != null) {
                  input.focus();
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUploadMedia(e);
                }
              }}
              defaultValue={medias[0].name}
            />
          </Grid>
        )}
        <IconButton
          aria-label="send-upload"
          component="span"
          onClick={handleUploadMedia}
          disabled={loading}
        >
          <SendIcon className={classes.sendMessageIcons} />
        </IconButton>
      </Paper>
    );
  else {
    return (
      <Paper 
        square elevation={0} 
        className={classes.mainWrapper}
        onDragEnter={() => setOnDragEnter(true)}
        onDrop={(e) => handleInputDrop(e)}
      >
        <div className={onDragEnter ? classes.dropInfo : classes.dropInfoOut}>
          {i18n.t("uploads.titles.titleUploadMsgDragDrop")}
        </div>
        {replyingMessage && renderReplyingMessage(replyingMessage)}
        <div className={classes.newMessageBox}>
          <EmojiOptions
            disabled={disableOption()}
            handleAddEmoji={handleAddEmoji}
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
          />
          <br/>
          <input
              multiple
              type="file"
              id="upload-button"
              disabled={loading || recording || (ticketStatus !== "open" && ticketStatus !== "group")}
              className={classes.uploadInput}
              onChange={handleChangeMedias}
            />
            <label htmlFor="upload-button">
              <IconButton
                aria-label="upload"
                component="span"
                disabled={loading || recording || (ticketStatus !== "open" && ticketStatus !== "group")}
                // onMouseOver={() => setOnDragEnter(true)}
              >
                <AttachFile className={classes.sendMessageIcons} />
              </IconButton>
            </label>

           {signMessagePar && (
            <Tooltip title="Habilitar/Desabilitar Assinatura">
                <IconButton 
                  aria-label="send-upload"
                  component="span"
                  onClick={handleChangeSign}
                  
                >
                {signMessage === true ? <Create style={{ color: "#065183" }} /> : <Create style={{ color: "grey" }} />}
              </IconButton>
            </Tooltip>
            )}
          <Tooltip title="Habilitar/Desabilitar Comentários">
            <IconButton 
                aria-label="send-upload"
                component="span"
                onClick={handlePrivateMessage}
              >
              {privateMessage === true ? <Comment style={{ color: "#065183" }} /> : <Comment style={{ color: "grey" }} />}
            </IconButton>
          </Tooltip>            

          <CustomInput
            loading={loading}
            inputRef={inputRef}
            ticketStatus={ticketStatus}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            // handleChangeInput={handleChangeInput}
            handleSendMessage={handleSendMessage}
            handleInputPaste={handleInputPaste}
            disableOption={disableOption}
          />

          <ActionButtons
            inputMessage={inputMessage}
            loading={loading}
            recording={recording}
            ticketStatus={ticketStatus}
            handleSendMessage={handleSendMessage}
            handleCancelAudio={handleCancelAudio}
            handleUploadAudio={handleUploadAudio}
            handleStartRecording={handleStartRecording}
          />
        </div>
      </Paper>
    );
  }
};

export default MessageInputCustom;
