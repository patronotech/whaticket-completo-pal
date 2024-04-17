import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import toastError from "../../errors/toastError";
import api from "../../services/api";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { AuthContext } from "../../context/Auth/AuthContext";
import { v4 as uuidv4 } from "uuid";

import { Button, Divider, } from "@material-ui/core";
import { isNil } from 'lodash';
import ShowTicketOpen from '../ShowTicketOpenModal';
import { TicketsContext } from '../../context/Tickets/TicketsContext';

const VcardPreview = ({ contact, numbers, queueId, whatsappId }) => {

    const history = useHistory();
    const { user } = useContext(AuthContext);

    const companyId = user.companyId;

    const [ openAlert, setOpenAlert ] = useState(false);
	const [ userTicketOpen, setUserTicketOpen] = useState("");
	const [ queueTicketOpen, setQueueTicketOpen] = useState("");
    const { setCurrentTicket } = useContext(TicketsContext);

    const [selectedContact, setContact] = useState({
        id: 0,
        name: "",
        number: 0,
        profilePicUrl: ""
    });

    // useEffect(() => {
    //     const delayDebounceFn = setTimeout(() => {
    //         const fetchContacts = async () => {
    //             try {
    //                 const number = numbers.replace(/\D/g, "");
    //                 const { data } = await api.get(`/contacts/profile/${number}`);

    //                 let obj = {
    //                     id: data.contactId,
    //                     name: contact,
    //                     number: numbers,
    //                     profilePicUrl: data.profilePicUrl
    //                 }

    //                 setContact(obj)

    //             } catch (err) {
    //                 console.log(err)
    //                 toastError(err);
    //             }
    //         };
    //         fetchContacts();
    //     }, 500);
    //     return () => clearTimeout(delayDebounceFn);
    // }, [contact, numbers]);
    const handleSelectTicket = (ticket) => {
        const code = uuidv4();
        const { id, uuid } = ticket;
        setCurrentTicket({ id, uuid, code });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const fetchContacts = async () => {
                try {
                    if (isNil(numbers)) {
                        return
                    }
                    const number = numbers.replace(/\D/g, "");
                    const getData = await api.get(`/contacts/profile/${number}`);

                    if (getData.data.contactId && getData.data.contactId !== 0) {
                        let obj = {
                            id: getData.data.contactId,
                            name: contact,
                            number: numbers,
                            profilePicUrl: getData.data.urlPicture
                        }

                        setContact(obj)
                    } else {
                        let contactObj = {
                            name: contact,
                            number: number,
                            email: "",
                            companyId: companyId
                        }

                        const { data } = await api.post("/contacts", contactObj);
                        setContact(data)
                    }

                } catch (err) {
                    console.log(err)
                    toastError(err);
                }
            };
            fetchContacts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [contact, numbers]);

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setOpenAlert(false);
        setUserTicketOpen("");
        setQueueTicketOpen("");
      };

    const handleNewChat = async () => {
        try {
            const { data: ticket } = await api.post("/tickets", {
                contactId: selectedContact.id,
                userId: user.id,
                status: "open",
                queueId,
                companyId: companyId,
                whatsappId
            });
            handleSelectTicket(ticket);

            history.push(`/tickets/${ticket.uuid}`);
        } catch (err) {
            const ticket  = JSON.parse(err.response.data.error);

            if (ticket.userId !== user?.id) {
              setOpenAlert(true);
              setUserTicketOpen(ticket.user.name);
              setQueueTicketOpen(ticket.queue.name);
            } else {
              setOpenAlert(false);
              setUserTicketOpen("");
              setQueueTicketOpen("");
              handleSelectTicket(ticket);

              history.push(`/tickets/${ticket.uuid}`);
            }
        }
    }

    return (
        <>
            <div style={{
                minWidth: "250px",
            }}>
                <ShowTicketOpen 
                    isOpen={openAlert}
                    handleClose={handleCloseAlert}
                    user={userTicketOpen}
                    queue={queueTicketOpen}
                />
                <Grid container spacing={1}>
                    <Grid item xs={2}>
                        <Avatar src={`${selectedContact?.urlPicture}`} />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography style={{ marginTop: "12px", marginLeft: "10px" }} variant="subtitle1" color="primary" gutterBottom>
                            {selectedContact.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                        <Button
                            fullWidth
                            color="primary"
                            onClick={handleNewChat}
                            disabled={!selectedContact.number}
                        >Conversar</Button>
                    </Grid>
                </Grid>
            </div>
        </>
    );

};

export default VcardPreview;