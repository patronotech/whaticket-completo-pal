import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import { Can } from "../Can";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { DeviceHubOutlined, History, PictureAsPdf, Replay, SwapHorizOutlined } from "@material-ui/icons";
import { v4 as uuidv4 } from "uuid";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
// import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import usePlans from "../../hooks/usePlans";
import { AuthContext } from "../../context/Auth/AuthContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmationModal from "../ConfirmationModal";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '@material-ui/core/Button';
import TransferTicketModalCustom from "../TransferTicketModalCustom";
import AcceptTicketWithouSelectQueue from "../AcceptTicketWithoutQueueModal";

//icones
import EventIcon from "@material-ui/icons/Event";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import UndoIcon from '@material-ui/icons/Undo';

import ScheduleModal from "../ScheduleModal";
import MenuItem from "@material-ui/core/MenuItem";
import { Switch } from "@material-ui/core";
import ShowTicketOpen from "../ShowTicketOpenModal";
import { toast } from "react-toastify";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import ShowTicketLogModal from "../../components/ShowTicketLogModal";
import TicketMessagesDialog from "../TicketMessagesDialog";

const useStyles = makeStyles(theme => ({
    actionButtons: {
        marginRight: 6,
        maxWidth: "100%",
        flex: "none",
        alignSelf: "center",
        marginLeft: "auto",
        // flexBasis: "50%",
        display: "flex",
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    bottomButtonVisibilityIcon: {
        padding: 1,
        color: theme.mode === "light" ? '#0872b9' : '#FFF',
    },
    botoes: {
        display: "flex",
        padding: "15px",
        justifyContent: "flex-end",
        maxWidth: "100%",
        // alignItems: "center"

    }
}));

const SessionSchema = Yup.object().shape({
    ratingId: Yup.string().required("Avaliação obrigatória"),
});

const TicketActionButtonsCustom = ({ ticket
    // , showSelectMessageCheckbox,
    // selectedMessages,
    // forwardMessageModalOpen,
    // setForwardMessageModalOpen
}) => {
    const classes = useStyles();
    const history = useHistory();
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const { setCurrentTicket } = useContext(TicketsContext);
    const [open, setOpen] = React.useState(false);
    const formRef = React.useRef(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [transferTicketModalOpen, setTransferTicketModalOpen] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [contactId, setContactId] = useState(null);
    const [acceptAudioMessage, setAcceptAudio] = useState(ticket.contact.acceptAudioMessage);
    const [acceptTicketWithouSelectQueueOpen, setAcceptTicketWithouSelectQueueOpen] = useState(false);
    const [showTicketLogOpen, setShowTicketLogOpen] = useState(false);
    const [openTicketMessageDialog, setOpenTicketMessageDialog] = useState(false);

    const [showSchedules, setShowSchedules] = useState(false);
    const [enableIntegration, setEnableIntegration] = useState(ticket.useIntegration);

    const [openAlert, setOpenAlert] = useState(false);
    const [userTicketOpen, setUserTicketOpen] = useState("");
    const [queueTicketOpen, setQueueTicketOpen] = useState("");
    const [logTicket, setLogTicket] = useState([]);

    const { get: getSetting } = useCompanySettings()
    const { getPlanCompany } = usePlans();

    useEffect(() => {
        async function fetchData() {
            const companyId = user.companyId;
            const planConfigs = await getPlanCompany(undefined, companyId);
            setShowSchedules(planConfigs.plan.useSchedules);
            setOpenTicketMessageDialog(false);
        }
        fetchData();
        setShowTicketLogOpen(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleClickOpen = async (e) => {
        const setting = await getSetting({
            "column": "requiredTag"
        });

        if (setting?.requiredTag === "enabled") {
            //verificar se tem uma tag   
            try {
                const contactTags = await api.get(`/contactTags/${ticket.contact.id}`);
                if (!contactTags.data.tags) {
                    toast.warning(i18n.t("messagesList.header.buttons.requiredTag"))
                } else {
                    setOpen(true);
                    // handleUpdateTicketStatus(e, "closed", user?.id);
                }
            } catch (err) {
                toastError(err);
            }
        } else {

            setOpen(true);
            // handleUpdateTicketStatus(e, "closed", user?.id);
        }
    };

    const handleClose = () => {
        formRef.current.resetForm();
        setOpen(false);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setLoading(false);
    };
    const handleOpenAcceptTicketWithouSelectQueue = async () => {

        setAcceptTicketWithouSelectQueueOpen(true);

    };

    const handleOpenScheduleModal = () => {
        if (typeof handleClose == "function") handleClose();
        setContactId(ticket.contact.id);
        setScheduleModalOpen(true);
    }

    const handleCloseScheduleModal = () => {
        setScheduleModalOpen(false);
        setContactId(null);
    }



    const handleOpenTransferModal = (e) => {
        setTransferTicketModalOpen(true);
        if (typeof handleClose == "function") handleClose();
    };

    const handleOpenConfirmationModal = (e) => {
        setConfirmationOpen(true);
        if (typeof handleClose == "function") handleClose();
    };


    const handleCloseTicketWithoutFarewellMsg = async () => {
        setLoading(true);
        try {
            await api.put(`/tickets/${ticket.id}`, {
                status: "closed",
                userId: user?.id || null,
                sendFarewellMessage: false,
                amountUsedBotQueues: 0
            });

            setLoading(false);
            history.push("/tickets");
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };

    const handleEnableIntegration = async () => {
        setLoading(true);
        try {
            await api.put(`/tickets/${ticket.id}`, {
                useIntegration: !enableIntegration
            });
            setEnableIntegration(!enableIntegration)

            setLoading(false);
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };

    const handleShowLogTicket = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/tickets-log/${ticket.id}`);
            setLogTicket(data);
            setShowTicketLogOpen(true);

            setLoading(false);
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };

    const handleContactToggleAcceptAudio = async () => {
        try {
            const contact = await api.put(`/contacts/toggleAcceptAudio/${ticket.contact.id}`);
            setAcceptAudio(contact.data.acceptAudioMessage);
        } catch (err) {
            toastError(err);
        }
    };

    const handleCloseTransferTicketModal = () => {
        if (isMounted.current) {
            setTransferTicketModalOpen(false);
        }
    };

    const handleDeleteTicket = async () => {
        try {
            await api.delete(`/tickets/${ticket.id}`);
            history.push("/tickets")
        } catch (err) {
            toastError(err);
        }
    };

    const handleSendMessage = async (id) => {
        const msg = `{{ms}} *{{name}}*, ${i18n.t("mainDrawer.appBar.user.myName")} *${user?.name}* ${i18n.t("mainDrawer.appBar.user.continuity")}.`;
        const message = {
            read: 1,
            fromMe: true,
            mediaUrl: "",
            body: `*${i18n.t("mainDrawer.appBar.user.virtualAssistant")}:*\n${msg.trim()}`,
        };
        try {
            await api.post(`/messages/${id}`, message);
        } catch (err) {
            toastError(err);
        }
    };
    const handleSelectTicket = (ticket) => {
        const code = uuidv4();
        const { id, uuid } = ticket;
        setCurrentTicket({ id, uuid, code });
    };

    const handleUpdateTicketStatus = async (e, status, userId) => {
        setLoading(true);
        try {
            await api.put(`/tickets/${ticket.id}`, {
                status: status,
                userId: userId || null,
            });

            let setting;

            try {
                setting = await getSetting({
                    "column": "sendGreetingAccepted"
                })
            } catch (err) {
                toastError(err);
            }

            if (setting?.sendGreetingAccepted === "enabled" && (!ticket.isGroup || ticket.whatsapp?.groupAsTicket === "enabled") && ticket.status === "pending") {
                handleSendMessage(ticket.id);
            }

            setLoading(false);
            if (status === "open" || status === "group") {
                setCurrentTicket({ ...ticket, code: "#" + status });
                handleSelectTicket(ticket);

                history.push(`/tickets/${ticket.uuid}`);
            } else {
                setCurrentTicket({ id: null, code: null })
                history.push("/tickets");
            }
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };

    const handleAcepptTicket = async (id) => {
        setLoading(true);
        try {
            const otherTicket = await api.put(`/tickets/${id}`, {
                status: ticket.isGroup ? "group" : "open",
                userId: user?.id,
            });
            if (otherTicket.data.id !== ticket.id) {
                if (otherTicket.data.userId !== user?.id) {
                    setOpenAlert(true)
                    setUserTicketOpen(otherTicket.data.user.name)
                    setQueueTicketOpen(otherTicket.data.queue.name)
                } else {
                    setLoading(false);
                    handleSelectTicket(otherTicket.data);

                    history.push(`/tickets/${otherTicket.data.uuid}`);
                }
            } else {
                if (isMounted.current) {
                    setLoading(false);
                }

                handleSelectTicket(ticket);
                history.push(`/tickets/${ticket.uuid}`);
            }
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };

    return (
        <>
            {openAlert && (
                <ShowTicketOpen
                    isOpen={openAlert}
                    handleClose={handleCloseAlert}
                    user={userTicketOpen}
                    queue={queueTicketOpen}
                />
            )}
            {acceptTicketWithouSelectQueueOpen && (
                <AcceptTicketWithouSelectQueue
                    modalOpen={acceptTicketWithouSelectQueueOpen}
                    onClose={(e) => setAcceptTicketWithouSelectQueueOpen(false)}
                    ticketId={ticket.id}
                    ticket={ticket}
                />
            )}
            {showTicketLogOpen && (
                <ShowTicketLogModal
                    isOpen={showTicketLogOpen}
                    handleClose={(e) => setShowTicketLogOpen(false)}
                    logs={logTicket}
                />
            )}
            {openTicketMessageDialog && (
                <TicketMessagesDialog
                    open={openTicketMessageDialog}
                    handleClose={() => setOpenTicketMessageDialog(false)}
                    ticketId={ticket.id}
                />
            )}
            <div className={classes.actionButtons}>
                <IconButton
                    className={classes.bottomButtonVisibilityIcon}
                    onClick={() => setOpenTicketMessageDialog(true)}
                >
                    <Tooltip title={i18n.t("ticketsList.buttons.exportAsPDF")}>
                        <PictureAsPdf />

                    </Tooltip>
                </IconButton>

                {ticket.status === "closed" && (ticket.queueId === null || ticket.queueId === undefined) && (
                    <ButtonWithSpinner
                        loading={loading}
                        startIcon={<Replay />}
                        size="small"
                        onClick={e => handleOpenAcceptTicketWithouSelectQueue()}
                    >
                        {i18n.t("messagesList.header.buttons.reopen")}
                    </ButtonWithSpinner>
                )}
                {(ticket.status === "closed" && ticket.queueId !== null) && (
                    <ButtonWithSpinner
                        startIcon={<Replay />}
                        loading={loading}
                        onClick={e => handleAcepptTicket(ticket.id)}
                    >
                        {i18n.t("messagesList.header.buttons.reopen")}
                    </ButtonWithSpinner>
                )}
                <IconButton
                    className={classes.bottomButtonVisibilityIcon}
                    onClick={handleShowLogTicket}
                >
                    <Tooltip title={i18n.t("messagesList.header.buttons.logTicket")}>
                        <History />

                    </Tooltip>
                </IconButton>
                {(ticket.status === "open" || ticket.status === "group") && (
                    <>
                        {/* {!showSelectMessageCheckbox ? ( */}
                        <>

                            <IconButton
                                className={classes.bottomButtonVisibilityIcon}
                                onClick={handleEnableIntegration}
                            >
                                <Tooltip title={i18n.t("messagesList.header.buttons.enableIntegration")}>
                                    {enableIntegration === true ? <DeviceHubOutlined style={{ color: "green" }} /> : <DeviceHubOutlined />}

                                </Tooltip>
                            </IconButton>

                            <IconButton className={classes.bottomButtonVisibilityIcon}>
                                <Tooltip title={i18n.t("messagesList.header.buttons.resolve")}>
                                    <HighlightOffIcon
                                        // color="primary"
                                        onClick={handleClickOpen}
                                    />
                                </Tooltip>
                            </IconButton>

                            <IconButton className={classes.bottomButtonVisibilityIcon}>
                                <Tooltip title={i18n.t("tickets.buttons.returnQueue")}>
                                    <UndoIcon
                                        // color="primary"
                                        onClick={(e) => handleUpdateTicketStatus(e, "pending", null)}
                                    />
                                </Tooltip>
                            </IconButton>

                            <IconButton className={classes.bottomButtonVisibilityIcon}>
                                <Tooltip title="Transferir Ticket">
                                    <SwapHorizOutlined
                                        // color="primary"
                                        onClick={handleOpenTransferModal}
                                    />
                                </Tooltip>
                            </IconButton>
                        </>
                        {/* // ) : (
                        //     <IconButton className={classes.bottomButtonVisibilityIcon}>
                        //         <Tooltip title={i18n.t("messageOptionsMenu.forward")}>
                        //             <BiSend
                        //                 // color="primary"
                        //                 onClick={handleOpenModalForward}
                        //             />
                        //         </Tooltip>
                        //     </IconButton>
                        // )} */}

                        {showSchedules && (
                            <>
                                <IconButton className={classes.bottomButtonVisibilityIcon}>
                                    <Tooltip title={i18n.t("tickets.buttons.scredule")}>
                                        <EventIcon
                                            // color="primary"
                                            onClick={handleOpenScheduleModal}
                                        />
                                    </Tooltip>
                                </IconButton>
                            </>
                        )}

                        <MenuItem className={classes.bottomButtonVisibilityIcon}>
                            <Tooltip title={i18n.t("ticketOptionsMenu.acceptAudioMessage")}>
                                <Switch
                                    size="small"
                                    // color="primary"
                                    checked={acceptAudioMessage}
                                    onChange={() => handleContactToggleAcceptAudio()}
                                />
                            </Tooltip>
                        </MenuItem>

                        <Can
                            role={user.profile}
                            perform="ticket-options:deleteTicket"
                            yes={() => (
                                <IconButton className={classes.bottomButtonVisibilityIcon}>
                                    <Tooltip title={i18n.t("tickets.buttons.deleteTicket")}>
                                        <DeleteOutlineIcon
                                            // color="primary"
                                            onClick={handleOpenConfirmationModal}
                                        />
                                    </Tooltip>
                                </IconButton>
                            )}
                        />

                        {confirmationOpen && (
                            <ConfirmationModal
                                title={`${i18n.t("ticketOptionsMenu.confirmationModal.title")} #${ticket.id}?`}
                                open={confirmationOpen}
                                onClose={setConfirmationOpen}
                                onConfirm={handleDeleteTicket}
                            >
                                {i18n.t("ticketOptionsMenu.confirmationModal.message")}
                            </ConfirmationModal>
                        )}
                        {transferTicketModalOpen && (
                            <TransferTicketModalCustom
                                modalOpen={transferTicketModalOpen}
                                onClose={handleCloseTransferTicketModal}
                                ticketid={ticket.id}
                                ticket={ticket}
                            />
                        )}
                        {scheduleModalOpen && (
                            <ScheduleModal
                                open={scheduleModalOpen}
                                onClose={handleCloseScheduleModal}
                                aria-labelledby="form-dialog-title"
                                contactId={contactId}
                            />
                        )}

                    </>
                )}
                {ticket.status === "pending" && (ticket.queueId === null || ticket.queueId === undefined) && (
                    <ButtonWithSpinner
                        loading={loading}
                        size="small"
                        variant="contained"
                        onClick={e => handleOpenAcceptTicketWithouSelectQueue()}
                    >
                        {i18n.t("messagesList.header.buttons.accept")}
                    </ButtonWithSpinner>
                )}
                {ticket.status === "pending" && ticket.queueId !== null && (
                    <ButtonWithSpinner
                        loading={loading}
                        size="small"
                        variant="contained"
                        // color="primary"
                        onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
                    >
                        {i18n.t("messagesList.header.buttons.accept")}
                    </ButtonWithSpinner>
                )}
            </div>
            <>
                <Formik
                    enableReinitialize={true}
                    validationSchema={SessionSchema}
                    innerRef={formRef}
                    onSubmit={(values, actions) => {
                        setTimeout(() => {
                            actions.setSubmitting(false);
                            actions.resetForm();
                        }, 400);
                    }}
                >
                    {({ values, touched, errors, isSubmitting, setFieldValue, resetForm }) => (
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <Form>
                                <DialogActions className={classes.botoes}>
                                    <Button
                                        onClick={e => handleCloseTicketWithoutFarewellMsg()}
                                        style={{ background: "#065183", color: "white" }}
                                    >
                                        {i18n.t("messagesList.header.dialogRatingWithoutFarewellMsg")}
                                    </Button>

                                    <Button
                                        onClick={e => handleUpdateTicketStatus(e, "closed", user?.id, ticket?.queue?.id)}
                                        style={{ background: "#065183", color: "white" }}
                                    >
                                        {i18n.t("messagesList.header.dialogRatingCancel")}
                                    </Button>
                                </DialogActions>
                            </Form>
                        </Dialog>
                    )}
                </Formik>
            </>
        </>
    );
};

export default TicketActionButtonsCustom;
