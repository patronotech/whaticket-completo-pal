import api from "../../services/api";
import toastError from "../../errors/toastError";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { socketConnection } from "../../services/socket";

const useUserMoments = () => {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/usersMoments");

        setUsers(data);
        setUpdate(false);
      } catch (err) {
        if (err.response?.status !== 500) {
          toastError(err);
        } else {
          toast.error(`${i18n.t("frontEndErrors.getUsers")}`);
        }
      }
    })();
  }, [update]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-ticket`, (data) => {
      if (data.action === "update" || data.action === "create") {
        // console.log(data)
        setUpdate(!update);
      }
      if (data.action === "delete") {
        setUpdate(!update);
      }
    });

    socket.on(`company-${companyId}-appMessage`, (data) => {
      // console.log(data)
      if (data.action === "create") {
        setUpdate(!update);
      }

      if (data.action === "update") {
        setUpdate(!update);
      }
      if (data.action === "delete") {
        setUpdate(!update);
      }
    });

    return () => {
      socket.disconnect();
    };
  });

  return { users };
};

export default useUserMoments;
