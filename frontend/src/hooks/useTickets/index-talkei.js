import { useState, useEffect } from "react";
// import { getHoursCloseTicketsAuto } from "../../config";
import toastError from "../../errors/toastError";

import api from "../../services/api";

const useTickets = ({
    searchParam,
    pageNumber,
    status,
    date,
    dateStart,
    dateEnd,
    showAll,
    queueIds,
    withUnreadMessages,
    tags,
    contacts,
    updatedStart,
    updatedEnd,
    connections,
    users,
    statusFilter,
    queuesFilter,
    isGroup,
}) => {
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            const fetchTickets = async () => {
                try {
                    const { data } = await api.get("/tickets", {
                        params: {
                            searchParam,
                            pageNumber,
                            status,
                            date,
                            dateStart,
                            dateEnd,
                            showAll,
                            queueIds,
                            withUnreadMessages,
                            tags,
                            contacts,
                            updatedStart,
                            updatedEnd,
                            connections,
                            users,
                            statusFilter,
                            queuesFilter,
                            isGroup,
                        },
                    });
                    setTickets(data.tickets);

                    // let horasFecharAutomaticamente = getHoursCloseTicketsAuto();

                    // if (
                    //     status === "open" &&
                    //     horasFecharAutomaticamente &&
                    //     horasFecharAutomaticamente !== "" &&
                    //     horasFecharAutomaticamente !== "0" &&
                    //     Number(horasFecharAutomaticamente) > 0
                    // ) {
                    //     let dataLimite = new Date();
                    //     // dataLimite.setHours(
                    //     //     dataLimite.getHours() -
                    //     //         Number(horasFecharAutomaticamente)
                    //     // );

                    //     dataLimite.setMinutes(
                    //         dataLimite.getMinutes() -
                    //             Number(horasFecharAutomaticamente)
                    //     );

                    //     data.tickets.forEach((ticket) => {
                    //         if (ticket.status !== "closed") {
                    //             let dataUltimaInteracaoChamado = new Date(
                    //                 ticket.updatedAt
                    //             );
                    //             if (dataUltimaInteracaoChamado < dataLimite)
                    //                 closeTicket(ticket);
                    //         }
                    //     });
                    // }

                    setHasMore(data.hasMore);
                    setCount(data.count);
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    toastError(err);
                }
            };

            // const closeTicket = async (ticket) => {
            //     await api.put(`/tickets/${ticket.id}`, {
            //         status: "closed",
            //         userId: ticket.userId || null,
            //     });
            // };

            fetchTickets();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [
        searchParam,
        pageNumber,
        status,
        date,
        dateStart,
        dateEnd,
        showAll,
        queueIds,
        withUnreadMessages,
        tags,
        contacts,
        updatedStart,
        updatedEnd,
        connections,
        users,
        statusFilter,
        queuesFilter,
        isGroup,
    ]);

    return { tickets, loading, hasMore, count };
};

export default useTickets;
