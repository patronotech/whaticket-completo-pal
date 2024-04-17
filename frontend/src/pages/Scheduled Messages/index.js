import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import MessageModal from "../../components/MessageModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import moment from "moment";
import { socketConnection } from "../../services/socket";

const getUrlParam = (param) => {
  return new URLSearchParams(window.location.search).get(param);
};

const reducer = (state, action) => {
  if (action.type === "LOAD_SCHEDULES") {
    const schedules = action.payload;
    const newSchedules = [];

    schedules.forEach((schedule) => {
      const scheduleIndex = state.findIndex((s) => s.id === schedule.id);
      if (scheduleIndex !== -1) {
        state[scheduleIndex] = schedule;
      } else {
        newSchedules.push(schedule);
      }
    });

    return [...state, ...newSchedules];
  }

  if (action.type === "UPDATE_SCHEDULES") {
    const schedule = action.payload;
    const scheduleIndex = state.findIndex((s) => s.id === schedule.id);

    if (scheduleIndex !== -1) {
      state[scheduleIndex] = schedule;
      return [...state];
    } else {
      return [schedule, ...state];
    }
  }

  if (action.type === "DELETE_SCHEDULE") {
    const messageId = action.payload;

    const scheduleIndex = state.findIndex((s) => s.id === messageId);
    if (scheduleIndex !== -1) {
      state.splice(scheduleIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const ScheduledMessages = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [schedules, dispatch] = useReducer(reducer, []);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const [contactId, setContactId] = useState(+getUrlParam("contactId"));

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await api.get("/schedules-message", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_SCHEDULES", payload: data.schedules });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const handleOpenScheduleModalFromContactId = useCallback(() => {
    console.log(contactId)
    if (contactId) {
      handleOpenMessageModal();
    }
  }, [contactId]);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchMessages();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    searchParam,
    pageNumber,
    contactId,
    fetchMessages,
    handleOpenScheduleModalFromContactId,
  ]);

  useEffect(() => {
    handleOpenScheduleModalFromContactId();
    const socket = socketConnection({ companyId: user.companyId, userId: user.id });

    socket.on("user", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_SCHEDULES", payload: data.schedules });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.messageId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [handleOpenScheduleModalFromContactId, user]);

  const cleanContact = () => {
    setContactId("");
  };

  const handleEditSchedule = (
    message
  ) => {
    setSelectedMessage(message);
    setMessageModalOpen(true);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/schedules-message/${messageId}`);
      toast.success(i18n.t("schedules.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingMessage(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchMessages();
  };

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

  const handleOpenMessageModal = () => {
    setSelectedMessage(null);
    setMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setSelectedMessage(null);
    setMessageModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingMessage &&
          `${i18n.t("scheduledMessages.confirmationModal.deleteTitle")}`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteMessage(deletingMessage.id)}
      >
        {i18n.t("scheduledMessages.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      {messageModalOpen && (<MessageModal
        open={messageModalOpen}
        onClose={handleCloseMessageModal}
        reload={fetchMessages}
        aria-labelledby="form-dialog-title"
        messageId={
          selectedMessage ? selectedMessage.id : null
        }
        contactId={contactId}
        cleanContact={cleanContact}

      />
      )}
      <MainHeader>
        <Title>{i18n.t("scheduledMessages.title")}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenMessageModal}
          >
            {i18n.t("scheduledMessages.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nome</TableCell>
              <TableCell align="center">Data Criação</TableCell>
              <TableCell align="center">Data Alteração</TableCell>
              <TableCell align="center">Data Envio Mensagem</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {schedules ? (
                schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell align="center">{schedule.nome}</TableCell>
                    <TableCell align="center">
                      {moment(schedule.createdAt).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell align="center">
                      {moment(schedule.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell align="center">
                      {moment(schedule.data_mensagem_programada).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditSchedule(schedule)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setConfirmModalOpen(true);
                          setDeletingMessage(schedule);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              )}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default ScheduledMessages;
