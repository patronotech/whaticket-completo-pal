import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import api from "../../services/api";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import { CircularProgress, Grid, IconButton, InputLabel, MenuItem, Select, Checkbox } from "@material-ui/core";
import { Formik, Field, FieldArray } from "formik";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import SaveIcon from "@material-ui/icons/Save";
import TextField from "@material-ui/core/TextField";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import CustomToolTip from "../ToolTips";
import ConfirmationModal from "../ConfirmationModal";
import { i18n } from "../../translate/i18n";
import Switch from "@material-ui/core/Switch";
import { FormControlLabel, FormControl } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import useQueues from "../../hooks/useQueues";
import UserStatusIcon from "../UserModal/statusIcon";

const QueueSchema = Yup.object().shape({
  options: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().min(4, "too short").required("Required"),
      })
    )
    .required("Must have friends"),
});

const useStyles = makeStyles((theme) => ({
  greetingMessage: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  Box: {
    cursor: "pointer",
    alignItems: "center",
  },
  textField1: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  customHeight: {
    height: '48px',
  },
}));

function getStepContent(step) {
  return <VerticalLinearStepper chatBotId={step} />;
}

export default function VerticalLinearStepper(props) {
  const initialState = {
    name: "",
    greetingMessage: "",
    options: [],
    closeTicket: false,
    optQueueId: ""
  };

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(-1);
  const [steps, setSteps] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isStepContent, setIsStepContent] = useState(true);
  const [isNameEdit, setIsNamedEdit] = useState(null);
  const [isGreetingMessageEdit, setGreetingMessageEdit] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [queues, setQueues] = useState([]);
  const [users, setUsers] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [file, setFile] = useState([]);
  const { user } = useContext(AuthContext);
  const [searchParam, setSearchParam] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState("");
  const [selectedQueueOption, setSelectedQueueOption] = useState("");

  const { findAll: findAllQueues } = useQueues();
  const [allQueues, setAllQueues] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const isMounted = useRef(true);

  const companyId = user.companyId;

  const handleSaveBot = async (values) => {
    try {
      if (props.chatBotId) {
        await api.put(`/chatbot/${props.chatBotId}`, values);
      } else {
        await api.post("/chatbot", values);
      }
      toast.success("Bot saved successfully");
      // setActiveStep(-1)
      const { data } = await api.get(`/chatbot/${props.chatBotId}`);

      setSteps(initialState);
      setSteps(data);
      setIsNamedEdit(null);
      setGreetingMessageEdit(null);

      setSteps(data);
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      const loadQueues = async () => {
        const list = await findAllQueues();
        setAllQueues(list);
        setQueues(list);

      };
      loadQueues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/files/", {
          params: { companyId }
        });

        setFile(data.files);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchParam.length < 3) {
      setLoading(false);
      setSelectedQueueOption("");
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      //setLoading(true);
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/");
          setUserOptions(data.users);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };

      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queueIntegration", {
          params: { companyId }
        });

        setIntegrations(data.queueIntegrations);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      const fetchList = async () => {
        try {
          const { data } = await api.get(`/chatbot/${props.chatBotId}`);

          if (data?.user)
            setSelectedUser(data.user);

          if (data.optQueueId !== null && data.optQueueId !== undefined)
            setSelectedQueueOption(data.optQueueId)

          setSteps(data);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      fetchList();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [props.chatBotId]);

  useEffect(() => {
    if (steps.options[activeStep])
      setSelectedQueueOption(steps.options[activeStep]?.optQueueId)

    if (activeStep === isNameEdit) {
      setIsStepContent(false);
    } else {
      setIsStepContent(true);
    }
  }, [isNameEdit, activeStep]);

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const filterOptions = createFilterOptions({
    trim: true,
  });

  const handleDeleteQueue = async (queueId) => {
    try {
      await api.delete(`/chatbot/${queueId}`);
      const { data } = await api.get(`/chatbot/${props.chatBotId}`);
      setSteps(initialState);
      setSteps(data);
      setIsNamedEdit(null);
      setGreetingMessageEdit(null);
      setSteps(data);
      toast.success(i18n.t("Queue deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedQueue(null);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${selectedQueue.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("Tem certeza? Todas as opções internas também serão excluídas")}
      </ConfirmationModal>

      {!loading && (
        <div>
          <Formik
            initialValues={steps}
            validateOnChange={false}
            enableReinitialize={true}
            validationSchema={QueueSchema}
            render={({
              touched,
              errors,
              isSubmitting,
              values,
              setFieldValue,
            }) => (
              <FieldArray name="options">
                {({ push, remove }) => (
                  <>
                    <Stepper
                      nonLinear
                      activeStep={activeStep}
                      orientation="vertical"
                    >
                      {values.options &&
                        values.options.length > 0 &&
                        values.options.map((info, index) => (
                          <Step
                            key={`${info.id ? info.id : index}-options`}
                            onClick={() => setActiveStep(index)}
                          >
                            <StepLabel key={`${info.id}-options`}>
                              {isNameEdit !== index &&
                                steps.options[index]?.name ? (
                                <div
                                  className={classes.greetingMessage}
                                  variant="body1"
                                >
                                  {values.options[index].name}

                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setIsNamedEdit(index);
                                      setIsStepContent(false);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => {
                                      setSelectedQueue(info);
                                      setConfirmModalOpen(true);
                                    }}
                                    size="small"
                                  >
                                    <DeleteOutline />
                                  </IconButton>
                                </div>
                              ) : (
                                <Grid container spacing={2}>
                                  <Grid xs={12} md={12} item>
                                    <Field
                                      as={TextField}
                                      name={`options[${index}].name`}
                                      variant="outlined"
                                      margin="dense"
                                      label={i18n.t("queueModal.form.greetingMessage")}
                                      color="primary"
                                      disabled={isSubmitting}
                                      autoFocus
                                      fullWidth
                                      error={
                                        touched?.options?.[index]?.name &&
                                        Boolean(errors.options?.[index]?.name)
                                      }
                                    //className={classes.textField}
                                    />
                                  </Grid>
                                  <Grid xs={12} md={8} item>
                                    <FormControl
                                      variant="outlined"
                                      margin="dense"
                                      className={classes.FormControl}
                                      fullWidth
                                    >
                                      <InputLabel id="queueType-selection-label">{i18n.t("queueModal.form.queueType")}</InputLabel>
                                      <Field
                                        as={Select}
                                        name={`options[${index}].queueType`}
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        labelId="queueType-selection-label"
                                        label={i18n.t("queueModal.form.queueType")}
                                        error={touched?.options?.[index]?.queueType &&
                                          Boolean(errors?.options?.[index]?.queueType)}
                                      // helpertext={touched?.options?.[index]?.queueType && errors?.options?.[index]?.queueType}
                                      // value={`chatbots[${index}].queueType`}
                                      //className={classes.textField1}
                                      >
                                        <MenuItem value={"text"}>Texto</MenuItem>
                                        <MenuItem value={"attendent"}>Atendente</MenuItem>
                                        <MenuItem value={"queue"}>Fila</MenuItem>
                                        <MenuItem value={"integration"}>Integração</MenuItem>
                                        <MenuItem value={"file"}>Arquivo</MenuItem>
                                      </Field>
                                    </FormControl>
                                  </Grid>
                                  <Grid xs={12} md={4} item>
                                    <FormControlLabel
                                      control={
                                        <Field
                                          as={Checkbox}
                                          color="primary"
                                          name={`options[${index}].closeTicket`}
                                          checked={values.options[index].closeTicket || false}
                                        />
                                      }
                                      labelPlacement="top"
                                      label={i18n.t("queueModal.form.closeTicket")}
                                    />
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        values.options[index].name
                                          ? handleSaveBot(values)
                                          : null
                                      }
                                      disabled={isSubmitting}
                                    >
                                      <SaveIcon />
                                    </IconButton>

                                    <IconButton
                                      size="small"
                                      onClick={() => remove(index)}
                                      disabled={isSubmitting}
                                    >
                                      <DeleteOutline />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              )}
                            </StepLabel>

                            {isStepContent && steps.options[index] && (
                              <StepContent>
                                <>
                                  <CustomToolTip
                                    title="A mensagem é obrigatória para seguir ao próximo nível"
                                    content="Se a mensagem não estiver definida, o bot não seguirá adiante"
                                  >
                                    <HelpOutlineOutlinedIcon
                                      color="secondary"
                                      style={{ marginLeft: "4px" }}
                                      fontSize="small"
                                    />
                                  </CustomToolTip>
                                  {isGreetingMessageEdit !== index ? (
                                    <div className={classes.greetingMessage}>
                                      <Typography
                                        color="textSecondary"
                                        variant="body1"
                                      >
                                        Message:
                                      </Typography>

                                      {values.options[index].greetingMessage}

                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          setGreetingMessageEdit(index)
                                        }
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </div>
                                  ) : (
                                    <Grid spacing={2} container>
                                      <div
                                        className={classes.greetingMessage}
                                      >
                                        {steps.options[index].queueType === "text" && (
                                          <Grid xs={12} md={12} item>
                                            <Field
                                              as={TextField}
                                              name={`options[${index}].greetingMessage`}
                                              variant="outlined"
                                              margin="dense"
                                              color="primary"
                                              fullWidth
                                              multiline
                                              error={
                                                touched.greetingMessage &&
                                                Boolean(errors.greetingMessage)
                                              }
                                              helperText={
                                                touched.greetingMessage &&
                                                errors.greetingMessage
                                              }
                                              className={classes.textField}
                                            />

                                          </Grid>
                                        )}
                                      </div>

                                      {steps.options[index].queueType === "queue" && (
                                        <>
                                          <Grid xs={12} md={12} item>
                                            <Field
                                              as={TextField}
                                              name={`options[${index}].greetingMessage`}
                                              label={i18n.t("queueModal.form.message")}
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              multiline
                                              error={
                                                touched.greetingMessage &&
                                                Boolean(errors.greetingMessage)
                                              }
                                              helperText={
                                                touched.greetingMessage &&
                                                errors.greetingMessage
                                              }
                                              className={classes.textField}
                                            />
                                          </Grid>
                                          <Grid xs={12} md={8} item>
                                            <FormControl
                                              variant="outlined"
                                              margin="dense"
                                              className={classes.FormControl}
                                              fullWidth
                                            >
                                              <InputLabel id="queue-selection-label">{i18n.t("queueModal.form.queue")}</InputLabel>
                                              <Field
                                                as={Select}
                                                name={`options[${index}].optQueueId`}
                                                labelId="queue-selection-label"
                                                label={i18n.t("queueModal.form.queue")}
                                                error={touched?.options?.[index]?.optQueueId &&
                                                  Boolean(errors?.options?.[index]?.optQueueId)}
                                                helpertext={touched?.options?.[index]?.optQueueId && errors?.options?.[index]?.optQueueId}
                                                // value={`options[${index}].optQueueId`}
                                                fullWidth
                                                variant="outlined"
                                                margin="dense"
                                              >
                                                {queues.map(queue => (
                                                  <MenuItem key={queue.id} value={queue.id}>
                                                    {queue.name}
                                                  </MenuItem>
                                                ))}
                                              </Field>
                                            </FormControl>
                                          </Grid>
                                        </>
                                      )}
                                      {steps.options[index].queueType === "attendent" && (
                                        <>
                                          <Grid xs={12} md={12} item>
                                            <Field
                                              as={TextField}
                                              name={`options[${index}].greetingMessage`}
                                              label={i18n.t("queueModal.form.message")}
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              multiline
                                              error={
                                                touched.greetingMessage &&
                                                Boolean(errors.greetingMessage)
                                              }
                                              helperText={
                                                touched.greetingMessage &&
                                                errors.greetingMessage
                                              }
                                              className={classes.textField}
                                            />
                                          </Grid>
                                          {/* SELECIONAR USUARIO */}
                                          <Grid xs={12} md={4} item>
                                            <Autocomplete
                                              style={{ marginTop: '8px' }}
                                              variant="outlined"
                                              margin="dense"
                                              getOptionLabel={(option) => `${option.name}`}
                                              value={steps.options[index].user}
                                              onChange={(e, newValue) => {
                                                setSelectedUser(newValue);
                                                if (newValue != null) {
                                                  setFieldValue(`options[${index}].optUserId`, newValue.id);
                                                } else {
                                                  setFieldValue(`options[${index}].optUserId`, null);

                                                }
                                                if (newValue != null && Array.isArray(newValue.queues)) {
                                                  if (newValue.queues.length === 1) {
                                                    setSelectedQueueOption(newValue.queues[0].id);
                                                    setFieldValue(`options[${index}].optQueueId`, newValue.queues[0].id);
                                                  }
                                                  setQueues(newValue.queues);

                                                } else {
                                                  setQueues(allQueues);
                                                  setSelectedQueueOption("");
                                                }
                                              }}
                                              options={userOptions}
                                              filterOptions={filterOptions}
                                              freeSolo
                                              fullWidth
                                              autoHighlight
                                              noOptionsText={i18n.t("transferTicketModal.noOptions")}
                                              loading={loading}
                                              size="small"
                                              renderOption={option => (<span> <UserStatusIcon user={option} /> {option.name}</span>)}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label={i18n.t("transferTicketModal.fieldLabel")}
                                                  variant="outlined"
                                                  onChange={(e) => setSearchParam(e.target.value)}
                                                  InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                      <Fragment>
                                                        {loading ? (
                                                          <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                      </Fragment>
                                                    ),
                                                  }}
                                                />
                                              )}
                                            />
                                          </Grid>
                                          <Grid xs={12} md={4} item>
                                            <FormControl
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              className={classes.formControl}
                                            >
                                              <InputLabel>
                                                {i18n.t("transferTicketModal.fieldQueueLabel")}
                                              </InputLabel>
                                              <Select
                                                value={selectedQueueOption}
                                                onChange={(e) => {
                                                  setSelectedQueueOption(e.target.value)
                                                  setFieldValue(`options[${index}].optQueueId`, e.target.value);
                                                }}
                                                label={i18n.t("transferTicketModal.fieldQueuePlaceholder")}
                                              >
                                                {queues.map((queue) => (
                                                  <MenuItem key={queue.id} value={queue.id}>
                                                    {queue.name}
                                                  </MenuItem>
                                                ))}
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                        </>
                                      )}
                                      {steps.options[index].queueType === "integration" && (
                                        <>
                                          <Grid xs={12} md={12} item>
                                            <Field
                                              as={TextField}
                                              name={`options[${index}].greetingMessage`}
                                              label={i18n.t("queueModal.form.message")}
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              multiline
                                              error={
                                                touched.greetingMessage &&
                                                Boolean(errors.greetingMessage)
                                              }
                                              helperText={
                                                touched.greetingMessage &&
                                                errors.greetingMessage
                                              }
                                              className={classes.textField}
                                            />
                                          </Grid>
                                          <Grid xs={12} md={8} item>
                                            <FormControl
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              className={classes.formControl}
                                            >
                                              <InputLabel id="optIntegrationId-selection-label">
                                                {i18n.t("queueModal.form.integration")}
                                              </InputLabel>
                                              <Field
                                                as={Select}
                                                name={`options[${index}].optIntegrationId`}
                                                labelId="optIntegrationId-selection-label"
                                                label={i18n.t("queueModal.form.integration")}
                                                variant="outlined"
                                                margin="dense"
                                                fullWidth
                                                error={touched?.options?.[index]?.optIntegrationId &&
                                                  Boolean(errors?.options?.[index]?.optIntegrationId)}
                                                helpertext={touched?.options?.[index]?.optIntegrationId && errors?.options?.[index]?.optIntegrationId}
                                              // value={`options[${index}].optQueueId`}
                                              >
                                                {integrations.map(integration => (
                                                  <MenuItem key={integration.id} value={integration.id}>
                                                    {integration.name}
                                                  </MenuItem>
                                                ))}
                                              </Field>
                                            </FormControl>
                                          </Grid>
                                        </>
                                      )}
                                      {steps.options[index].queueType === "file" && (
                                        <>
                                          <Grid xs={12} md={12} item>
                                            <Field
                                              as={TextField}
                                              name={`options[${index}].greetingMessage`}
                                              label={i18n.t("queueModal.form.message")}
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              multiline
                                              error={
                                                touched.greetingMessage &&
                                                Boolean(errors.greetingMessage)
                                              }
                                              helperText={
                                                touched.greetingMessage &&
                                                errors.greetingMessage
                                              }
                                              className={classes.textField}
                                            />
                                          </Grid>

                                          <Grid xs={12} md={8} item>
                                            <FormControl
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              className={classes.formControl}
                                            >
                                              <InputLabel id="optFileId-selection-label">
                                                {i18n.t("queueModal.form.file")}
                                              </InputLabel>
                                              <Field
                                                as={Select}
                                                name={`options[${index}].optFileId`}
                                                labelId="optFileId-selection-label"
                                                label={i18n.t("queueModal.form.file")}
                                                error={touched?.options?.[index]?.optFileId &&
                                                  Boolean(errors?.options?.[index]?.optFileId)}
                                                helpertext={touched?.options?.[index]?.optFileId && errors?.options?.[index]?.optFileId}
                                                // value={`options[${index}].optQueueId`}
                                                variant="outlined"
                                                margin="dense"
                                              >
                                                {file.map(f => (
                                                  <MenuItem key={f.id} value={f.id}>
                                                    {f.name}
                                                  </MenuItem>
                                                ))}
                                              </Field>
                                            </FormControl>
                                          </Grid>
                                        </>
                                      )}
                                      <Grid xs={2} md={4} item>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleSaveBot(values)}
                                          disabled={isSubmitting}
                                          style={{ marginTop: '8px' }}
                                        >
                                          {" "}
                                          <SaveIcon />
                                        </IconButton>
                                      </Grid>
                                    </Grid>

                                  )}
                                  {getStepContent(info.id)}
                                </>
                              </StepContent>
                            )}
                          </Step>
                        ))}

                      <Step>
                        <StepLabel
                          onClick={() =>
                            push({
                              name: undefined,
                              greetingMessage: undefined,
                            })
                          }
                        >
                          {i18n.t("fileModal.buttons.fileOptions")}
                        </StepLabel>
                      </Step>
                    </Stepper>
                  </>
                )}
              </FieldArray>
            )}
          />
        </div>
      )
      }
    </div >
  );
}
