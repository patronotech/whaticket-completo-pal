import React, { useState, useEffect, useContext, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import whatsappIcon from '../../assets/nopicture.png'
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import useWhatsApps from "../../hooks/useWhatsApps";

import { Can } from "../Can";
import { Avatar, Grid, Input, Paper, Tab, Tabs } from "@material-ui/core";
import { getBackendUrl } from "../../config";
import TabPanel from "../TabPanel";

const backendUrl = getBackendUrl();
const path = require('path');

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
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
	textField: {
		marginRight: theme.spacing(1),
		flex: 1,
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	avatar: {
		width: theme.spacing(12),
		height: theme.spacing(12),
		margin: theme.spacing(2),
		cursor: 'pointer',
		borderRadius: '50%',
		border: '2px solid #ccc',
	},
	updateDiv: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	updateInput: {
		display: 'none',
	},
	updateLabel: {
		padding: theme.spacing(1),
		margin: theme.spacing(1),
		textTransform: 'uppercase',
		textAlign: 'center',
		cursor: 'pointer',
		border: '2px solid #ccc',
		borderRadius: '5px',
		minWidth: 160,
		fontWeight: 'bold',
		color: '#555',
	},
	errorUpdate: {
		border: '2px solid red',
	},
	errorText: {
		color: 'red',
		fontSize: '0.8rem',
		fontWeight: 'bold',
	}
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
	allHistoric: Yup.string().nullable(),
});

