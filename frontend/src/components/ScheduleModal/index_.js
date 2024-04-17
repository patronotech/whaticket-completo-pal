import React, { useState, useEffect, useContext, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field, FieldArray } from "formik";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import moment from "moment"
import { AuthContext } from "../../context/Auth/AuthContext";
import { isArray, capitalize } from "lodash";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import AttachFile from "@material-ui/icons/AttachFile";
import { head } from "lodash";
import ConfirmationModal from "../ConfirmationModal";
import MessageVariablesPicker from "../MessageVariablesPicker";
import useQueues from "../../hooks/useQueues";
import UserStatusIcon from "../UserModal/statusIcon";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	// multFieldLine: {
	// 	display: "flex",
	// 	"& > *:not(:last-child)": {
	// 		marginRight: theme.spacing(1),
	// 	},
	// },

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
	// formControl: {
	// 	margin: theme.spacing(1),
	// 	minWidth: 120,
	// },
}));

const ScheduleSchema = Yup.object().shape({
	body: Yup.string()
		.min(5, "Mensagem muito curta")
		.required("Obrigatório"),
	contactId: Yup.number().required("Obrigatório"),
	sendAt: Yup.string().required("Obrigatório")
});

const ScheduleModal = ({ open, onClose, scheduleId, contactId, cleanContact, reload }) => {
	const classes = useStyles();
	const history = useHistory();
	const { user } = useContext(AuthContext);
	const isMounted = useRef(true);

	const initialState = {
		body: "",
		contactId: "",
		sendAt: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
		sentAt: ""
	};

	const initialContact = {
		id: "",
		name: ""
	}

	const [schedule, setSchedule] = useState(initialState);
	const [currentContact, setCurrentContact] = useState(initialContact);
	const [contacts, setContacts] = useState([initialContact]);
	const [attachment, setAttachment] = useState(null);
	const attachmentFile = useRef(null);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const messageInputRef = useRef();
	const [whatsapps, setWhatsapps] = useState([]);
	const [selectedWhatsapps, setSelectedWhatsapps] = useState([]);
	const { companyId, whatsappId } = user;
	const [loading, setLoading] = useState(false);
	const [queues, setQueues] = useState([]);
	const [allQueues, setAllQueues] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedQueue, setSelectedQueue] = useState(null);
	const { findAll: findAllQueues } = useQueues();
	const [options, setOptions] = useState([]);
	const [searchParam, setSearchParam] = useState("");

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

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
		if (searchParam.length < 3) {
			setLoading(false);
			setSelectedQueue("");
			return;
		}
		const delayDebounceFn = setTimeout(() => {
			setLoading(true);
			const fetchUsers = async () => {
				try {
					const { data } = await api.get("/users/");
					setOptions(data.users);
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
		api
			.get(`/whatsapp`, { params: { companyId, session: 0 } })
			.then(({ data }) => {
				// Mapear os dados recebidos da API para adicionar a propriedade 'selected'
				const mappedWhatsapps = data.map((whatsapp) => ({
					...whatsapp,
					selected: false,
				}));

				setWhatsapps(mappedWhatsapps);
			});
	}, [])

	useEffect(() => {
		if (contactId && contacts.length) {
			const contact = contacts.find(c => c.id === contactId);
			if (contact) {
				setCurrentContact(contact);
			}
		}
	}, [contactId, contacts]);

	useEffect(() => {
		const { companyId } = user;
		if (open) {
			try {
				(async () => {
					const { data: contactList } = await api.get('/contacts/list', { params: { companyId: companyId } });
					let customList = contactList.map((c) => ({ id: c.id, name: c.name }));
					if (isArray(customList)) {
						setContacts([{ id: "", name: "" }, ...customList]);
					}
					if (contactId) {
						setSchedule(prevState => {
							return { ...prevState, contactId }
						});
					}

					if (!scheduleId) return;

					const { data } = await api.get(`/schedules/${scheduleId}`);
					setSchedule(prevState => {
						return { ...prevState, ...data, sendAt: moment(data.sendAt).format('YYYY-MM-DDTHH:mm') };
					});
					setCurrentContact(data.contact);
				})()
			} catch (err) {
				toastError(err);
			}
		}
	}, [scheduleId, contactId, open, user]);

	const filterOptions = createFilterOptions({
		trim: true,
	});

	const handleClose = () => {
		onClose();
		setAttachment(null);
		setSchedule(initialState);
	};

	const handleAttachmentFile = (e) => {
		const file = head(e.target.files);
		if (file) {
			setAttachment(file);
		}
	};

	const handleSaveSchedule = async values => {
		const scheduleData = { ...values, userId: user.id };
		try {
			if (scheduleId) {
				await api.put(`/schedules/${scheduleId}`, scheduleData);
				if (attachment != null) {
					const formData = new FormData();
					formData.append("file", attachment);
					await api.post(
						`/schedules/${scheduleId}/media-upload`,
						formData
					);
				}
			} else {
				const { data } = await api.post("/schedules", scheduleData);
				if (attachment != null) {
					const formData = new FormData();
					formData.append("file", attachment);
					await api.post(`/schedules/${data.id}/media-upload`, formData);
				}
			}
			toast.success(i18n.t("scheduleModal.success"));
			if (typeof reload == 'function') {
				reload();
			}
			if (contactId) {
				if (typeof cleanContact === 'function') {
					cleanContact();
					history.push('/schedules');
				}
			}
		} catch (err) {
			toastError(err);
		}
		setCurrentContact(initialContact);
		setSchedule(initialState);
		handleClose();
	};
	const handleClickMsgVar = async (msgVar, setValueFunc) => {
		const el = messageInputRef.current;
		const firstHalfText = el.value.substring(0, el.selectionStart);
		const secondHalfText = el.value.substring(el.selectionEnd);
		const newCursorPos = el.selectionStart + msgVar.length;

		setValueFunc("body", `${firstHalfText}${msgVar}${secondHalfText}`);

		await new Promise(r => setTimeout(r, 100));
		messageInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
	};

	const deleteMedia = async () => {
		if (attachment) {
			setAttachment(null);
			attachmentFile.current.value = null;
		}

		if (schedule.mediaPath) {
			await api.delete(`/schedules/${schedule.id}/media-upload`);
			setSchedule((prev) => ({
				...prev,
				mediaPath: null,
			}));
			toast.success(i18n.t("scheduleModal.toasts.deleted"));
			if (typeof reload == "function") {
				console.log(reload);
				console.log("1");
				reload();
			}
		}
	};

	return (
		<div className={classes.root}>
			<ConfirmationModal
				title={i18n.t("scheduleModal.confirmationModal.deleteTitle")}
				open={confirmationOpen}
				onClose={() => setConfirmationOpen(false)}
				onConfirm={deleteMedia}
			>
				{i18n.t("scheduleModal.confirmationModal.deleteMessage")}
			</ConfirmationModal>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="md"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="form-dialog-title">
					{schedule.status === 'ERRO' ? 'Erro de Envio' : `Mensagem ${capitalize(schedule.status)}`}
				</DialogTitle>
				<div style={{ display: "none" }}>
					<input
						type="file"
						accept=".png,.jpg,.jpeg"
						ref={attachmentFile}
						onChange={(e) => handleAttachmentFile(e)}
					/>
				</div>
				<Formik
					initialValues={schedule}
					enableReinitialize={true}
					validationSchema={ScheduleSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveSchedule(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting, values, setFieldValue }) => (
						<Form>
							<DialogContent dividers>
								<div className={classes.multFieldLine}>
									<FormControl
										variant="outlined"
										fullWidth
									>
										<Autocomplete
											fullWidth
											value={currentContact}
											options={contacts}
											onChange={(e, contact) => {
												const contactId = contact ? contact.id : '';
												setSchedule({ ...schedule, contactId });
												setCurrentContact(contact ? contact : initialContact);
											}}
											getOptionLabel={(option) => option.name}
											getOptionSelected={(option, value) => {
												return value.id === option.id
											}}
											renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Contato" />}
										/>
									</FormControl>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										rows={9}
										multiline={true}
										label={i18n.t("scheduleModal.form.body")}
										name="body"
										inputRef={messageInputRef}
										error={touched.body && Boolean(errors.body)}
										helperText={touched.body && errors.body}
										variant="outlined"
										margin="dense"
										fullWidth
									/>
								</div>
								<Grid item>
									<MessageVariablesPicker
										disabled={isSubmitting}
										onClick={value => handleClickMsgVar(value, setFieldValue)}
									/>
								</Grid>
								<Grid container spacing={1}>
									<Grid item xs={12} md={6} xl={6}>
										<FormControl
											variant="outlined"
											margin="dense"
											fullWidth
											className={classes.formControl}
										>
											<InputLabel id="whatsapp-selection-label">
												{i18n.t("campaigns.dialog.form.whatsapp")}
											</InputLabel>
											<Field
												as={Select}
												multiple
												label={i18n.t("campaigns.dialog.form.whatsapp")}
												placeholder={i18n.t("campaigns.dialog.form.whatsapp")}
												labelId="whatsapp-selection-label"
												id="whatsappIds"
												name="whatsappIds"
												required
												error={touched.whatsappId && Boolean(errors.whatsappId)}
												value={selectedWhatsapps}
												onChange={(event) => setSelectedWhatsapps(event.target.value)}
												renderValue={(selected) => (
													<div>
														{selected.map((value) => (
															<Chip key={value} label={whatsapps.find((whatsapp) => whatsapp.id === value).name} />
														))}
													</div>
												)}
											>
												{whatsapps &&
													whatsapps.map((whatsapp) => (
														<MenuItem key={whatsapp.id} value={whatsapp.id}>
															{whatsapp.name}
														</MenuItem>
													))}
											</Field>
										</FormControl>
									</Grid>
									<Grid item xs={12} md={6} xl={6}>
										<FormControl
											variant="outlined"
											margin="dense"
											fullWidth
											className={classes.formControl}
										>
											<InputLabel id="openTicket-selection-label">
												{i18n.t("campaigns.dialog.form.openTicket")}
											</InputLabel>
											<Field
												as={Select}
												label={i18n.t("campaigns.dialog.form.openTicket")}
												placeholder={i18n.t(
													"campaigns.dialog.form.openTicket"
												)}
												labelId="openTicket-selection-label"
												id="openTicket"
												name="openTicket"
												error={
													touched.openTicket && Boolean(errors.openTicket)
												}
											>
												<MenuItem value={"enabled"}>{i18n.t("campaigns.dialog.form.enabledOpenTicket")}</MenuItem>
												<MenuItem value={"disabled"}>{i18n.t("campaigns.dialog.form.disabledOpenTicket")}</MenuItem>
											</Field>
										</FormControl>
									</Grid>
								</Grid>
								<Grid spacing={1} container>
									{/* SELECIONAR USUARIO */}
									<Grid item xs={12} md={6} xl={6}>
										<Autocomplete
											style={{ marginTop: '8px' }}
											variant="outlined"
											margin="dense"
											className={classes.formControl}
											getOptionLabel={(option) => `${option.name}`}
											value={selectedUser}
											size="small"
											onChange={(e, newValue) => {
												setSelectedUser(newValue);
												if (newValue != null && Array.isArray(newValue.queues)) {
													if (newValue.queues.length === 1) {
														setSelectedQueue(newValue.queues[0].id);
													}
													setQueues(newValue.queues);

												} else {
													setQueues(allQueues);
													setSelectedQueue("");
												}
											}}
											options={options}
											filterOptions={filterOptions}
											freeSolo
											fullWidth
											autoHighlight
											noOptionsText={i18n.t("transferTicketModal.noOptions")}
											loading={loading}
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
															<React.Fragment>
																{loading ? (
																	<CircularProgress color="inherit" size={20} />
																) : null}
																{params.InputProps.endAdornment}
															</React.Fragment>
														),
													}}
												/>
											)}
										/>
									</Grid>

									<Grid item xs={12} md={6} xl={6}>
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
												value={selectedQueue}
												onChange={(e) => setSelectedQueue(e.target.value)}
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
								</Grid>
								<Grid spacing={1} container style={{ marginTop: '-10px' }}>
									<Grid item xs={12} md={6} xl={6}>
										<FormControl
											variant="outlined"
											margin="dense"
											fullWidth
											className={classes.formControl}
										>
											<InputLabel id="statusTicket-selection-label">
												{i18n.t("campaigns.dialog.form.statusTicket")}
											</InputLabel>
											<Field
												as={Select}
												label={i18n.t("campaigns.dialog.form.statusTicket")}
												placeholder={i18n.t(
													"campaigns.dialog.form.statusTicket"
												)}
												labelId="statusTicket-selection-label"
												id="statusTicket"
												name="statusTicket"
												error={
													touched.statusTicket && Boolean(errors.statusTicket)
												}
											>
												<MenuItem value={"closed"}>{i18n.t("campaigns.dialog.form.closedTicketStatus")}</MenuItem>
												<MenuItem value={"open"}>{i18n.t("campaigns.dialog.form.openTicketStatus")}</MenuItem>
											</Field>
										</FormControl>
									</Grid>

									<Grid item xs={12} md={6} xl={6}>
										<Field
											as={TextField}
											label={i18n.t("scheduleModal.form.sendAt")}
											type="datetime-local"
											name="sendAt"
											// InputLabelProps={{
											// 	shrink: true,
											// }}
											error={touched.sendAt && Boolean(errors.sendAt)}
											helperText={touched.sendAt && errors.sendAt}
											variant="outlined"
											fullWidth
											size="small"
											style={{ marginTop: '8px' }}
										/>
									</Grid>
								</Grid>
								<Grid spacing={1} container style={{ marginTop: '-10px' }}>
								<Grid item xs={12} md={6} xl={6}>
										<Field
											as={TextField}
											label={i18n.t("scheduleModal.form.sendAt")}
											name="sendAt"
											// InputLabelProps={{
											// 	shrink: true,
											// }}
											error={touched.sendAt && Boolean(errors.sendAt)}
											helperText={touched.sendAt && errors.sendAt}
											variant="outlined"
											fullWidth
											size="small"
											style={{ marginTop: '8px' }}
										/>
									</Grid>

									<Grid item xs={12} md={6} xl={6}>
										<Field
											as={TextField}
											label={i18n.t("scheduleModal.form.sendAt")}
											name="sendAt"
											// InputLabelProps={{
											// 	shrink: true,
											// }}
											error={touched.sendAt && Boolean(errors.sendAt)}
											helperText={touched.sendAt && errors.sendAt}
											variant="outlined"
											fullWidth
											size="small"
											style={{ marginTop: '8px' }}
										/>
									</Grid>
								</Grid>
								<FieldArray name="options">
									{({ push, remove }) => (
										<>
											{values.options &&
												values.options.length > 0 &&
												values.options.map((info, index) => (
													<div
														className={classes.extraAttr}
														key={`${index}-info`}
													>
														<Grid container spacing={0}>
															<Grid xs={6} md={10} item>
																<Field
																	as={TextField}
																	label={i18n.t("scheduleModal.form.sendAt")}
																	type="datetime-local"
                                                                    name={`options[${index}].sendAt`}
																	// InputLabelProps={{
																	// 	shrink: true,
																	// }}
																	variant="outlined"
																	fullWidth
																	size="small"
																	style={{ marginTop: '8px' }}
																/>
															</Grid>
														</Grid>
													</div>
												))}
											<div className={classes.extraAttr}>
												<Button
													style={{ flex: 1, marginTop: 8 }}
													variant="outlined"
													color="primary"
													onClick={() => {
														push({ name: "", path: "" });
														//setSelectedFileNames([...selectedFileNames, ""]);
													}}
												>
													{`+ ${i18n.t("scheduleModal.buttons.addSchedule")}`}
												</Button>
											</div>
										</>
									)}
								</FieldArray>
								{(schedule.mediaPath || attachment) && (
									<Grid xs={12} item>
										<Button startIcon={<AttachFile />}>
											{attachment ? attachment.name : schedule.mediaName}
										</Button>
										<IconButton
											onClick={() => setConfirmationOpen(true)}
											color="secondary"
										>
											<DeleteOutline color="secondary" />
										</IconButton>
									</Grid>
								)}
								{(schedule.mediaPath || attachment) && (
									<Grid xs={12} item>
										<Button startIcon={<AttachFile />}>
											{attachment ? attachment.name : schedule.mediaName}
										</Button>
										<IconButton
											onClick={() => setConfirmationOpen(true)}
											color="secondary"
										>
											<DeleteOutline color="secondary" />
										</IconButton>
									</Grid>
								)}
							</DialogContent>
							<DialogActions>
								{!attachment && !schedule.mediaPath && (
									<Button
										color="primary"
										onClick={() => attachmentFile.current.click()}
										disabled={isSubmitting}
										variant="outlined"
									>
										{i18n.t("quickMessages.buttons.attach")}
									</Button>
								)}
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("scheduleModal.buttons.cancel")}
								</Button>
								{(schedule.sentAt === null || schedule.sentAt === "") && (
									<Button
										type="submit"
										color="primary"
										disabled={isSubmitting}
										variant="contained"
										className={classes.btnWrapper}
									>
										{scheduleId
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
		</div>
	);
};

export default ScheduleModal;