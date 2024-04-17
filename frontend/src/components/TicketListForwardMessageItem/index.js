import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { green } from "@material-ui/core/colors";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { format, isSameDay, parseISO } from "date-fns";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MarkdownWrapper from "../MarkdownWrapper";

const useStyles = makeStyles(theme => ({
    ticket: {
        position: "relative",
    },

    pendingTicket: {
        cursor: "unset",
    },

    noTicketsDiv: {
        display: "flex",
        height: "100px",
        margin: 40,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },

    noTicketsText: {
        textAlign: "center",
        color: "rgb(104, 121, 146)",
        fontSize: "14px",
        lineHeight: "1.4",
    },

    noTicketsTitle: {
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "600",
        margin: "0px",
    },

    contactNameWrapper: {
        display: "flex",
        justifyContent: "space-between",
    },

    lastMessageTime: {
        justifySelf: "flex-end",
    },

    closedBadge: {
        alignSelf: "center",
        justifySelf: "flex-end",
        marginRight: 32,
        marginLeft: "auto",
    },

    contactLastMessage: {
        paddingRight: 20,
    },

    newMessagesCount: {
        alignSelf: "center",
        marginRight: 8,
        marginLeft: "auto",
    },

    badgeStyle: {
        color: "white",
        backgroundColor: green[500],
    },

    acceptButton: {
        position: "absolute",
        left: "50%",
    },

    selectedTicketText: {
        color: "white",
    }
}));

const TicketListForwardMessageItem = ({ ticket, selectedTicket, sendData }) => {
    const classes = useStyles();
    const { ticketId } = useParams();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleSelectTicket = (e, ticket) => {
        sendData(ticket)
    };

    return (
        <React.Fragment key={ticket.id}>
            <ListItem
                dense
                button
                onClick={e => {
                    if (ticket.status === "pending") return;
                    handleSelectTicket(e, ticket);
                }}
                selected={ticketId && +ticketId === ticket.id}
                className={clsx(classes.ticket, {
                    [classes.pendingTicket]: ticket.status === "pending"
                })}
            >
                <ListItemAvatar>
                    <Avatar
                        src={ticket.contact.urlPicture && ticket.contact.urlPicture}
                    ></Avatar>
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={
                        <span className={classes.contactNameWrapper}>
                            <Typography
                                noWrap
                                component="span"
                                variant="body2"
                                color="textPrimary"
                                className={clsx({ [classes.selectedTicketText]: ticket === selectedTicket })}
                            >
                                {ticket.contact.name}
                            </Typography>
                            {ticket.status === "closed" && (
                                <Badge
                                    className={classes.closedBadge}
                                    badgeContent={"closed"}
                                    color="primary"
                                />
                            )}
                            {ticket.lastMessage && (
                                <Typography
                                    className={clsx(classes.lastMessageTime, { [classes.selectedTicketText]: ticket === selectedTicket })}
                                    component="span"
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                                        <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                                    ) : (
                                        <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                                    )}
                                </Typography>
                            )}
                        </span>
                    }
                    secondary={
                        <span className={classes.contactNameWrapper}>
                            <Typography
                                className={clsx(classes.contactLastMessage, { [classes.selectedTicketText]: ticket === selectedTicket })}
                                noWrap
                                component="span"
                                variant="body2"
                                color="textSecondary"
                            >
                                {ticket.lastMessage ? (
                                    <MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>
                                ) : (
                                    <br />
                                )}
                            </Typography>

                            <Badge
                                className={classes.newMessagesCount}
                                badgeContent={ticket.unreadMessages}
                                classes={{
                                    badge: classes.badgeStyle,
                                }}
                            />
                        </span>
                    }
                />
            </ListItem>
        </React.Fragment>
    );
};

export default TicketListForwardMessageItem;