import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { isNil } from "lodash";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Tab,
  Tabs,
  Paper,
  Box
} from "@material-ui/core";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import TabPanel from "../TabPanel";
import { Autorenew, FileCopy } from "@material-ui/icons";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import SchedulesForm from "../SchedulesForm";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4
  },

  multFieldLine: {
    marginTop: 12,
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },

  btnWrapper: {
    position: "relative",
  },
  importMessage: {
    marginTop: 12,
    marginBottom: 12,
    paddingBottom: 20,
    paddingTop: 3,
    padding: 12,
    border: "solid grey 2px",
    borderRadius: 4,
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },

  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  tokenRefresh: {
    minWidth: "auto",
    display: "flex", // Torna o botão flexível para alinhar o conteúdo
    alignItems: "center", // Alinha verticalmente ao centro
    justifyContent: "center", // Alinha horizontalmente ao centro
  },
}));

const SessionSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const WhatsAppModal = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const [autoToken, setAutoToken] = useState("");

  const inputFileRef = useRef(null);

  const [attachment, setAttachment] = useState(null)
  const [attachmentName, setAttachmentName] = useState('')

  const initialState = {
    name: "",
    greetingMessage: "",
    complationMessage: "",
    outOfHoursMessage: "",
    ratingMessage: "",
    isDefault: false,
    token: "",
    maxUseBotQueues: 3,
    provider: "beta",
    expiresTicket: 0,
    allowGroup: false,
    groupAsTicket: "disabled",
    timeUseBotQueues: '0',
    timeSendQueue: '0',
    sendIdQueue: 0,
    expiresTicketNPS: '0',
    expiresInactiveMessage: "",
    timeInactiveMessage: "",
    inactiveMessage: "",
    maxUseBotQueuesNPS: 3,
    whenExpiresTicket: 0,
    timeCreateNewTicket: 0,
    greetingMediaAttachment: "",
    importRecentMessages: "",
    importOldMessages: "",
    importOldMessagesGroups: "",
    integrationId: "",
  };
  const [whatsApp, setWhatsApp] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [queues, setQueues] = useState([]);
  const [tab, setTab] = useState("general");
  const [enableImportMessage, setEnableImportMessage] = useState(false);
  const [importOldMessagesGroups, setImportOldMessagesGroups] = useState(false);
  const [closedTicketsPostImported, setClosedTicketsPostImported] = useState(false);
  const [importOldMessages, setImportOldMessages] = useState(moment().add(-1, "days").format("YYYY-MM-DDTHH:mm"));
  const [importRecentMessages, setImportRecentMessages] = useState(moment().add(-1, "minutes").format("YYYY-MM-DDTHH:mm"));
  const [copied, setCopied] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);


  const [schedules, setSchedules] = useState([
    { weekday: i18n.t("queueModal.serviceHours.monday"), weekdayEn: "monday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.tuesday"), weekdayEn: "tuesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.wednesday"), weekdayEn: "wednesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.thursday"), weekdayEn: "thursday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.friday"), weekdayEn: "friday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: "Sábado", weekdayEn: "saturday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: "Domingo", weekdayEn: "sunday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
  ]);

  const { get: getSetting } = useCompanySettings();
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/prompt");
        setPrompts(data.prompts);
      } catch (err) {
        toastError(err);
      }
    })();
  }, [whatsAppId]);

  useEffect(() => {

    const fetchData = async () => {

      const setting = await getSetting({
        "column": "scheduleType"
      });
      setSchedulesEnabled(setting.scheduleType === "connection");
    }
    fetchData();
  }, []);

  const handleEnableImportMessage = async (e) => {
    setEnableImportMessage(e.target.checked);

  };

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`whatsapp-admin/${whatsAppId}?session=0`);
        setWhatsApp(data);
        setAttachmentName(data.greetingMediaAttachment);
        setAutoToken(data.token);
        data.promptId ? setSelectedPrompt(data.promptId) : setSelectedPrompt(null);
        const whatsQueueIds = data.queues?.map((queue) => queue.id);
        setSelectedQueueIds(whatsQueueIds);
        setSchedules(data.schedules)
        if (data?.importOldMessages) {
          setEnableImportMessage(true);
          setImportOldMessages(data?.importOldMessages);
          setImportRecentMessages(data?.importRecentMessages);
          setClosedTicketsPostImported(data?.closedTicketsPostImported);
          setImportOldMessagesGroups(data?.importOldMessagesGroups);
        }
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queue");
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queueIntegration");

        setIntegrations(data.queueIntegrations);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  const handleChangeQueue = (e) => {
    setSelectedQueueIds(e);
    setSelectedPrompt(null);
  };

  const handleChangePrompt = (e) => {
    setSelectedPrompt(e.target.value);
    setSelectedQueueIds([]);
  };

  const handleSaveWhatsApp = async (values) => {
    if (!whatsAppId) setAutoToken(generateRandomCode(30));
   
    if ((!isNil(values.ratingMessage) && values.ratingMessage !== '') && (values.expiresTicketNPS === '0' || values.expiresTicketNPS === '' || values.expiresTicketNPS === 0)) {
      toastError(i18n.t("whatsappModal.errorExpiresNPS"));
      return;
    }

    if (!isNil(values.ratingMessage) && (values.expiresTicketNPS === '0' || values.expiresTicketNPS === '')) {
      toastError(i18n.t("whatsappModal.errorExpiresNPS"));
      return;
    }
    if (values.timeSendQueue === '') values.timeSendQueue = '0'
    
    if  ((values.sendIdQueue === 0 || values.sendIdQueue === '' || isNil(values.sendIdQueue)) &&  (values.timeSendQueue !== 0 && values.timeSendQueue !== '0')) {
      toastError(i18n.t("whatsappModal.errorSendQueue"));
      return;
    }

    const whatsappData = {
      ...values, queueIds: selectedQueueIds,
      importOldMessages: enableImportMessage ? importOldMessages : null,
      importRecentMessages: enableImportMessage ? importRecentMessages : null,
      importOldMessagesGroups: importOldMessagesGroups ? importOldMessagesGroups : null,
      closedTicketsPostImported: closedTicketsPostImported ? closedTicketsPostImported : null,
      token: autoToken ? autoToken : null, schedules,
      promptId: selectedPrompt ? selectedPrompt : null
    };
    delete whatsappData["queues"];
    delete whatsappData["session"];

    try {
      if (whatsAppId) {
        if (whatsAppId && enableImportMessage && whatsApp?.status === "CONNECTED") {
          toast.warning(
            i18n.t("userModal.warning.updateImage"),
            { autoClose: false }
          );
          try {
            setWhatsApp({ ...whatsApp, status: "qrcode" });
            await api.delete(`/whatsappsession/${whatsApp.id}`);
          } catch (err) {
            toastError(err);
          }
        }

        await api.put(`/whatsapp/${whatsAppId}`, whatsappData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/whatsapp/${whatsAppId}/media-upload`, formData);
        }
        if (!attachmentName && (whatsApp.greetingMediaAttachment !== null)) {
          await api.delete(`/whatsapp/${whatsAppId}/media-upload`);
        }
      } else {
        const { data } = await api.post("/whatsapp", whatsappData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/whatsapp/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("whatsappModal.success"));

      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  function generateRandomCode(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyvz0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset.charAt(randomIndex);
    }
    return code;
  }

  const handleRefreshToken = () => {
    setAutoToken(generateRandomCode(30));
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(autoToken); // Copia o token para a área de transferência    
    setCopied(true); // Define o estado de cópia como verdadeiro
  };

  const handleSaveSchedules = async (values) => {
    toast.success("Clique em salvar para registar as alterações");
    setSchedules(values);
  };

  const handleClose = () => {
    onClose();
    setWhatsApp(initialState);
    // inputFileRef.current.value = null
    setAttachment(null)
    setAttachmentName("")
    setCopied(false);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleFileUpload = () => {
    const file = inputFileRef.current.files[0];
    setAttachment(file)
    setAttachmentName(file.name)
    inputFileRef.current.value = null
  };

  const handleDeleFile = () => {
    setAttachment(null)
    setAttachmentName(null)
  }

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          {whatsAppId
            ? i18n.t("whatsappModal.title.edit")
            : i18n.t("whatsappModal.title.add")}
        </DialogTitle>
        <Formik
          initialValues={whatsApp}
          enableReinitialize={true}
          validationSchema={SessionSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveWhatsApp(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, touched, errors, isSubmitting }) => (
            <Form>
              <Paper className={classes.mainPaper} elevation={1}>
                <Tabs
                  value={tab}
                  indicatorColor="primary"
                  textColor="primary"
                  scrollButtons="on"
                  variant="scrollable"
                  onChange={handleTabChange}
                  className={classes.tab}
                >
                  <Tab label={i18n.t("whatsappModal.tabs.general")} value={"general"} />
                  <Tab label={i18n.t("whatsappModal.tabs.integrations")} value={"integrations"} />
                  <Tab label={i18n.t("whatsappModal.tabs.messages")} value={"messages"} />
                  <Tab label="Chatbot" value={"chatbot"} />
                  <Tab label={i18n.t("whatsappModal.tabs.assessments")} value={"nps"} />
                  {schedulesEnabled && <Tab label={i18n.t("whatsappModal.tabs.schedules")} value={"schedules"} />}
                </Tabs>
              </Paper>
              <Paper className={classes.paper} elevation={0}>
                <TabPanel
                  className={classes.container}
                  value={tab}
                  name={"general"}
                >
                  <DialogContent dividers>
                    {attachmentName && (
                      <div
                        style={{ display: 'flex', flexDirection: 'row-reverse' }}
                      >
                        <Button
                          variant='outlined'
                          color="primary"
                          endIcon={<DeleteOutlineIcon />}
                          onClick={handleDeleFile}
                        >
                          {attachmentName}
                        </Button>
                      </div>
                    )}
                    <div
                      style={{ display: 'flex', flexDirection: "column-reverse" }}
                    >
                      <input
                        type="file"
                        accept="video/*,image/*"
                        ref={inputFileRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                      <Button variant="contained" color="primary" onClick={() => inputFileRef.current.click()}>
                        {i18n.t("userModal.buttons.addImage")}
                      </Button>
                    </div>
                    {/* NOME E PADRAO */}
                    <div className={classes.multFieldLine}>
                      <Grid spacing={2} container>
                        <Grid item>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.name")}
                            autoFocus
                            name="name"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            variant="outlined"
                            margin="dense"
                            className={classes.textField}
                          />
                        </Grid>
                        <Grid style={{ paddingTop: 15 }} item>
                          <FormControlLabel
                            control={
                              <Field
                                as={Switch}
                                color="primary"
                                name="isDefault"
                                checked={values.isDefault}
                              />
                            }
                            label={i18n.t("whatsappModal.form.default")}
                          />
                          <FormControlLabel
                            control={
                              <Field
                                as={Switch}
                                color="primary"
                                name="allowGroup"
                                checked={values.allowGroup}
                              />
                            }
                            label={i18n.t("whatsappModal.form.group")}
                          />
                        </Grid>
                        <Grid xs={6} md={4} item>
                          <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            className={classes.formControl}
                          >
                            <InputLabel id="groupAsTicket-selection-label">{i18n.t("whatsappModal.form.groupAsTicket")}</InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("whatsappModal.form.groupAsTicket")}
                              placeholder={i18n.t("whatsappModal.form.groupAsTicket")}
                              labelId="groupAsTicket-selection-label"
                              id="groupAsTicket"
                              name="groupAsTicket"
                            >
                              <MenuItem value={"disabled"}>{i18n.t("whatsappModal.menuItem.disabled")}</MenuItem>
                              <MenuItem value={"enabled"}>{i18n.t("whatsappModal.menuItem.enabled")}</MenuItem>
                            </Field>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </div>


                    <div className={classes.importMessage}>
                      <div className={classes.multFieldLine}>
                        <FormControlLabel
                          style={{ marginRight: 7, color: "gray" }}
                          label={i18n.t("whatsappModal.form.importOldMessagesEnable")}
                          labelPlacement="end"
                          control={
                            <Switch
                              size="medium"
                              checked={enableImportMessage}
                              onChange={handleEnableImportMessage}
                              name="importOldMessagesEnable"
                              color="primary"
                            />
                          }
                        />

                        {enableImportMessage ? (
                          <>
                            <FormControlLabel
                              style={{ marginRight: 7, color: "gray" }}
                              label={i18n.t(
                                "whatsappModal.form.importOldMessagesGroups"
                              )}
                              labelPlacement="end"
                              control={
                                <Switch
                                  size="medium"
                                  checked={importOldMessagesGroups}
                                  onChange={(e) =>
                                    setImportOldMessagesGroups(e.target.checked)
                                  }
                                  name="importOldMessagesGroups"
                                  color="primary"
                                />
                              }
                            />

                            <FormControlLabel
                              style={{ marginRight: 7, color: "gray" }}
                              label={i18n.t(
                                "whatsappModal.form.closedTicketsPostImported"
                              )}
                              labelPlacement="end"
                              control={
                                <Switch
                                  size="medium"
                                  checked={closedTicketsPostImported}
                                  onChange={(e) =>
                                    setClosedTicketsPostImported(e.target.checked)
                                  }
                                  name="closedTicketsPostImported"
                                  color="primary"
                                />
                              }
                            />
                          </>) : <></>}
                      </div>

                      {enableImportMessage ? (
                        <Grid style={{ marginTop: 18 }} container spacing={3}>
                          <Grid item xs={6}>
                            <Field
                              fullWidth
                              as={TextField}
                              label={i18n.t("whatsappModal.form.importOldMessages")}
                              type="datetime-local"
                              name="importOldMessages"
                              inputProps={{
                                max: moment()
                                  .add(0, "minutes")
                                  .format("YYYY-MM-DDTHH:mm"),
                                min: moment()
                                  .add(-2, "years")
                                  .format("YYYY-MM-DDTHH:mm"),
                              }}
                              //min="2022-11-06T22:22:55"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={
                                touched.importOldMessages &&
                                Boolean(errors.importOldMessages)
                              }
                              helperText={
                                touched.importOldMessages && errors.importOldMessages
                              }
                              variant="outlined"
                              value={moment(importOldMessages).format(
                                "YYYY-MM-DDTHH:mm"
                              )}
                              onChange={(e) => {
                                setImportOldMessages(e.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Field
                              fullWidth
                              as={TextField}
                              label={i18n.t("whatsappModal.form.importRecentMessages")}
                              type="datetime-local"
                              name="importRecentMessages"
                              inputProps={{
                                max: moment()
                                  .add(0, "minutes")
                                  .format("YYYY-MM-DDTHH:mm"),
                                min: moment(importOldMessages).format(
                                  "YYYY-MM-DDTHH:mm"
                                )
                              }}
                              //min="2022-11-06T22:22:55"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={
                                touched.importRecentMessages &&
                                Boolean(errors.importRecentMessages)
                              }
                              helperText={
                                touched.importRecentMessages && errors.importRecentMessages
                              }
                              variant="outlined"
                              value={moment(importRecentMessages).format(
                                "YYYY-MM-DDTHH:mm"
                              )}
                              onChange={(e) => {
                                setImportRecentMessages(e.target.value);
                              }}
                            />
                          </Grid>
                        </Grid>

                      ) : null}
                    </div>
                    {enableImportMessage && (
                      <span style={{ color: "red" }}>
                        {i18n.t("whatsappModal.form.importAlert")}
                      </span>
                    )}


                    {/* TOKEN */}
                    <Box display="flex" alignItems="center">
                      <Grid xs={6} md={12} item>
                        <Field
                          as={TextField}
                          label={i18n.t("whatsappModal.form.token")}
                          type="token"
                          fullWidth
                          // name="token"
                          value={autoToken}
                          variant="outlined"
                          margin="dense"
                          disabled
                        />
                      </Grid>
                      <Button
                        onClick={handleRefreshToken}
                        disabled={isSubmitting}
                        className={classes.tokenRefresh}
                        variant="text"
                        startIcon={<Autorenew style={{ marginLeft: 5, color: "green" }} />}
                      />
                      <Button
                        onClick={handleCopyToken}
                        className={classes.tokenRefresh}
                        variant="text"
                        startIcon={<FileCopy style={{ color: copied ? "blue" : "inherit" }} />}
                      />
                    </Box>

                    <div>
                      <h3>{i18n.t("whatsappModal.form.queueRedirection")}</h3>
                      <p>{i18n.t("whatsappModal.form.queueRedirectionDesc")}</p>
                      <Grid spacing={2} container>

                        <Grid xs={6} md={6} item>
                          <FormControl
                            variant="outlined"
                            margin="dense"
                            className={classes.FormControl}
                            fullWidth
                          >
                            <InputLabel id="sendIdQueue-selection-label">
                              {i18n.t("whatsappModal.form.sendIdQueue")}
                            </InputLabel>
                            <Field
                              as={Select}
                              name="sendIdQueue"
                              id="sendIdQueue"
                              value={values.sendIdQueue || '0'}
                              label={i18n.t("whatsappModal.form.sendIdQueue")}
                              placeholder={i18n.t("whatsappModal.form.sendIdQueue")}
                              labelId="sendIdQueue-selection-label"
                            >
                              <MenuItem value={0}>&nbsp;</MenuItem>
                              {queues.map(queue => (
                                <MenuItem key={queue.id} value={queue.id}>
                                  {queue.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>

                        </Grid>

                        <Grid xs={6} md={6} item>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.timeSendQueue")}
                            fullWidth
                            name="timeSendQueue"
                            variant="outlined"
                            margin="dense"
                            error={touched.timeSendQueue && Boolean(errors.timeSendQueue)}
                            helperText={touched.timeSendQueue && errors.timeSendQueue}
                          />
                        </Grid>

                      </Grid>
                    </div>
                  </DialogContent>
                </TabPanel>
                <TabPanel
                  className={classes.container}
                  value={tab}
                  name={"integrations"}
                >
                  <DialogContent dividers>
                    {/* FILAS */}
                    <QueueSelect
                      selectedQueueIds={selectedQueueIds}
                      onChange={(selectedIds) => handleChangeQueue(selectedIds)}
                    />
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      className={classes.FormControl}
                      fullWidth
                    >
                      <InputLabel id="integrationId-selection-label">
                        {i18n.t("queueModal.form.integrationId")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("queueModal.form.integrationId")}
                        name="integrationId"
                        id="integrationId"
                        variant="outlined"
                        margin="dense"
                        placeholder={i18n.t("queueModal.form.integrationId")}
                        labelId="integrationId-selection-label"                        >
                        <MenuItem value={null} >{"Desabilitado"}</MenuItem>
                        {integrations.map((integration) => (
                          <MenuItem key={integration.id} value={integration.id}>
                            {integration.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                    <FormControl
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    >
                      <InputLabel>
                        {i18n.t("whatsappModal.form.prompt")}
                      </InputLabel>
                      <Select
                        labelId="dialog-select-prompt-label"
                        id="dialog-select-prompt"
                        name="promptId"
                        value={selectedPrompt || ""}
                        onChange={handleChangePrompt}
                        label={i18n.t("whatsappModal.form.prompt")}
                        fullWidth
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          getContentAnchorEl: null,
                        }}
                      >
                        {prompts.map((prompt) => (
                          <MenuItem
                            key={prompt.id}
                            value={prompt.id}
                          >
                            {prompt.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </DialogContent>
                </TabPanel>
                <TabPanel
                  className={classes.container}
                  value={tab}
                  name={"messages"}
                >
                  <DialogContent dividers>
                    {/* MENSAGEM DE SAUDAÇÃO */}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.greetingMessage")}
                        type="greetingMessage"
                        multiline
                        rows={4}
                        fullWidth
                        name="greetingMessage"
                        error={
                          touched.greetingMessage && Boolean(errors.greetingMessage)
                        }
                        helperText={
                          touched.greetingMessage && errors.greetingMessage
                        }
                        variant="outlined"
                        margin="dense"
                      />
                    </div>

                    {/* MENSAGEM DE CONCLUSÃO */}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.complationMessage")}
                        multiline
                        rows={4}
                        fullWidth
                        name="complationMessage"
                        error={
                          touched.complationMessage &&
                          Boolean(errors.complationMessage)
                        }
                        helperText={
                          touched.complationMessage && errors.complationMessage
                        }
                        variant="outlined"
                        margin="dense"
                      />
                    </div>

                    {/* MENSAGEM DE FORA DE EXPEDIENTE */}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.outOfHoursMessage")}
                        multiline
                        rows={4}
                        fullWidth
                        name="outOfHoursMessage"
                        error={touched.outOfHoursMessage && Boolean(errors.outOfHoursMessage)}
                        helperText={touched.outOfHoursMessage && errors.outOfHoursMessage}
                        variant="outlined"
                        margin="dense"
                      />
                    </div>
                  </DialogContent>
                </TabPanel>

                <TabPanel
                  className={classes.container}
                  value={tab}
                  name={"chatbot"}
                >
                  <DialogContent dividers>
                    <Grid spacing={2} container>
                      {/* TEMPO PARA CRIAR NOVO TICKET */}
                      <Grid xs={6} md={4} item>
                        <Field
                          as={TextField}
                          label={i18n.t("whatsappModal.form.timeCreateNewTicket")}
                          fullWidth
                          name="timeCreateNewTicket"
                          variant="outlined"
                          margin="dense"
                          error={touched.timeCreateNewTicket && Boolean(errors.timeCreateNewTicket)}
                          helperText={touched.timeCreateNewTicket && errors.timeCreateNewTicket}
                        />
                      </Grid>

                      {/* QUANTIDADE MÁXIMA DE VEZES QUE O CHATBOT VAI SER ENVIADO */}
                      <Grid xs={6} md={4} item>
                        <Field
                          as={TextField}
                          label={i18n.t("whatsappModal.form.maxUseBotQueues")}
                          fullWidth
                          name="maxUseBotQueues"
                          variant="outlined"
                          margin="dense"
                          error={touched.maxUseBotQueues && Boolean(errors.maxUseBotQueues)}
                          helperText={touched.maxUseBotQueues && errors.maxUseBotQueues}
                        />
                      </Grid>
                      {/* TEMPO PARA ENVIO DO CHATBOT */}
                      <Grid xs={6} md={4} item>
                        <Field
                          as={TextField}
                          label={i18n.t("whatsappModal.form.timeUseBotQueues")}
                          fullWidth
                          name="timeUseBotQueues"
                          variant="outlined"
                          margin="dense"
                          error={touched.timeUseBotQueues && Boolean(errors.timeUseBotQueues)}
                          helperText={touched.timeUseBotQueues && errors.timeUseBotQueues}
                        />
                      </Grid>
                    </Grid>
                    <Grid spacing={2} container>
                      {/* ENCERRAR CHATS ABERTOS APÓS X HORAS */}
                      <Grid xs={6} md={6} item>
                        <Field
                          as={TextField}
                          label={i18n.t("whatsappModal.form.expiresTicket")}
                          fullWidth
                          name="expiresTicket"
                          variant="outlined"
                          margin="dense"
                          error={touched.expiresTicket && Boolean(errors.expiresTicket)}
                          helperText={touched.expiresTicket && errors.expiresTicket}
                        />
                      </Grid>
                      {/* TEMPO PARA ENVIO DO CHATBOT */}
                      <Grid xs={6} md={6} item>
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.formControl}
                        >
                          <InputLabel id="whenExpiresTicket-selection-label">
                            {i18n.t("whatsappModal.form.whenExpiresTicket")}
                          </InputLabel>
                          <Field
                            as={Select}
                            label={i18n.t("whatsappModal.form.whenExpiresTicket")}
                            placeholder={i18n.t(
                              "whatsappModal.form.whenExpiresTicket"
                            )}
                            labelId="whenExpiresTicket-selection-label"
                            id="whenExpiresTicket"
                            name="whenExpiresTicket"
                          >
                            <MenuItem value={"0"}>{i18n.t("whatsappModal.form.closeLastMessageOptions1")}</MenuItem>
                            <MenuItem value={"1"}>{i18n.t("whatsappModal.form.closeLastMessageOptions2")}</MenuItem>
                          </Field>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {/* MENSAGEM POR INATIVIDADE*/}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.expiresInactiveMessage")}
                        multiline
                        rows={4}
                        fullWidth
                        name="expiresInactiveMessage"
                        error={touched.expiresInactiveMessage && Boolean(errors.expiresInactiveMessage)}
                        helperText={touched.expiresInactiveMessage && errors.expiresInactiveMessage}
                        variant="outlined"
                        margin="dense"
                      />
                    </div>

                    {/* TEMPO PARA ENVIO DE MENSAGEM POR INATIVIDADE */}
                    <Field
                      as={TextField}
                      label={i18n.t("whatsappModal.form.timeInactiveMessage")}
                      fullWidth
                      name="timeInactiveMessage"
                      variant="outlined"
                      margin="dense"
                      error={touched.timeInactiveMessage && Boolean(errors.timeInactiveMessage)}
                      helperText={touched.timeInactiveMessage && errors.timeInactiveMessage}
                    />
                    {/* MENSAGEM POR INATIVIDADE*/}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.inactiveMessage")}
                        multiline
                        rows={4}
                        fullWidth
                        name="inactiveMessage"
                        error={touched.inactiveMessage && Boolean(errors.inactiveMessage)}
                        helperText={touched.inactiveMessage && errors.inactiveMessage}
                        variant="outlined"
                        margin="dense"
                      />
                    </div>
                  </DialogContent>
                </TabPanel>
                <TabPanel
                  className={classes.container}
                  value={tab}
                  name={"nps"}
                >
                  <DialogContent dividers>
                    {/* MENSAGEM DE AVALIAÇAO*/}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.ratingMessage")}
                        multiline
                        rows={4}
                        fullWidth
                        name="ratingMessage"
                        error={touched.ratingMessage && Boolean(errors.ratingMessage)}
                        helperText={touched.ratingMessage && errors.ratingMessage}
                        variant="outlined"
                        margin="dense"
                      />
                    </div>
                    {/* QUANTIDADE MÁXIMA DE VEZES QUE O NPS VAI SER ENVIADO */}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.maxUseBotQueuesNPS")}
                        fullWidth
                        name="maxUseBotQueuesNPS"
                        variant="outlined"
                        margin="dense"
                        error={touched.maxUseBotQueuesNPS && Boolean(errors.maxUseBotQueuesNPS)}
                        helperText={touched.maxUseBotQueuesNPS && errors.maxUseBotQueuesNPS}
                      />
                    </div>
                    {/* ENCERRAR CHATS NPS APÓS X Minutos */}
                    <div>
                      <Field
                        as={TextField}
                        label={i18n.t("whatsappModal.form.expiresTicketNPS")}
                        fullWidth
                        name="expiresTicketNPS"
                        variant="outlined"
                        margin="dense"
                        error={touched.expiresTicketNPS && Boolean(errors.expiresTicketNPS)}
                        helperText={touched.expiresTicketNPS && errors.expiresTicketNPS}
                      />
                    </div>
                  </DialogContent>
                </TabPanel>
                <TabPanel
                  className={classes.container}
                  value={tab}
                  name={"schedules"}
                >
                  {tab === "schedules" && (
                    <Paper style={{ padding: 20 }}>
                      <SchedulesForm
                        loading={false}
                        onSubmit={handleSaveSchedules}
                        initialValues={schedules}
                        labelSaveButton={i18n.t("whatsappModal.buttons.okAdd")}
                      />
                    </Paper>
                  )}

                </TabPanel>
              </Paper>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("whatsappModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {whatsAppId
                    ? i18n.t("whatsappModal.buttons.okEdit")
                    : i18n.t("whatsappModal.buttons.okAdd")}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default React.memo(WhatsAppModal);