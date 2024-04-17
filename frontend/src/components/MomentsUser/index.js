import React, { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";

import { AuthContext } from "../../context/Auth/AuthContext";
import { Inbox, ReportProblem } from "@mui/icons-material";
import UserStatusIcon from "../UserModal/statusIcon";
import { socketConnection } from "../../services/socket";
import { toast } from "react-toastify";
import { yellow } from "@mui/material/colors";
import { Avatar, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography, Card, makeStyles, Container, Badge, Grid } from "@material-ui/core";
import { format, isSameDay, parseISO } from "date-fns";
import { grey } from "@material-ui/core/colors";
import { getBackendUrl } from "../../config";

const backendUrl = getBackendUrl();

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    justifyContent: "space-between",
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  cardHeader: {
    width: "380px",
    height: "78px",
    padding: 10,
    backgroundColor: "#DCDCDC",
  },
  cardHeaderPending: {
    width: "380px",
    height: "78px",
    padding: 10,
    backgroundColor: "#C0C0C0",
  },
  card: {
    height: "300px",
    width: "380px",
    margin: "3px",
    borderRadius: 5,
    flex: 1,
    maxHeight: "100%",
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    borderTop: "2px solid rgba(0, 0, 0, 0.12)",
  },
  changeWarap: {
    width: '380px',
    padding: 0,
    margin: 0
  },
  pending: {
    color: yellow[600],
    fontSize: '20px'
  },
  connectionTag: {
    background: "green",
    color: "#FFF",
    marginRight: 1,
    padding: 1,
    fontWeight: 'bold',
    // paddingLeft: 5,
    // paddingRight: 5,
    borderRadius: 3,
    fontSize: "0.6em",
    // whiteSpace: "nowrap"
  },
  lastMessageTime: {
    justifySelf: "flex-end",
    textAlign: "right",
    position: "relative",
    // top: -30,
    marginRight: "1px",
    color: grey[400],
  },

  lastMessageTimeUnread: {
    justifySelf: "flex-end",
    textAlign: "right",
    position: "relative",
    // top: -30,
    color: "green",
    fontWeight: "bold",
    marginRight: "1px",
  },
  pending: {
    color: yellow[600],
    fontSize: '20px'
  },
}));

