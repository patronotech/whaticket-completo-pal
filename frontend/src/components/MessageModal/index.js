import React, { useState, useEffect, useContext, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { toast } from "react-toastify";

import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControl, Grid, InputLabel } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: "35ch",

      [theme.breakpoints.down("sm")]: {
        width: "100%",

        "& > *": {
          width: "100%",

          "& > *": {
            width: "100%",
          },
        },
      },
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  colorAdorment: {
    width: 20,
    height: 20,
  },
}));

const PurpleCheckbox = withStyles({
  root: {
    color: "#b46df2",
    "&$checked": {
      color: "#b46df2",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const MessageModal = ({ open, onClose, messageId, reload }) => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const initialState = {
    nome: "",
    data_mensagem_programada: "",
    id_conexao: undefined,
    intervalo: 1,
    fileName: "",
    valor_intervalo: "0",
    mensagem: "",
    tipo_dias_envio: 4,
    mostrar_usuario_mensagem: false,
    criar_ticket: false,
    contatos: [],
    tags: [],
    usuario_envio: "",
    enviar_quantas_vezes: "0",
    file: undefined,
  };

  const initialConexoes = { id: "", name: "" };
  const initialCurrentUser = { id: "", name: "" };

  const [scheduleMessage, setScheduleMessage] = useState(initialState);

  // currents states
  const [currentConexao, setCurrentConexao] = useState(initialConexoes);
  const [currentContacts, setCurrentContacts] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);
  const [currentUsers, setCurrentUsers] = useState(initialCurrentUser);
  const [intervalo, setIntervalo] = useState([initialConexoes]);

  const [contatos, setContatos] = useState([]);
  const [tags, setTags] = useState([]);
  const [conexoes, setConexoes] = useState([initialConexoes]);
  const [usuarios, setUsuarios] = useState([]);
  /*   const [fileName, setFileName] = useState("");
   */

  const ScheduleMessageSchema = Yup.object().shape({
    nome: Yup.string().min(3, "Mensagem muito curta").required("Obrigatório"),
  });

  const handleClose = () => {
    setScheduleMessage(initialState);
    setCurrentConexao(initialConexoes);
    setCurrentContacts([]);
    setCurrentTags([]);
    setCurrentUsers([]);
    setIntervalo(initialState);
    setUsuarios([]);

    onClose();
  };

  const handleAttachmentFile = (e) => {
    const file = e.target.files[0];
    setScheduleMessage((prev) => ({ ...prev, file }));
  };

  useEffect(() => {
    try {
      (async () => {
        const { companyId } = user;

        const { data: connectionList } = await api.get(`/whatsapp`);
        setConexoes(connectionList);

        const { data: userList } = await api.get(`/users/list?companyId=${companyId}`);
        setUsuarios(userList);

        const { data: contactList } = await api.get('/contacts/list', { params: { companyId: companyId } });
        setContatos(contactList);

        // const { data: tagList } = await api.get('/tags/list', { params: { companyId: companyId, kanban: 0 } });
        // setTags(tagList);

        if (!!messageId) {
          const { data } = await api.get(`/schedules-message/${messageId}`);
          scheduleMessage.nome = data.nome;
          scheduleMessage.mensagem = data.mensagem;
          scheduleMessage.mostrar_usuario_mensagem = data.mostrar_usuario_mensagem;
          scheduleMessage.criar_ticket = data.criar_ticket;
          scheduleMessage.tipo_dias_envio = data.tipo_dias_envio;
          scheduleMessage.enviar_quantas_vezes = data.enviar_quantas_vezes;
          scheduleMessage.intervalo = data.intervalo;
          scheduleMessage.valor_intervalo = data.valor_intervalo;
          scheduleMessage.companyId = companyId;
          scheduleMessage.criar_ticket = data.criar_ticket;

          const data_agendada = moment(data.data_mensagem_programada);
          scheduleMessage.data_mensagem_programada = data_agendada.format("YYYY-MM-DD HH:mm:ss");

          if (!!data.mediaName) scheduleMessage.file = { name: data.mediaName };

          if (!!data.id_conexao && conexoes.length > 0) {
            const finded_conexao = conexoes.find(
              (_c) => _c.id == data.id_conexao
            );
            scheduleMessage.id_conexao = finded_conexao.id;
            setCurrentConexao(finded_conexao);
          }

          if (!!data.contatos && contatos.length > 0) {
            const finded_contacts = contatos.filter((_c) => {
              if (data.contatos.some((_dContacts) => +_dContacts == +_c.id))
                return _c;
            });
            scheduleMessage.contatos = finded_contacts.map((_fc) => _fc.id);
            setCurrentContacts(finded_contacts);
          }

          // if (!!data.tags && tags.length > 0) {
          //   const finded_tags = tags.filter((_t) => {
          //     if (data.tags.some((_dTags) => +_dTags == +_t.id)) return _t;
          //   });
          //   scheduleMessage.tags = finded_tags.map((_ft) => _ft.id);
          //   setCurrentTags(finded_tags);
          // }

          if (!!data.usuario_envio && usuarios.length > 0) {
            const finded_users = usuarios.find((_u) => +_u.id == +data.usuario_envio);
            scheduleMessage.usuario_envio = finded_users.id;
            setCurrentUsers(finded_users);
          }
          if (!!data.intervalo) {
            scheduleMessage.intervalo = data.intervalo;
          }

          setScheduleMessage({ ...scheduleMessage });
        }

        return;
      })();
    } catch (err) {
      toastError(err);
    }
  }, [messageId, open]);

  const handleSaveSchedulesMessage = async (values) => {
    try {
      const { companyId } = user;
      scheduleMessage.companyId = companyId;

      const formData = new FormData();

      for (const [key, value] of Object.entries(scheduleMessage)) {
        switch (key) {
          case "data_mensagem_programada":
            formData.append(key, moment(value).format("YYYY-MM-DD HH:mm:ss"));
            break;

          default:
            formData.append(key, value);
            break;
        }
      }
      if (!!messageId) {
        const responseUpdate = await api.put(`/schedules-message/${messageId}`, formData);
        toast.success(i18n.t("messageModal.success.save"));
        handleClose();
        reload();
      } else {
        const response = await api.post("/schedules-message", formData);
        console.log(response);
        toast.success(i18n.t("messageModal.success.save"));
        handleClose();
        reload();
      }

    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {messageId
            ? `${i18n.t("messageModal.title.edit")}`
            : `${i18n.t("messageModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={scheduleMessage}
          enableReinitialize={true}
          validationSchema={ScheduleMessageSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveSchedulesMessage(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={4} xl={4}>
                    <Field
                      as={TextField}
                      label="Nome"
                      name="nome"
                      error={touched.nome && Boolean(errors.nome)}
                      onChange={(e) =>
                        setScheduleMessage((prev) => ({
                          ...prev,
                          nome: e.target.value,
                        }))
                      }
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={4}>
                    <Field
                      as={TextField}
                      label={i18n.t("scheduleModal.form.sendAt")}
                      type="datetime-local"
                      name="data_mensagem_programada"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      onChange={(e) =>
                        setScheduleMessage((prev) => ({
                          ...prev,
                          data_mensagem_programada: e.target.value,
                        }))
                      }
                      error={touched.sendAt && Boolean(errors.sendAt)}
                      helperText={touched.sendAt && errors.sendAt}
                      variant="outlined"
                      fullWidth
                      style={{ marginTop: "8px" }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12} xl={12}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        fullWidth
                        value={currentConexao}
                        options={conexoes}
                        size="small"
                        onChange={(e, contact) => {
                          const contactId = contact ? contact.id : null;
                          setScheduleMessage({
                            ...scheduleMessage,
                            id_conexao: +contactId,
                          });
                          setCurrentConexao(contact ? contact : initialConexoes);
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) => {
                          return value.id === option.id;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Conexão"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12} xl={12}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        fullWidth
                        value={currentContacts}
                        multiple={true}
                        options={contatos}
                        size="small"
                        getOptionLabel={(option) => Array.isArray(option) ? "" : option.name}
                        onChange={(e, contacts) => {

                          if (contacts instanceof Array) {
                            setCurrentContacts(contacts)

                            setScheduleMessage((prev) => ({
                              ...prev,
                              contatos: contacts.map(_contact => {
                                return +_contact.id;
                              }),
                            }))
                          }

                        }}
                        getOptionSelected={(option, value) => {
                          return value.id === option.id;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Contatos"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12} md={12} xl={12}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        fullWidth
                        value={currentTags}
                        multiple={true}
                        options={tags}
                        size="small"
                        getOptionLabel={(option) => Array.isArray(option) ? "" : option.name}
                        onChange={(e, tags) => {

                          if (tags instanceof Array) {
                            setCurrentTags(tags)

                            setScheduleMessage((prev) => ({
                              ...prev,
                              tags: tags.map(_tag => {
                                return +_tag.id;
                              }),
                            }))
                          }

                        }}
                        getOptionSelected={(option, value) => {
                          return value.id === option.id;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Tags"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid> */}
                </Grid>
                {/* <br /> */}
                <h3>Recorrencia</h3>
                <p>
                  Você pode escolher enviar a mensagem de forma recorrente e
                  escolher o intervalo. Caso seja uma mensagem a ser enviada
                  uma unica vez, não altere nada nessa seção.
                </p>
                <br />
                <Grid container spacing={1}>
                  <Grid item xs={12} md={4} xl={4}>
                    <FormControl size="small" fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-label">Intervalo</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={scheduleMessage.intervalo}
                        onChange={(e) =>
                          setScheduleMessage((prev) => ({
                            ...prev,
                            intervalo: e.target.value,
                          }))
                        }
                        label="Intervalo"
                      >
                        <MenuItem value={1}>Dias</MenuItem>
                        <MenuItem value={2}>Semanas</MenuItem>
                        <MenuItem value={3}>Meses</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4} xl={4}>
                    <Field
                      as={TextField}
                      label="Valor do Intervalo"
                      name="valor_intervalo"
                      size="small"
                      error={touched.valor_intervalo && Boolean(errors.valor_intervalo)}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) =>
                        setScheduleMessage((prev) => ({
                          ...prev,
                          valor_intervalo: e.target.value,
                        }))
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={4}>
                    <Field
                      as={TextField}
                      label="Enviar quantas vezes"
                      name="enviar_quantas_vezes"
                      size="small"
                      onChange={(e) =>
                        setScheduleMessage((prev) => ({
                          ...prev,
                          enviar_quantas_vezes: e.target.value,
                        }))
                      }
                      error={
                        touched.enviar_quantas_vezes &&
                        Boolean(errors.enviar_quantas_vezes)
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                  <FormControl size="small" fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-label">Enviar quantas vezes</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={scheduleMessage.tipo_dias_envio}
                        onChange={(e) =>
                          setScheduleMessage((prev) => ({
                            ...prev,
                            tipo_dias_envio: e.target.value,
                          }))
                        }
                        label="Enviar quantas vezes"
                      >
                        <MenuItem value={4}>Enviar normalmente em dias não úteis</MenuItem>
                      <MenuItem value={5}>Enviar um dia útil antes</MenuItem>
                      <MenuItem value={6}>Enviar um dia útil depois</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <PurpleCheckbox
                          name="mostrar_usuario_mensagem"
                          checked={scheduleMessage.mostrar_usuario_mensagem}
                          onChange={(e) => {

                            if (!e.target.checked) {
                              setScheduleMessage((prev) => ({
                                ...prev,
                                mostrar_usuario_mensagem: e.target.checked,
                                usuario_envio: undefined
                              }));

                              setCurrentUsers(null)
                            } else {
                              setScheduleMessage((prev) => ({
                                ...prev,
                                mostrar_usuario_mensagem: e.target.checked,
                              }));
                            }

                          }

                          }
                        />
                      }
                      label="Mostrar Usuário"
                    />
                  </FormControl>

                  {scheduleMessage.mostrar_usuario_mensagem === true ? (
                    <Grid item xs={12} md={12} xl={12}>
                      <Autocomplete
                        fullWidth
                        value={currentUsers}
                        options={usuarios}
                        onChange={(e, usuario) => {
                          const usuarioId = usuario ? usuario.id : null;
                          setScheduleMessage({
                            ...scheduleMessage,
                            usuario_envio: +usuarioId,
                          });
                          setCurrentUsers(usuario ? usuario : initialCurrentUser);
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) => {
                          return value.id === option.id;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Usuarios"
                            required={scheduleMessage.mostrar_usuario_mensagem}
                          />
                        )}
                      />
                    </Grid>
                  ) : null}

                  <FormControl>
                    <FormControlLabel
                      control={
                        <PurpleCheckbox
                          name="criar_ticket"
                          checked={scheduleMessage.criar_ticket}
                          onChange={(e) =>
                            setScheduleMessage((prev) => ({
                              ...prev,
                              criar_ticket: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Criar Ticket "
                    />
                  </FormControl>
                </Grid>

                <br />
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12} xl={12}>
                    <Field
                      as={TextField}
                      rows={9}
                      multiline={true}
                      label={i18n.t("scheduleModal.form.body")}
                      name="mensagem"
                      helperText={ErrorMessage.mensagem}
                      error={touched.mensagem && Boolean(errors.mensagem)}
                      onChange={(e) =>
                        setScheduleMessage((prev) => ({
                          ...prev,
                          mensagem: e.target.value,
                        }))
                      }
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  startIcon={<AttachFileIcon />}
                >
                  Anexar arquivo
                  <input
                    type="file"
                    hidden
                    onChange={handleAttachmentFile}
                    accept="image/*"
                  />
                </Button>

                {scheduleMessage?.file?.name && (
                  <>
                    <div>
                      <h4>Arquivo anexado: {scheduleMessage?.file?.name}</h4>
                    </div>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("scheduleModal.buttons.cancel")}
                </Button>
                {scheduleMessage.nome != "" && (
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    variant="contained"
                    className={classes.btnWrapper}
                  >
                    {messageId
                      ? `${i18n.t("scheduleModal.buttons.okEdit")}`
                      : `${i18n.t("scheduleModal.buttons.okAdd")}`}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div >
  );
};

export default MessageModal;
