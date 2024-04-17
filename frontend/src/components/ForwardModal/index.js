import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { FormControl,FormControlLabel,Switch} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { isArray } from "lodash";
const useStyles = makeStyles(theme => ({
	forward: {
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
	// formControl: {
	// 	margin: theme.spacing(1),
	// 	minWidth: 120,
	// },
}));



const ForwardModal = ({ open, onClose, contactId, message }) => {
	const classes = useStyles();

	const initialState = {

	};

	const initialContact = {
		id: "",
		name: ""
	}
	const [schedule, setSchedule] = useState(initialState);
	const [currentContacts, setCurrentContact] = useState(initialContact);
	const [contacts, setContacts] = useState([initialContact]);
	const [signMessage, setSignMessage] = useState(true);

	useEffect(() => {
		if (contactId && contacts.length) {
			const contact = contacts.find(c => c.id === contactId);
			if (contact) {
				setCurrentContact(contact);
			}
		}
	}, [contactId, contacts]);
	useEffect(() => {
		try {
			(async () => {
				if(!open){
					return
				}
				const { data: contactList } = await api.get('/contacts/list');
				let customList = contactList.map((c) => ({ id: c.id, name: c.name, number: c.number, isGroup: c.isGroup }));
				//console.log("customList>>",customList)
				if (isArray(customList)) {
					setContacts([{ id: "", name: "" }, ...customList]);
				}
				if (contactId) {
					setSchedule(prevState => {
						return { ...prevState, contactId }
					});
				}
			})()
		} catch (err) {
			toastError(err);
		}
	}, [contactId, open]);

	const handleClose = () => {
		onClose();
		setSchedule(initialState);
	};
	const handleForward = async () => {

		const values = { currentContacts, message, signMessage }
		await api.post("/forwardmessage", values);
		handleClose();
		toast.success(i18n.t("forward.success"));
	};
	return (
		<div className={classes.forward}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="xs"
				fullWidth
				scroll="paper"
			>
				<Formik
					initialValues={schedule}
					enableReinitialize={true}

				>
					{({ isSubmitting }) => (
						<Form>
							<DialogContent dividers>
								<div className={classes.multFieldLine}>
									<FormControl
										variant="outlined"
										fullWidth
									>
										<Autocomplete
											multiple
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
											renderInput={(params) => <TextField {...params} variant="outlined" label="Contatos" placeholder=" + Contato" />}
										/>
									</FormControl>
								</div>
							</DialogContent>
							<DialogActions>
								<FormControlLabel
									style={{ marginRight: 7, color: "gray" }}
									label={i18n.t("messagesInput.signMessage")}
									labelPlacement="start"
									control={
										<Switch
											size="small"
											checked={signMessage}
											onChange={(e) => {
												setSignMessage(e.target.checked);
											}}
											name="showAllTickets"
											color="primary"
										/>
									}
								/>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("scheduleModal.buttons.cancel")}
								</Button>

								<Button
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
									onClick={() => handleForward()}
								>
									{i18n.t("messageOptionsMenu.forward")}
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

export default ForwardModal;