const DashboardManage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [update, setUpdate] = useState(true);
  const [ticketNot, setTicketNot] = useState(null);
  const companyId = user.companyId;


  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);

  useEffect(() => {
    setTicketNot(0);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/usersMoments");

        setTickets(data);
        setTicketNot(null);
      } catch (err) {
        if (err.response?.status !== 500) {
          toastError(err);
        } else {
          toast.error(`${i18n.t("frontEndErrors.getUsers")}`);
        }
      }
    })();
  }, [user, ticketNot]);

  useEffect(() => {
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on("connect", () => socket.emit("joinNotification"));

    socket.on(`company-${companyId}-appMessage`, (data) => {
      if (data.action === "create") {
        setTicketNot(data.ticket.id);
      }

      if (data.action === "update") {
        setTicketNot(data.ticket.id);
      }
      if (data.action === "delete") {
        setTicketNot(data.ticketId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const Moments = useMemo(() => {
    if (tickets && tickets.length > 0) {
      const ticketsByUser = tickets.reduce((userTickets, ticket) => {
        const user = ticket.user;

        if (user) {
          const userIndex = userTickets.findIndex((group) => group.user.id === user.id);
          if (userIndex === -1) {
            userTickets.push({
              user,
              userTickets: [ticket],
            });
          } else {
            userTickets[userIndex].userTickets.push(ticket);
          }
        }
        return userTickets;
      }, []);

      return ticketsByUser.map((group, index) => (
        <Grid item key={index}>
          <div padding={20} className={classes.main} key={index}>
            <div className={classes.changeWarap}>
              <Paper elevation={3} className={classes.cardHeader}>
                <CardHeader
                  style={{ maxWidth: '380px', width: '100%' }}
                  avatar={<Avatar alt={`${group.user.profileImage}`} src={group.user.profileImage? `${backendUrl}/public/company${companyId}/user/${group.user.profileImage}` : null} />}
                  title={(
                    <span>{group?.user?.name || "Pendentes"} <br />
                      {`Atendimentos: ${group.userTickets?.length}`}
                    </span>
                  )}
                />
              </Paper>
              <Paper square elevation={1} className={classes.card}>
                {group.userTickets.map((ticket) => (
                  <List style={{ paddingTop: 0 }} key={ticket.id}>
                    <ListItem dense button>
                      <ListItemAvatar>
                        <Avatar alt={`${ticket.contact.urlPicture}`} src={`${ticket.contact.urlPicture}`} />
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={ticket?.contact?.name?.length > 30 ? ticket?.contact?.name.substring(0,25) + '...' : ticket?.contact?.name}
                        secondary={
                          <Fragment>
                            <div>
                              <Typography
                                style={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                              >
                                {`${ticket.lastMessage?.length > 30 ? String(ticket.lastMessage).substring(0, 27) + '...' : ticket.lastMessage}`}
                              </Typography>
                            </div>
                            <Badge className={classes.connectionTag}>{ticket?.whatsapp?.name}</Badge>
                            <Badge style={{ backgroundColor: ticket.queue?.color || "#7c7c7c" }} className={classes.connectionTag}>{ticket.queue?.name.toUpperCase() || "SEM FILA"}</Badge>
                          </Fragment>
                        }
                      />
                      <Typography
                        className={Number(ticket.unreadMessages) > 0 ? classes.lastMessageTimeUnread : classes.lastMessageTime}
                        component="span"
                        variant="body2"
                      >
                        {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                          <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                        ) : (
                          <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                        )}
                      </Typography>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                ))}
              </Paper>
            </div>
          </div>
        </Grid>
      )
      );
    } else {
      return null;
    }
  }, [ticketNot]);

  const MomentsPending = useMemo(() => {
    if (tickets && tickets.length > 0) {
      const pendingTickets = tickets.filter((ticket) => !ticket.user);

      return (
        <Grid item >
          <div className={classes.main}>
            <div padding={2} className={classes.changeWarap}>
              <Paper elevation={3} className={classes.cardHeaderPending}>
                <CardHeader
                  style={{ maxWidth: '380px', width: '100%' }}
                  avatar={<Avatar  />}
                  title={(
                    <span>{"Pendentes"}
                      <ReportProblem className={classes.pending} />
                      <div>
                        Atendimentos: {pendingTickets?.length}
                      </div>
                    </span>
                  )}
                />
              </Paper>
              <Paper square elevation={1} className={classes.card}>
                {pendingTickets.map((ticket) => (
                  <List style={{ paddingTop: 0 }} key={ticket.id}>
                    <ListItem dense button>
                      <ListItemAvatar>
                        <Avatar alt={`${ticket.contact.urlPicture}`} src={`${ticket.contact.urlPicture}`} />
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={ticket?.contact?.name}
                        secondary={
                          <Fragment>
                            <div>
                              <Typography
                                style={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                              >
                                {`${ticket.lastMessage?.length > 30 ? String(ticket.lastMessage).substring(0, 27) + '...' : ticket.lastMessage}`}
                              </Typography>
                            </div>
                            <Badge className={classes.connectionTag}>{ticket?.whatsapp?.name}</Badge>
                            <Badge style={{ backgroundColor: ticket.queue?.color || "#7c7c7c" }} className={classes.connectionTag}>{ticket.queue?.name.toUpperCase() || "SEM FILA"}</Badge>
                          </Fragment>
                        }
                      />
                      <Typography
                        className={Number(ticket.unreadMessages) > 0 ? classes.lastMessageTimeUnread : classes.lastMessageTime}
                        component="span"
                        variant="body2"
                      >
                        {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                          <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                        ) : (
                          <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                        )}
                      </Typography>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                ))}
              </Paper>
            </div>
          </div>
        </Grid>
      );
    } else {
      return null;
    }
  }, [ticketNot]);

  return (
    <Fragment>
      <Grid container spacing={2}>
        {Moments}
        {MomentsPending}
      </Grid>
    </Fragment>
  );
};

export default DashboardManage;
