import api from "../../services/api";
import toastError from "../../errors/toastError";
import openSocket from "socket.io-client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";

const useUser = () => {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    (async () => {
      if (update) {
        try {
          const { data } = await api.get("/users");
          setUsers(data.users);
          setUpdate(false);
        } catch (err) {
          if (err.response?.status !== 500) {
            toastError(err);
          } else {
            toast.error(`${i18n.t("frontEndErrors.getUsers")}`);
          }
        }
      }
    })();
  });

  useEffect(() => {
    const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

    socket.on("users", (data) => {
      setUpdate(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [users]);

  return { users };
};

export default useUser;
