import React, { useEffect, useState, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Drawer from "@material-ui/core/Drawer";
import Link from "@material-ui/core/Link";
import InputLabel from "@material-ui/core/InputLabel";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CreateIcon from '@material-ui/icons/Create';
import formatSerializedId from '../../utils/formatSerializedId';
import { i18n } from "../../translate/i18n";
import ModalImageCors from "../ModalImageCors"
import ContactDrawerSkeleton from "../ContactDrawerSkeleton";
import MarkdownWrapper from "../MarkdownWrapper";
import { CardHeader, Switch, Tooltip } from "@material-ui/core";
import { ContactForm } from "../ContactForm";
import ContactModal from "../ContactModal";
import { ContactNotes } from "../ContactNotes";

import { AuthContext } from "../../context/Auth/AuthContext";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { toast } from "react-toastify";


const drawerWidth = 320;

const useStyles = makeStyles(theme => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
		display: "flex",
		borderTop: "1px solid rgba(0, 0, 0, 0.12)",
		borderRight: "1px solid rgba(0, 0, 0, 0.12)",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		borderTopRightRadius: 4,
		borderBottomRightRadius: 4,
	},
	header: {
		display: "flex",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		backgroundColor: theme.palette.inputBackground,
		alignItems: "center",
		padding: theme.spacing(0, 1),
		minHeight: "50px",
		justifyContent: "flex-start",
	},
	content: {
		display: "flex",
		backgroundColor: theme.palette.inputBackground,
		flexDirection: "column",
		padding: "8px 0px 8px 8px",
		height: "100%",
		justifyContent: "center",
		overflowY: "scroll",
		...theme.scrollbarStyles,
	},	

	contactAvatar: {
		margin: 15,
		width: 160,
		height: 160,
		borderRadius: 10,
	},

	contactHeader: {
		display: "flex",
		padding: 8,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		"& > *": {
			margin: 4,
		},
	},

	contactDetails: {
		marginTop: 8,
		padding: 8,
		display: "flex",
		flexDirection: "column",
	},
	contactExtraInfo: {
		marginTop: 4,
		padding: 6,
	},
}));

