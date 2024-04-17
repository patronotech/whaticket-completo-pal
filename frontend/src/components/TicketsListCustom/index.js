import React, { useState, useEffect, useReducer, useContext, useMemo } from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";

import TicketListItem from "../TicketListItemCustom";
import TicketsListSkeleton from "../TicketsListSkeleton";

import useTickets from "../../hooks/useTickets";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { socketConnection } from "../../services/socket";

const useStyles = makeStyles((theme) => ({
    ticketsListWrapper: {
        position: "relative",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        overflow: "hidden",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },

    ticketsList: {
        flex: 1,
        maxHeight: "100%",
        overflowY: "scroll",
        ...theme.scrollbarStyles,
        borderTop: "2px solid rgba(0, 0, 0, 0.12)",
    },

    ticketsListHeader: {
        color: "rgb(67, 83, 105)",
        zIndex: 2,
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },

    ticketsCount: {
        fontWeight: "normal",
        color: "rgb(104, 121, 146)",
        marginLeft: "8px",
        fontSize: "14px",
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

    noTicketsDiv: {
        display: "flex",
        // height: "190px",
        margin: 40,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
}));

const reducer = (state, action) => {
    if (action.type === "LOAD_TICKETS") {
        const newTickets = action.payload;

        newTickets.forEach((ticket) => {
            const ticketIndex = state.findIndex((t) => t.id === ticket.id);
            if (ticketIndex !== -1) {
                state[ticketIndex] = ticket;
                if (ticket.unreadMessages > 0) {
                    state.unshift(state.splice(ticketIndex, 1)[0]);
                }
            } else {
                state.push(ticket);
            }
        });

        return [...state];
    }

    if (action.type === "RESET_UNREAD") {
        const ticketId = action.payload;

        const ticketIndex = state.findIndex((t) => t.id === ticketId);
        if (ticketIndex !== -1) {
            state[ticketIndex].unreadMessages = 0;
        }

        return [...state];
    }

    if (action.type === "UPDATE_TICKET") {
        const ticket = action.payload;

        const ticketIndex = state.findIndex((t) => t.id === ticket.id);
        if (ticketIndex !== -1) {
            state[ticketIndex] = ticket;
        } else {
            state.unshift(ticket);
        }

        return [...state];
    }

    if (action.type === "UPDATE_TICKET_UNREAD_MESSAGES") {
        const ticket = action.payload;

        const ticketIndex = state.findIndex((t) => t.id === ticket.id);
        if (ticketIndex !== -1) {
            state[ticketIndex] = ticket;
            state.unshift(state.splice(ticketIndex, 1)[0]);
        } else {
            state.unshift(ticket);
        }

        return [...state];
    }


    if (action.type === "UPDATE_TICKET_CONTACT") {
        const contact = action.payload;
        const ticketIndex = state.findIndex((t) => t.contactId === contact.id);
        if (ticketIndex !== -1) {
            state[ticketIndex].contact = contact;
        }
        return [...state];
    }

    if (action.type === "DELETE_TICKET") {
        const ticketId = action.payload;
        const ticketIndex = state.findIndex((t) => t.id === ticketId);
        if (ticketIndex !== -1) {
            state.splice(ticketIndex, 1);
        }

        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }
};

const TicketsListCustom = (props) => {
    const {
        handleChangeTab,
        status,
        searchParam,
        tags,
        users,
        showAll,
        selectedQueueIds,
        updateCount,
        style,
        whatsappIds,
        forceSearch,
        statusFilter,
        userFilter
    } = props;

    const classes = useStyles();
    const [pageNumber, setPageNumber] = useState(1);
    const [ticketsList, dispatch] = useReducer(reducer, []);
    const { user } = useContext(AuthContext);
    const { profile, queues } = user;
    const allTicket = user.allTicket === 'enable';

    const allHistoric = user.allHistoric === 'enabled';
    const allowGroup = user.allowGroup;

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [status, searchParam, dispatch, showAll, tags, users, forceSearch, selectedQueueIds, whatsappIds, statusFilter]);

    const { tickets, hasMore, loading } = useTickets({
        pageNumber,
        searchParam,
        status,
        showAll,
        tags: JSON.stringify(tags),
        users: JSON.stringify(users),
        queueIds: JSON.stringify(selectedQueueIds),
        whatsappIds: JSON.stringify(whatsappIds),
        statusFilter: JSON.stringify(statusFilter),
        userFilter
    });


    useEffect(() => {
        // const queueIds = queues.map((q) => q.id);
        // const filteredTickets = tickets.filter(
        //     (t) => queueIds.indexOf(t.queueId) > -1
        // );
        // const allticket = user.allTicket === 'enabled';
        // if (profile === "admin" || allTicket || allowGroup || allHistoric) {
        dispatch({ type: "LOAD_TICKETS", payload: tickets });
        // } else {
        //  dispatch({ type: "LOAD_TICKETS", payload: filteredTickets });
        // }

    }, [tickets]);

    useEffect(() => {
        const companyId = user.companyId;


        const shouldUpdateTicketAdmin = (ticket) =>
            (!ticket?.userId || ticket?.userId === user?.id || showAll) &&
            (!ticket?.queueId || selectedQueueIds.indexOf(ticket?.queueId) > -1);

        const shouldUpdateTicketUser = (ticket) =>
            selectedQueueIds.indexOf(ticket?.queueId) > -1 && (ticket?.userId === user?.id || !ticket?.userId);

        const notBelongsToUserQueues = (ticket) =>
            ticket.queueId && selectedQueueIds.indexOf(ticket.queueId) === -1;
        const socket = socketConnection({ companyId, userId: user.id });
        socket.on("connect", () => {
            if (status) {
                socket.emit("joinTickets", status);
            } else {
                socket.emit("joinNotification");
            }
        });

        socket.on(`company-${companyId}-ticket`, (data) => {
            if (data.action === "updateUnread") {
                dispatch({
                    type: "RESET_UNREAD",
                    payload: data.ticketId,
                });
            }

            if (data.action === "update" && (user.profile === "admin" || allTicket) ? shouldUpdateTicketAdmin(data.ticket) : shouldUpdateTicketUser(data.ticket)) {
                dispatch({
                    type: "UPDATE_TICKET",
                    payload: data.ticket,
                });
            }

            if (data.action === "update" && notBelongsToUserQueues(data.ticket)) {
                dispatch({ type: "DELETE_TICKET", payload: data.ticket.id });
            }

            if (data.action === "delete") {
                dispatch({ type: "DELETE_TICKET", payload: data.ticketId });
            }
        });

        socket.on(`company-${companyId}-appMessage`, (data) => {
            const queueIds = queues.map((q) => q.id);
            if (
                profile === "user" &&
                (queueIds.indexOf(data.ticket.queue?.id) === -1 ||
                    data.ticket.queue === null)
            ) {
                return;
            }

            if (data.action === "create" && (user.profile === "admin" || allTicket) ? shouldUpdateTicketAdmin(data.ticket) : shouldUpdateTicketUser(data.ticket)) {
                dispatch({
                    type: "UPDATE_TICKET_UNREAD_MESSAGES",
                    payload: data.ticket,
                });
            }
        });

        socket.on(`company-${companyId}-contact`, (data) => {
            if (data.action === "update") {
                dispatch({
                    type: "UPDATE_TICKET_CONTACT",
                    payload: data.contact,
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [status, searchParam, showAll, user, selectedQueueIds, tags, users, profile, queues, whatsappIds, statusFilter, allTicket]);

    useEffect(() => {
        if (typeof updateCount === "function") {
            updateCount(ticketsList.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketsList]);

    const loadMore = () => {
        setPageNumber((prevState) => prevState + 1);
    };

    const handleScroll = (e) => {
        if (!hasMore || loading) return;

        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollHeight - (scrollTop + 100) < clientHeight) {
            loadMore();
        }
    };

    return (
        <Paper className={classes.ticketsListWrapper} style={style}>
            <Paper
                square
                name="closed"
                elevation={0}
                className={classes.ticketsList}
                onScroll={handleScroll}
            >
                <List style={{ paddingTop: 0 }} >
                    {ticketsList.length === 0 && !loading ? (
                        <div className={classes.noTicketsDiv}>
                            <span className={classes.noTicketsTitle}>
                                {i18n.t("ticketsList.noTicketsTitle")}
                            </span>
                            <p className={classes.noTicketsText}>
                                {i18n.t("ticketsList.noTicketsMessage")}
                            </p>
                        </div>
                    ) : (
                        <>
                            {ticketsList.map((ticket) => (
                                // <List key={ticket.id}>
                                //     {console.log(ticket)}
                                    <TicketListItem
                                        ticket={ticket}
                                        key={ticket.id}
                                        handleChangeTab={handleChangeTab}
                                    />
                                // </List>
                            ))}
                        </>
                    )}
                    {loading && <TicketsListSkeleton />}
                </List>
            </Paper>
        </Paper>
    );
};

export default TicketsListCustom;
