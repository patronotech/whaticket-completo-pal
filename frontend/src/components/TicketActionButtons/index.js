import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { MoreVert, Replay } from "@material-ui/icons";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
    actionButtons: {
        marginRight: 6,
        flex: "none",
        alignSelf: "center",
        marginLeft: "auto",
        "& > *": {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
        },
    },
}));

const TicketActionButtons = ({ ticket }) => {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const ticketOptionsMenuOpen = Boolean(anchorEl);
    const { user } = useContext(AuthContext);
    const [initialState, setInitialState] = useState({
        ratingId: ""
    });
    const [dataRating, setDataRating] = useState([]);
    const [open, setOpen] = React.useState(false);
    const formRef = React.useRef(null);

    const loadRatings = async () => {
        try {
            const { data } = await api.get(`/ratings/list`);
            setDataRating(data);
        } catch (err) {
            toastError(err);
        }
    }

    const handleClickOpen = async () => {
        setInitialState({
            ratingId: ""
        });
        await loadRatings();
        setOpen(true);
    };

    const handleClose = () => {
        formRef.current.resetForm();
        setOpen(false);
    }

    const handleOpenTicketOptionsMenu = e => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseTicketOptionsMenu = e => {
        setAnchorEl(null);
    };

    const handleUpdateTicketStatus = async (e, status, userId) => {
        setLoading(true);
        try {
            await api.put(`/tickets/${ticket.id}`, {
                status: status,
                userId: userId || null,
            });

            setLoading(false);
            if (status === "open") {
                history.push(`/tickets/${ticket.id}`);
            } else {
                history.push("/tickets");
            }
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };

    return (
        <>
            <div className={classes.actionButtons}>
                {ticket.status === "closed" && (
                    <ButtonWithSpinner
                        loading={loading}
                        startIcon={<Replay />}
                        size="small"
                        onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
                    >
                        {i18n.t("messagesList.header.buttons.reopen")}
                    </ButtonWithSpinner>
                )}
                {ticket.status === "open" && (
                    <>
                        <ButtonWithSpinner
                            loading={loading}
                            startIcon={<Replay />}
                            size="small"
                            onClick={e => handleUpdateTicketStatus(e, "pending", null)}
                        >
                            {i18n.t("messagesList.header.buttons.return")}
                        </ButtonWithSpinner>
                        <ButtonWithSpinner
                            loading={loading}
                            size="small"
                            variant="contained"
                            color="primary"
                            // onClick={e => handleUpdateTicketStatus(e, "closed", user?.id)}
                            onClick={handleClickOpen}
                        >
                            {i18n.t("messagesList.header.buttons.resolve")}
                        </ButtonWithSpinner>
                        <IconButton onClick={handleOpenTicketOptionsMenu}>
                            <MoreVert />
                        </IconButton>
                        <TicketOptionsMenu
                            ticket={ticket}
                            anchorEl={anchorEl}
                            menuOpen={ticketOptionsMenuOpen}
                            handleClose={handleCloseTicketOptionsMenu}
                        />
                    </>
                )}
                {ticket.status === "pending" && (
                    <ButtonWithSpinner
                        loading={loading}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
                    >
                        {i18n.t("messagesList.header.buttons.accept")}
                    </ButtonWithSpinner>
                )}
            </div>
            <>
                <Formik
                    initialValues={initialState}
                    enableReinitialize={true}
                    validationSchema={SessionSchema}
                    innerRef={formRef}
                    onSubmit={(values, actions) => {
                        handleSendRating(user?.id, values.ratingId);
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
                                <DialogTitle id="alert-dialog-title">{i18n.t("messagesList.header.dialogRatingTitle")}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <div style={{ marginTop: 8 }}>
                                            <Autocomplete
                                                size="small"
                                                options={dataRating}
                                                name="ratingId"
                                                getOptionLabel={(option) => option.name}
                                                onChange={(e, value) => setFieldValue("ratingId", value?.id || "")}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        error={touched.ratingId && Boolean(errors.ratingId)}
                                                        helperText={touched.ratingId && errors.ratingId}
                                                        variant="outlined"
                                                        placeholder={i18n.t("messagesList.header.ratingTitle")}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={e => handleUpdateTicketStatus(e, "closed", user?.id, ticket?.queue?.id)} color="primary">
                                        {i18n.t("messagesList.header.dialogRatingCancel")}
                                    </Button>
                                    <Button disabled={isSubmitting} variant="contained" type="submit" color="primary" >
                                        {i18n.t("messagesList.header.dialogRatingSuccess")}
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

export default TicketActionButtons;