const ContactDrawer = ({ open, handleDrawerClose, contact, ticket, loading }) => {
	const classes = useStyles();

	const [modalOpen, setModalOpen] = useState(false);
    const [blockingContact, setBlockingContact] = useState(contact.active);
	const [openForm, setOpenForm] = useState(false);
	const { get } = useCompanySettings();
	const [hideNum, setHideNum] = useState(false);
	const { user } = useContext(AuthContext);
	const [disableBot, setDisableBot] = useState(contact.disableBot);

	useEffect(() => {
        async function fetchData() {

            const lgpdHideNumber = await get({
    			"column":"lgpdHideNumber"
			});
           
            if (lgpdHideNumber === "enabled") setHideNum(true);

        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

	useEffect(() => {
		setOpenForm(false);
		setDisableBot(contact.disableBot)
	}, [open, contact]);

	const handleContactToggleDisableBot = async () => {

		const {id} = contact;

		try {
			const {data} = await api.put(`/contacts/toggleDisableBot/${id}`);
			contact.disableBot = data.disableBot;
			setDisableBot(data.disableBot)

		} catch (err) {
			toastError(err);
		}
	};

	const handleBlockContact = async (contactId) => {
        try {
            await api.put(`/contacts/block/${contactId}`, { active: false });
            toast.success("Contato bloqueado");
        } catch (err) {
            toastError(err);
        }

        setBlockingContact(true);
    };

    const handleUnBlockContact = async (contactId) => {
        try {
            await api.put(`/contacts/block/${contactId}`, { active: true });
            toast.success("Contato desbloqueado");
        } catch (err) {
            toastError(err);
        }
        setBlockingContact(false);
    };

	if(loading) return null;

	return (
		<>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="right"
				open={open}
				PaperProps={{ style: { position: "absolute" } }}
				BackdropProps={{ style: { position: "absolute" } }}
				ModalProps={{
					container: document.getElementById("drawer-container"),
					style: { position: "absolute" },
				}}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.header}>
					<IconButton onClick={handleDrawerClose}>
						<CloseIcon />
					</IconButton>
					<Typography style={{ justifySelf: "center" }}>
						{i18n.t("contactDrawer.header")}
					</Typography>
				</div>
				<div>
					{!loading ? (
						<>
							<Typography
								style={{ marginBottom: 8, marginTop: 12 }}
								variant="subtitle1"
							>
								<Switch
									size="small"
									checked={disableBot}
									onChange={() => handleContactToggleDisableBot()}
									name="disableBot"
									color="primary"
								/>
									{i18n.t("contactModal.form.chatBotContact")}
							</Typography>
						</>
					) : (<br />)}					
				</div>
				{loading ? (
					<ContactDrawerSkeleton classes={classes} />
				) : (
					<div className={classes.content}>
						<Paper square variant="outlined" className={classes.contactHeader}>
							<ModalImageCors imageUrl={contact?.urlPicture} />
							<CardHeader
								onClick={() => { }}
								style={{ cursor: "pointer", width: '100%' }}
								titleTypographyProps={{ noWrap: true }}
								subheaderTypographyProps={{ noWrap: true }}
								title={
									<>
										<Typography onClick={() => setOpenForm(true)}>
											{contact.name}
											<CreateIcon style={{ fontSize: 16, marginLeft: 5 }} />
										</Typography>
									</>
								}
								subheader={
									<>
										<Typography style={{ fontSize: 12 }}>
											{hideNum && user.profile === "user" ? formatSerializedId(contact.number).slice(0,-6)+"**-**"+ contact.number.slice(-2): formatSerializedId(contact.number)}
										</Typography>
										<Typography style={{ color: "primary", fontSize: 12 }}>
											<Link href={`mailto:${contact.email}`}>{contact.email}</Link>
										</Typography>
									</>
								}
							/>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => setModalOpen(!openForm)}
								style={{ fontSize: 12 }}
							>
								{i18n.t("contactDrawer.buttons.edit")}
							</Button>
							<Button
								variant="outlined"
								color="secondary"
								onClick={() => contact.active
									? handleBlockContact(contact.id)
									: handleUnBlockContact(contact.id)}
								disabled={loading}
							>
								{!contact.active ? "Desbloquear contato" : "Bloquear contato"}
							</Button>							
							{(contact.id && openForm) && <ContactForm initialContact={contact} onCancel={() => setOpenForm(false)} />}
						</Paper>
						{/* <TagsContainer contact={contact} className={classes.contactTags} /> */}
						<Paper square variant="outlined" className={classes.contactDetails}>
							<Typography variant="subtitle1" style={{ marginBottom: 10 }}>
								{i18n.t("ticketOptionsMenu.appointmentsModal.title")}
							</Typography>
							<ContactNotes ticket={ticket} />
						</Paper>
						<Paper square variant="outlined" className={classes.contactDetails}>
							<ContactModal
								open={modalOpen}
								onClose={() => setModalOpen(false)}
								contactId={contact.id}
							></ContactModal>
							<Typography variant="subtitle1">
								{i18n.t("contactDrawer.extraInfo")}
							</Typography>
							{contact?.extraInfo?.map(info => (
								<Paper
									key={info.id}
									square
									variant="outlined"
									className={classes.contactExtraInfo}
								>
									<InputLabel>{info.name}</InputLabel>
									<Typography component="div" noWrap style={{ paddingTop: 2 }}>
										<MarkdownWrapper>{info.value}</MarkdownWrapper>
									</Typography>
								</Paper>
							))}
						</Paper>
					</div>
				)}
			</Drawer>
		</>
	);
};

export default ContactDrawer;
