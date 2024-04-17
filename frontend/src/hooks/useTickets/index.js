import { useState, useEffect } from "react";
import toastError from "../../errors/toastError";
import { format, sub } from 'date-fns'
import api from "../../services/api";

const useTickets = ({
  searchParam,
  tags,
  users,
  pageNumber,
  status,
  date,
  updatedAt,
  showAll,
  queueIds,
  withUnreadMessages,
  whatsappIds,
  statusFilter,
  forceSearch,
  userFilter
}) => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTickets = async () => {
        if (userFilter === undefined || userFilter === null) {
          try {            
            const { data } = await api.get("/tickets", {
              params: {
                searchParam,
                pageNumber,
                tags,
                users,
                status,
                date,
                updatedAt,
                showAll,
                queueIds,
                withUnreadMessages,
                whatsapps: whatsappIds,
                statusFilter
              },
            });
            
            let tickets = [];
            
            tickets = data.tickets;
          
            setTickets(tickets);
            setHasMore(data.hasMore);
            setCount(data.count)
            setLoading(false);
          } catch (err) {
            setLoading(false);
            toastError(err);
          }
        } else {
          try {
            // console.log("ENTROU AQUI DASH")
            // console.log(status,
            //   showAll,
            //   queueIds,
            //   format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'),
            //   format(new Date(), 'yyyy-MM-dd'),
            //   userFilter)

            const {data} = await api.get("/dashboard/moments", {
              params: {
                status,
                showAll,
                queueIds,
                dateStart: format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'),
                dateEnd: format(new Date(), 'yyyy-MM-dd'),
                userId: userFilter
              }
            })

            // console.log(data)
            let tickets = [];
            tickets = data.filter(item => item.userId == userFilter);            

            setTickets(tickets);
            setHasMore(null);
            setLoading(false);
          } catch (err) {
            setLoading(false);
            toastError(err);
          }
        }
      };
    fetchTickets();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    searchParam,
    tags,
    users,
    pageNumber,
    status,
    date,
    updatedAt,
    showAll,
    queueIds,
    withUnreadMessages,
    whatsappIds,
    statusFilter,
    forceSearch
  ]);

  return { tickets, loading, hasMore, count };
};

export default useTickets;