const UserModal = ({ open, onClose, userId }) => {
	const classes = useStyles();

	const initialState = {
		name: "",
		email: "",
		password: "",
		profile: "user",
		startWork: "00:00",
		endWork: "23:59",
		farewellMessage: "",
		allTicket: "disable",
		allowGroup: false,
		defaultTheme: "light",
		defaultMenu: "open",
		allHistoric: "disabled",
		allUserChat: "disabled",
		userClosePendingTicket: "enabled",
		showDashboard: "disabled"
	};

	const { user: loggedInUser } = useContext(AuthContext);

	const [user, setUser] = useState(initialState);
	const [selectedQueueIds, setSelectedQueueIds] = useState([]);
	const [whatsappId, setWhatsappId] = useState(false);
	// const [allTicket, setAllTicket] = useState("disable");
	const { loading, whatsApps } = useWhatsApps();
	const [profileUrl, setProfileUrl] = useState(null)
	const [tab, setTab] = useState("general");

	const startWorkRef = useRef();
	const endWorkRef = useRef();



	useEffect(() => {
		const fetchUser = async () => {

			if (!userId) return;
			try {
				const { data } = await api.get(`/users/${userId}`);
				setUser(prevState => {
					return { ...prevState, ...data };
				});

				const { profileImage } = data;
				setProfileUrl(`${backendUrl}/public/company${data.companyId}/user/${profileImage}`);

				const userQueueIds = data.queues?.map(queue => queue.id);
				setSelectedQueueIds(userQueueIds);
				setWhatsappId(data.whatsappId ? data.whatsappId : '');
			} catch (err) {
				toastError(err);
			}
		};

		fetchUser();
	}, [userId, open]);

	const handleClose = () => {
		onClose();
		setUser(initialState);
	};

	const handleTabChange = (event, newValue) => {
		setTab(newValue);
	};

	const handleSaveUser = async values => {
		const uploadAvatar = async (file) => {
			const formData = new FormData();
			formData.append('userId', file.id);
			formData.append('typeArch', "user");
			formData.append('profileImage', file.profileImage);

			const { data } = await api.post(`/users/${file.id}/media-upload`, formData);

			localStorage.setItem("profileImage", data.user.profileImage);

		}
		const userData = { ...values, whatsappId, queueIds: selectedQueueIds };
		try {
			if (userId) {
				const { data } = await api.put(`/users/${userId}`, userData);
				console.log(user, profileUrl, data)
				window.localStorage.setItem("preferredTheme", values.defaultTheme);

				if (user.profileImage && user.profileImage !== path.basename(profileUrl))
					uploadAvatar(user)
			} else {
				const { data } = await api.post("/users", userData);
				window.localStorage.setItem("preferredTheme", values.defaultTheme);

				if (user.profileImage && user.avatar)
					uploadAvatar(user)
			}

			toast.success(i18n.t("userModal.success"));
		} catch (err) {
			toastError(err);
		}
		handleClose();
	};

	const handleUpdateProfileImage = (e) => {
		if (!e.target.files[0]) return;

		const newAvatarUrl = URL.createObjectURL(e.target.files[0]);
		setUser(prevState => ({
			...prevState,
			avatar: newAvatarUrl,
			profileImage: e.target.files[0]
		}));
		setProfileUrl(newAvatarUrl);
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="form-dialog-title">
					{userId
						? `${i18n.t("userModal.title.edit")}`
						: `${i18n.t("userModal.title.add")}`}
				</DialogTitle>
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveUser(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
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
									<Tab label={i18n.t("userModal.tabs.general")} value={"general"} />
									<Tab label={i18n.t("userModal.tabs.permissions")} value={"permissions"} />
								</Tabs>
							</Paper>
							<Paper className={classes.paper} elevation={0}>
								<DialogContent dividers>
									<TabPanel
										className={classes.container}
										value={tab}
										name={"general"}
									>
										<Grid
											container
											spacing={1}
											alignContent="center"
											alignItems="center"
											justifyContent="center">
											<FormControl className={classes.updateDiv}>
												<label htmlFor="profileImage">
													<Avatar
														src={profileUrl ? profileUrl : whatsappIcon}
														alt="profile-image"
														className={`${classes.avatar} ${touched.profileImage && errors.profileImage ? classes.errorUpdate : ''}`}
													/>
												</label>
												<FormControl className={classes.updateDiv}>
													<label htmlFor="profileImage"
														className={`${classes.updateLabel} ${touched.profileImage && errors.profileImage ? classes.errorUpdate : ''}`}
													>
														{profileUrl ? i18n.t("userModal.title.updateImage") : i18n.t("userModal.buttons.addImage")}
													</label>
													{
														touched.profileImage && errors.profileImage && (
															<span className={classes.errorText}>{errors.profileImage}</span>)
													}
													<Input
														type="file"
														name="profileImage"
														id="profileImage"
														className={classes.updateInput}
														onChange={event => handleUpdateProfileImage(event)}
													/>
												</FormControl>
												{user.avatar &&
													<Button
														variant="outlined"
														color="secondary"
														onClick={() => {
															setUser(prevState => ({ ...prevState, avatar: null, profileImage: null }));
															setProfileUrl(whatsappIcon);
														}}
													>
														{i18n.t("userModal.title.removeImage")}
													</Button>
												}
											</FormControl>
										</Grid>
										<Grid container spacing={1}>
											<Grid item xs={12} md={6} xl={6}>
												<Field
													as={TextField}
													label={i18n.t("userModal.form.name")}
													autoFocus
													name="name"
													error={touched.name && Boolean(errors.name)}
													helperText={touched.name && errors.name}
													variant="outlined"
													margin="dense"
													fullWidth
												/>
											</Grid>
											<Grid item xs={12} md={6} xl={6}>
												<Field
													as={TextField}
													label={i18n.t("userModal.form.password")}
													type="password"
													name="password"
													error={touched.password && Boolean(errors.password)}
													helperText={touched.password && errors.password}
													variant="outlined"
													margin="dense"
													fullWidth
												/>
											</Grid>
										</Grid>
										<Grid container spacing={1}>
											<Grid item xs={12} md={8} xl={8}>
												<Field
													as={TextField}
													label={i18n.t("userModal.form.email")}
													name="email"
													error={touched.email && Boolean(errors.email)}
													helperText={touched.email && errors.email}
													variant="outlined"
													margin="dense"
													fullWidth
												/>
											</Grid>
											<Grid item xs={12} md={4} xl={4}>
												<FormControl
													variant="outlined"
													//className={classes.formControl}
													margin="dense"
													fullWidth
												>
													<Can
														role={loggedInUser.profile}
														perform="user-modal:editProfile"
														yes={() => (
															<>
																<InputLabel id="profile-selection-input-label">
																	{i18n.t("userModal.form.profile")}
																</InputLabel>

																<Field
																	as={Select}
																	label={i18n.t("userModal.form.profile")}
																	name="profile"
																	labelId="profile-selection-label"
																	id="profile-selection"
																	required
																>
																	<MenuItem value="admin">Admin</MenuItem>
																	<MenuItem value="user">User</MenuItem>
																</Field>
															</>
														)}
													/>
												</FormControl>
											</Grid>
										</Grid>
										<Grid container spacing={1}>
											<Grid item xs={12} md={12} xl={12}>
												<Can
													role={loggedInUser.profile}
													perform="user-modal:editQueues"
													yes={() => (
														<QueueSelect
															selectedQueueIds={selectedQueueIds}
															onChange={values => setSelectedQueueIds(values)}
															fullWidth
														/>
													)}
												/>
											</Grid>
										</Grid>
										<Grid container spacing={1}>
											<Grid item xs={12} md={12} xl={12}>
												<Can
													role={loggedInUser.profile}
													perform="user-modal:editProfile"
													yes={() => (
														<FormControl variant="outlined" margin="dense" className={classes.maxWidth} fullWidth>
															<InputLabel>
																{i18n.t("userModal.form.whatsapp")}
															</InputLabel>
															<Field
																as={Select}
																value={whatsappId}
																onChange={(e) => setWhatsappId(e.target.value)}
																label={i18n.t("userModal.form.whatsapp")}

															>
																<MenuItem value={''}>&nbsp;</MenuItem>
																{whatsApps.map((whatsapp) => (
																	<MenuItem key={whatsapp.id} value={whatsapp.id}>{whatsapp.name}</MenuItem>
																))}
															</Field>
														</FormControl>
													)}
												/>
											</Grid>
										</Grid>
										<Can
											role={loggedInUser.profile}
											perform="user-modal:editProfile"
											yes={() => (
												<Grid container spacing={1}>
													<Grid item xs={12} md={6} xl={6}>
														<Field
															as={TextField}
															label={i18n.t("userModal.form.startWork")}
															type="time"
															ampm={"false"}
															inputRef={startWorkRef}
															InputLabelProps={{
																shrink: true,
															}}
															inputProps={{
																step: 600, // 5 min
															}}
															fullWidth
															name="startWork"
															error={
																touched.startWork && Boolean(errors.startWork)
															}
															helperText={
																touched.startWork && errors.startWork
															}
															variant="outlined"
															margin="dense"
															className={classes.textField}
														/>
													</Grid>
													<Grid item xs={12} md={6} xl={6}>
														<Field
															as={TextField}
															label={i18n.t("userModal.form.endWork")}
															type="time"
															ampm={"false"}
															inputRef={endWorkRef}
															InputLabelProps={{
																shrink: true,
															}}
															inputProps={{
																step: 600, // 5 min
															}}
															fullWidth
															name="endWork"
															error={
																touched.endWork && Boolean(errors.endWork)
															}
															helperText={
																touched.endWork && errors.endWork
															}
															variant="outlined"
															margin="dense"
															className={classes.textField}
														/>
													</Grid>
												</Grid>
											)}
										/>

										<Field
											as={TextField}
											label={i18n.t("userModal.form.farewellMessage")}
											type="farewellMessage"
											multiline
											rows={4}
											fullWidth
											name="farewellMessage"
											error={touched.farewellMessage && Boolean(errors.farewellMessage)}
											helperText={touched.farewellMessage && errors.farewellMessage}
											variant="outlined"
											margin="dense"
										/>

										<Grid container spacing={1}>
											<Grid item xs={12} md={6} xl={6}>
												<FormControl
													variant="outlined"
													className={classes.maxWidth}
													margin="dense"
													fullWidth
												>
													<>
														<InputLabel >
															{i18n.t("userModal.form.defaultTheme")}
														</InputLabel>

														<Field
															as={Select}
															label={i18n.t("userModal.form.defaultTheme")}
															name="defaultTheme"
															type="defaultTheme"
															required
														>
															<MenuItem value="light">{i18n.t("userModal.form.defaultThemeLight")}</MenuItem>
															<MenuItem value="dark">{i18n.t("userModal.form.defaultThemeDark")}</MenuItem>
														</Field>
													</>
												</FormControl>
											</Grid>
											<Grid item xs={12} md={6} xl={6}>

												<FormControl
													variant="outlined"
													className={classes.maxWidth}
													margin="dense"
													fullWidth
												>
													<>
														<InputLabel >
															{i18n.t("userModal.form.defaultMenu")}
														</InputLabel>

														<Field
															as={Select}
															label={i18n.t("userModal.form.defaultMenu")}
															name="defaultMenu"
															type="defaultMenu"
															required
														>
															<MenuItem value={"open"}>{i18n.t("userModal.form.defaultMenuOpen")}</MenuItem>
															<MenuItem value={"closed"}>{i18n.t("userModal.form.defaultMenuClosed")}</MenuItem>
														</Field>
													</>
												</FormControl>
											</Grid>
										</Grid>
									</TabPanel>
									<TabPanel
										className={classes.container}
										value={tab}
										name={"permissions"}
									>
										<Can
											role={loggedInUser.profile}
											perform="user-modal:editProfile"
											yes={() =>
												<>
													<Grid container spacing={1}>
														<Grid item xs={12} md={6} xl={6}>
															<FormControl
																variant="outlined"
																className={classes.maxWidth}
																margin="dense"
																fullWidth
															>
																<>
																	<InputLabel >
																		{i18n.t("userModal.form.allTicket")}
																	</InputLabel>

																	<Field
																		as={Select}
																		label={i18n.t("userModal.form.allTicket")}
																		name="allTicket"
																		type="allTicket"
																		required
																	>
																		<MenuItem value="enable">{i18n.t("userModal.form.allTicketEnable")}</MenuItem>
																		<MenuItem value="disable">{i18n.t("userModal.form.allTicketDisable")}</MenuItem>
																	</Field>
																</>
															</FormControl>
														</Grid>
														<Grid item xs={12} md={6} xl={6}>
															<FormControl
																variant="outlined"
																className={classes.maxWidth}
																margin="dense"
																fullWidth
															>
																<>
																	<InputLabel >
																		{i18n.t("userModal.form.allowGroup")}
																	</InputLabel>

																	<Field
																		as={Select}
																		label={i18n.t("userModal.form.allowGroup")}
																		name="allowGroup"
																		type="allowGroup"
																		required
																	>
																		<MenuItem value={true}>{i18n.t("userModal.form.allTicketEnable")}</MenuItem>
																		<MenuItem value={false}>{i18n.t("userModal.form.allTicketDisable")}</MenuItem>
																	</Field>
																</>
															</FormControl>
														</Grid>
													</Grid>
													<Grid container spacing={1}>
														<Grid item xs={12} md={6} xl={6}>
															<FormControl
																variant="outlined"
																className={classes.maxWidth}
																margin="dense"
																fullWidth
															>
																<>
																	<InputLabel >
																		{i18n.t("userModal.form.allHistoric")}
																	</InputLabel>

																	<Field
																		as={Select}
																		label={i18n.t("userModal.form.allHistoric")}
																		name="allHistoric"
																		type="allHistoric"
																		required
																	>
																		<MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
																		<MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
																	</Field>
																</>
															</FormControl>
														</Grid>
														<Grid item xs={12} md={6} xl={6}>
															<FormControl
																variant="outlined"
																className={classes.maxWidth}
																margin="dense"
																fullWidth
															>
																<>
																	<InputLabel >
																		{i18n.t("userModal.form.allUserChat")}
																	</InputLabel>

																	<Field
																		as={Select}
																		label={i18n.t("userModal.form.allUserChat")}
																		name="allUserChat"
																		type="allUserChat"
																		required
																	>
																		<MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
																		<MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
																	</Field>
																</>
															</FormControl>
														</Grid>
													</Grid>
													<Grid container spacing={1}>
														<Grid item xs={12} md={6} xl={6}>

															<FormControl
																variant="outlined"
																className={classes.maxWidth}
																margin="dense"
																fullWidth
															>
																<>
																	<InputLabel >
																		{i18n.t("userModal.form.showDashboard")}
																	</InputLabel>

																	<Field
																		as={Select}
																		label={i18n.t("userModal.form.showDashboard")}
																		name="showDashboard"
																		type="showDashboard"
																		required
																	>
																		<MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
																		<MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
																	</Field>
																</>
															</FormControl>
														</Grid>
														<Grid item xs={12} md={6} xl={6}>

															<FormControl
																variant="outlined"
																className={classes.maxWidth}
																margin="dense"
																fullWidth
															>
																<>
																	<InputLabel >
																		{i18n.t("userModal.form.userClosePendingTicket")}
																	</InputLabel>

																	<Field
																		as={Select}
																		label={i18n.t("userModal.form.userClosePendingTicket")}
																		name="userClosePendingTicket"
																		type="userClosePendingTicket"
																		required
																	>
																		<MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
																		<MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
																	</Field>
																</>
															</FormControl>
														</Grid>
													</Grid>
												</>
											}
										/>
									</TabPanel>
								</DialogContent>
							</Paper>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("userModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
								>
									{userId
										? `${i18n.t("userModal.buttons.okEdit")}`
										: `${i18n.t("userModal.buttons.okAdd")}`}
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
		</div >
	);
};

export default UserModal;
