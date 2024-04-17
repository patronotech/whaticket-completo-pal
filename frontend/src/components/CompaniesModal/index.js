import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	CircularProgress,
	Select,
	InputLabel,
	MenuItem,
	FormControl,
	TextField,
	InputAdornment,
	IconButton,
	FormControlLabel,
	Switch
} from '@material-ui/core';

import { Visibility, VisibilityOff } from '@material-ui/icons';

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

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
}));

const CompanySchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Nome é obrigatório"),
	email: Yup.string().email("Email é inválido").required("E-mail é obrigatório"),
	numberAttendants: Yup.number(),
	numberConections: Yup.number(),
});

const CompanyModal = ({ open, onClose, companyId }) => {
	const classes = useStyles();

	const initialState = {
		name: "",
		email: "",
		passwordDefault: "",
		numberAttendants: 1,
		numberConections: 1,
		status: false
	};

	const [company, setCompany] = useState(initialState);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const fetchCompany = async () => {
			if (!companyId) return;
			try {
				const { data } = await api.get(`/companies/listPlan/${companyId}`);
				setCompany(prevState => {
					return { ...prevState, ...data };
				});
			} catch (err) {
				toastError(err);
			}
		};

		fetchCompany();
	}, [companyId, open]);

	const handleClose = () => {
		onClose();
		setCompany(initialState);
	};

	const handleSaveCompany = async values => {
		const companyData = { ...values };
		try {
			if (companyId) {
				await api.put(`/companies/${companyId}`, companyData);
			} else {
				await api.post("/companies", companyData);
			}
			toast.success(i18n.t("companyModal.success"));
		} catch (err) {
			toastError(err);
		}
		handleClose();
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="xs"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="form-dialog-title">
					{companyId
						? `${i18n.t("companyModal.title.edit")}`
						: `${i18n.t("companyModal.title.add")}`}
				</DialogTitle>
				<Formik
					initialValues={company}
					enableReinitialize={true}
					validationSchema={CompanySchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveCompany(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ values, touched, errors, isSubmitting }) => (
						<Form>
							<DialogContent dividers>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("companyModal.form.name")}
										autoFocus
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										margin="dense"
										fullWidth
									/>
								</div>
								<div className={classes.multFieldLine}>
									<FormControlLabel
										control={
											<Field
												as={Switch}
												color="primary"
												name="status"
												checked={values.status}
											/>
										}
										label={"Ativo"}
									/>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("companyModal.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										variant="outlined"
										margin="dense"
										fullWidth
									/>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										name="passwordDefault"
										variant="outlined"
										margin="dense"
										label={i18n.t("companyModal.form.passwordDefault")}
										error={touched.passwordDefault && Boolean(errors.passwordDefault)}
										helperText={touched.passwordDefault && errors.passwordDefault}
										type={showPassword ? 'text' : 'password'}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={() => setShowPassword((e) => !e)}
													>
														{showPassword ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											)
										}}
										fullWidth
									/>
								</div>
								
								{/* <div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("companyModal.form.numberAttendants")}
										name="numberAttendants"
										error={touched.numberAttendants && Boolean(errors.numberAttendants)}
										helperText={touched.numberAttendants && errors.numberAttendants}
										variant="outlined"
										margin="dense"
										type="number"
										fullWidth
										style={
											// console.log('touched', touched)
											console.log('value', values)
										}
									/>
								</div> */}
								{/* <div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("companyModal.form.numberConections")}
										name="numberConections"
										error={touched.numberConections && Boolean(errors.numberConections)}
										helperText={touched.numberConections && errors.numberConections}
										variant="outlined"
										margin="dense"
										type="number"
										fullWidth
									/>
								</div> */}
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("companyModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
								>
									{companyId
										? `${i18n.t("companyModal.buttons.okEdit")}`
										: `${i18n.t("companyModal.buttons.okAdd")}`}
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

export default CompanyModal;
