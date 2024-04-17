import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Switch from "@material-ui/core/Switch";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ConfirmationModal from "../ConfirmationModal";
import TransferTicketModalCustom from "../TransferTicketModalCustom";
import toastError from "../../errors/toastError";
import { Can } from "../Can";
import { AuthContext } from "../../context/Auth/AuthContext";
import ScheduleModal from "../ScheduleModal";

const TicketOptionsMenu = ({ ticket, menuOpen, handleClose, anchorEl }) => {
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [transferTicketModalOpen, setTransferTicketModalOpen] = useState(false);
	const isMounted = useRef(true);
	const { user } = useContext(AuthContext);
	const history = useHistory();
	const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
	const [contactId, setContactId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [acceptAudioMessage, setAcceptAudio] = useState(ticket.contact.acceptAudioMessage);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleDeleteTicket = async () => {
		try {
			await api.delete(`/tickets/${ticket.id}`);
		} catch (err) {
			toastError(err);
		}
	};

	const handleOpenConfirmationModal = e => {
		setConfirmationOpen(true);
		handleClose();
	};

	const handleOpenTransferModal = e => {
		setTransferTicketModalOpen(true);
		handleClose();
	};

	const handleCloseTransferTicketModal = () => {
		if (isMounted.current) {
			setTransferTicketModalOpen(false);
		}
	};

	const handleCloseTicketWithoutFarewellMsg = async () => {
		setLoading(true);
		try {
			await api.put(`/tickets/${ticket.id}`, {
				status: "closed",
				userId: user?.id || null,
				sendFarewellMessage: false,
			});

			setLoading(false);
			history.push("/tickets");
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	const handleContactToggleAcceptAudio = async () => {
		try {
			const contact = await api.put(
				`/contacts/toggleAcceptAudio/${ticket.contact.id}`
			);
			setAcceptAudio(contact.data.acceptAudioMessage);
		} catch (err) {
			toastError(err);
		}
	};

	const handleOpenScheduleModal = () => {
		handleClose();
		setContactId(ticket.contact.id);
		setScheduleModalOpen(true);
	}

	const handleCloseScheduleModal = () => {
		setScheduleModalOpen(false);
		setContactId(null);
	}

	return (
		<>
			<Menu
				id="menu-appbar"
				anchorEl={anchorEl}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={menuOpen}
				onClose={handleClose}
			>
				<MenuItem onClick={handleCloseTicketWithoutFarewellMsg}>
					{i18n.t("ticketOptionsMenu.resolveWithNoFarewell")}
				</MenuItem>
				<MenuItem onClick={handleOpenScheduleModal}>
					{i18n.t("ticketOptionsMenu.schedule")}
				</MenuItem>
				<MenuItem onClick={handleOpenTransferModal}>
					{i18n.t("ticketOptionsMenu.transfer")}
				</MenuItem>
				<MenuItem>
					<Switch
						size="small"
						checked={acceptAudioMessage}
						onChange={() => handleContactToggleAcceptAudio()}
						name="acceptAudioMessage"
						color="primary"
					/>
					{i18n.t("ticketOptionsMenu.acceptAudioMessage")}
				</MenuItem>
				<Can
					role={user.profile}
					perform="ticket-options:deleteTicket"
					yes={() => (
						<MenuItem onClick={handleOpenConfirmationModal}>
							{i18n.t("ticketOptionsMenu.delete")}
						</MenuItem>
					)}
				/>
			</Menu>
			<ConfirmationModal
				title={`${i18n.t("ticketOptionsMenu.confirmationModal.title")} ${ticket.contact.name
					}?`}
				open={confirmationOpen}
				onClose={setConfirmationOpen}
				onConfirm={handleDeleteTicket}
			>
				{i18n.t("ticketOptionsMenu.confirmationModal.message")}
			</ConfirmationModal>
			<TransferTicketModalCustom
				modalOpen={transferTicketModalOpen}
				onClose={handleCloseTransferTicketModal}
				ticketid={ticket.id}
			/>
			<ScheduleModal
				open={scheduleModalOpen}
				onClose={handleCloseScheduleModal}
				aria-labelledby="form-dialog-title"
				contactId={contactId}
			/>
		</>
	);
};

export default TicketOptionsMenu;