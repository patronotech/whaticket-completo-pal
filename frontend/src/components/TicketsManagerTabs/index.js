import React, { useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Paper,
  InputBase,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Typography,
  Grid,
  Tooltip,
} from "@material-ui/core";
import {
  Group,
  MoveToInbox as MoveToInboxIcon,
  CheckBox as CheckBoxIcon,
  MessageSharp as MessageSharpIcon,
  AccessTime as ClockIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ToggleButton from "@material-ui/lab/ToggleButton";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsListCustom";
import TabPanel from "../TabPanel";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";
import { TagsFilter } from "../TagsFilter";
import { UsersFilter } from "../UsersFilter";
import { StatusFilter } from "../StatusFilter";
import { WhatsappsFilter } from "../WhatsappsFilter";
import { Button, Snackbar } from "@material-ui/core";

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { QueueSelectedContext } from "../../context/QueuesSelected/QueuesSelectedContext";
import { v4 as uuidv4 } from "uuid";

import api from "../../services/api";
import { TicketsContext } from "../../context/Tickets/TicketsContext";

const useStyles = makeStyles((theme) => ({
  ticketsWrapper: {
    position: "relative",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  tabsHeader: {
    minWidth: "auto",
    width: "auto",
    borderRadius: 8,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    // backgroundColor: "#eee",
    // backgroundColor: theme.palette.tabHeaderBackground,
  },

  settingsIcon: {
    alignSelf: "center",
    marginLeft: "auto",
    padding: theme.spacing(1),
  },

  tab: {
    minWidth: "auto",
    width: "auto",
    padding: theme.spacing(0.5, 1),
    borderRadius: 8,
    transition: "0.3s",
    borderColor: "#aaa",
    borderWidth: "1px",
    borderStyle: "solid",
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),

    [theme.breakpoints.down("lg")]: {
      fontSize: "0.9rem",
      padding: theme.spacing(0.4, 0.8),
      marginRight: theme.spacing(0.4),
      marginLeft: theme.spacing(0.4),
    },

    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
      padding: theme.spacing(0.3, 0.6),
      marginRight: theme.spacing(0.3),
      marginLeft: theme.spacing(0.3),
    },

    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },

    "&$selected": {
      color: "#FFF",
      backgroundColor: theme.palette.primary.main,
    },
  },

  tabPanelItem: {
    minWidth: "33%",
    fontSize: 11,
    marginLeft: 0,
  },

  tabIndicator: {
    height: 6,
    bottom: 0,
    borderRadius: "0 0 8px 8px",
    backgroundColor: theme.mode === "light" ? "#065183" : "#FFF",
  },
  tabsBadge: {
    top: "105%",
    right: "55%",
    transform: "translate(45%, 0)",
    whiteSpace: "nowrap",
    borderRadius: "12px",
    padding: "0 8px",
    backgroundColor: theme.mode === "light" ? "#065183" : "#FFF",
    color: theme.mode === "light" ? "#FFF" : "#065183",
  },
  ticketOptionsBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // background: "#fafafa",
    background: theme.palette.optionsBackground,
    borderRadius: 8,
    borderColor: "#aaa",
    borderWidth: "1px",
    borderStyle: "solid",
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: theme.spacing(0.5),
  },

  serachInputWrapper: {
    flex: 1,
    // background: "#fff",
    height: 40,
    background: theme.palette.total,
    display: "flex",
    borderRadius: 40,
    padding: 4,
    borderColor: "#aaa",
    borderWidth: "1px",
    borderStyle: "solid",
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },

  searchIcon: {
    color: "grey",
    marginLeft: 6,
    marginRight: 6,
    alignSelf: "center",
  },

  searchInput: {
    flex: 1,
    border: "none",
    borderRadius: 30,
  },

  badge: {
    // right: "-10px",
  },

  customBadge: {
    right: "-10px",
    backgroundColor: "#f44336",
    color: "#fff",
  },

  show: {
    display: "block",
  },

  hide: {
    display: "none !important",
  },

  closeAllFab: {
    backgroundColor: "red",
    marginBottom: "4px",
    "&:hover": {
      backgroundColor: "darkred",
    },
  },

  speedDial: {
    position: "absolute",
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    "& .MuiFab-root": {
      width: "40px",
      height: "40px",
      marginTop: "4px",
    },
    "& .MuiFab-label": {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },

  snackbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: 30,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1em",
    },
  },

  yesButton: {
    backgroundColor: "#FFF",
    color: "rgba(0, 100, 0, 1)",
    padding: "4px 4px",
    fontSize: "1em",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight: theme.spacing(1),
    "&:hover": {
      backgroundColor: "darkGreen",
      color: "#FFF",
    },
    borderRadius: 30,
  },
  noButton: {
    backgroundColor: "#FFF",
    color: "rgba(139, 0, 0, 1)",
    padding: "4px 4px",
    fontSize: "1em",
    fontWeight: "bold",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: "darkRed",
      color: "#FFF",
    },
    borderRadius: 30,
  },
  filterIcon: {
    marginRight: 6,
    alignSelf: "center",
    color: theme.mode === "light" ? "#0872b9" : "#FFF",
    cursor: "pointer",
  },
  button: {
    height: 30,
    width: 30,
    border: "2px solid",
    borderColor: "#aaa",
    borderRadius: 8,
    marginRight: 8,
    "&:hover": {
      borderColor: theme.mode === "light" ? "#065183" : "#FFF",
    },
  },
  icon: {
    color: "#aaa",
    "&:hover": {
      color: theme.mode === "light" ? "#065183" : "#FFF",
    },
  },
  buttonOpen: {
    "& $icon": {
      color: theme.mode === "light" ? "#065183" : "#FFF",
    },
  },
}));

const TicketsManagerTabs = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();

  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen, setTabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const searchInputRef = useRef();
  const { user } = useContext(AuthContext);
  const { profile } = user;
  const { setSelectedQueuesMessage } = useContext(QueueSelectedContext);

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [groupingCount, setGroupingCount] = useState(0);

  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedWhatsapp, setSelectedWhatsapp] = useState([]);
  const [forceSearch, setForceSearch] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [filter, setFilter] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isHoveredAll, setIsHoveredAll] = useState(false);
  const [isHoveredNew, setIsHoveredNew] = useState(false);
  const [isHoveredResolve, setIsHoveredResolve] = useState(false);
  const [isHoveredOpen, setIsHoveredOpen] = useState(false);
  const [isHoveredClosed, setIsHoveredClosed] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const { setCurrentTicket } = useContext(TicketsContext);

  useEffect(() => {
    setSelectedQueuesMessage(selectedQueueIds);
  }, [selectedQueueIds]);

  useEffect(() => {
    if (user.profile.toUpperCase() === "ADMIN" || user.allUserChat.toUpperCase() === "ENABLED") {
      setShowAllTickets(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "search") {
      searchInputRef.current.focus();
    }
    setForceSearch(!forceSearch);
  }, [tab]);

  let searchTimeout;

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    if (searchedTerm === "") {
      setSearchParam(searchedTerm);
      setForceSearch(!forceSearch);
      setTab("open");
      return;
    } else if (tab !== "search") {
      handleFilter();
      setTab("search");
    }

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
      setForceSearch(!forceSearch);
    }, 500);
  };

  const handleBack = () => {
    history.push("/tickets");
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  const handleChangeTabOpen = (e, newValue) => {
    if (newValue === "pending" || newValue === "group") {
      handleBack();
    }

    setTabOpen(newValue);
  };

  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const CloseAllTicket = async () => {
    try {
      const { data } = await api.post("/tickets/closeAll", {
        status: tabOpen,
        selectedQueueIds,
      });
      handleSnackbarClose();
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleSelectTicket = (ticket) => {
    const code = uuidv4();
    const { id, uuid } = ticket;
    setCurrentTicket({ id, uuid, code });
  }

  const handleCloseOrOpenTicket = (ticket) => {
    setNewTicketModalOpen(false);
    if (ticket !== undefined && ticket.uuid !== undefined) {
      handleSelectTicket(ticket);
      history.push(`/tickets/${ticket.uuid}`);
    }
  };

  const handleSelectedTags = (selecteds) => {
    const tags = selecteds.map((t) => t.id);

    clearTimeout(searchTimeout);

    if (tags.length === 0) {
      setForceSearch(!forceSearch);
    } else if (tab !== "search") {
      setTab("search");
    }

    searchTimeout = setTimeout(() => {
      setSelectedTags(tags);
      setForceSearch(!forceSearch);
    }, 500);
  };

  const handleSelectedUsers = (selecteds) => {
    const users = selecteds.map((t) => t.id);

    clearTimeout(searchTimeout);

    if (users.length === 0) {
      setForceSearch(!forceSearch);
    } else if (tab !== "search") {
      setTab("search");
    }
    searchTimeout = setTimeout(() => {
      setSelectedUsers(users);
      setForceSearch(!forceSearch);
    }, 500);
  };

  const handleSelectedWhatsapps = (selecteds) => {
    const whatsapp = selecteds.map((t) => t.id);

    clearTimeout(searchTimeout);

    if (whatsapp.length === 0) {
      setForceSearch(!forceSearch);
    } else if (tab !== "search") {
      setTab("search");
    }
    searchTimeout = setTimeout(() => {
      setSelectedWhatsapp(whatsapp);
      setForceSearch(!forceSearch);
    }, 500);
  };

  const handleSelectedStatus = (selecteds) => {
    const statusFilter = selecteds.map((t) => t.status);

    clearTimeout(searchTimeout);

    if (statusFilter.length === 0) {
      setForceSearch(!forceSearch);
    } else if (tab !== "search") {
      setTab("search");
    }

    searchTimeout = setTimeout(() => {
      setSelectedStatus(statusFilter);
      setForceSearch(!forceSearch);
    }, 500);
  };

  const handleFilter = () => {
    if (filter) {
      setFilter(false);
      setTab("open");
    } else setFilter(true);
    setTab("search");
  };

  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClosed = () => {
    setOpen(false);
  };

  const tooltipTitleStyle = {
    fontSize: "10px",
  };

  return (
    <Paper elevation={0} variant="outlined" className={classes.ticketsWrapper}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={(ticket) => {
          handleCloseOrOpenTicket(ticket);
        }}
      />
      <div className={classes.serachInputWrapper}>
        <SearchIcon className={classes.searchIcon} />
        <InputBase
          className={classes.searchInput}
          inputRef={searchInputRef}
          placeholder={i18n.t("tickets.search.placeholder")}
          type="search"
          onChange={handleSearch}
        />
        {/* <IconButton
          className={classes.filterIcon}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={handleFilter}
        >
          <FilterListIcon />
        </IconButton> */}
        {/* <FilterListIcon
          className={classes.filterIcon}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={handleFilter}
        /> */}
        <IconButton
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "none",
            borderRadius: "50%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          variant="contained"
          aria-label="filter"
          className={classes.filterIcon}
          onClick={() => {
            setIsFilterActive((prevState) => !prevState);
            handleFilter();
          }}
        >
          {isFilterActive ? (
            <FilterAltIcon className={classes.icon} />
          ) : (
            <FilterAltOffIcon className={classes.icon} />
          )}
        </IconButton>
      </div>

      {filter === true && (
        <>
          <TagsFilter onFiltered={handleSelectedTags} />
          <WhatsappsFilter onFiltered={handleSelectedWhatsapps} />
          <StatusFilter onFiltered={handleSelectedStatus} />
          {profile === "admin" && (
            <>
              <UsersFilter onFiltered={handleSelectedUsers} />
            </>
          )}
        </>
      )}

      {/* <Paper elevation={0} square className={classes.tabsHeader}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          textColor="primary"
          aria-label="icon label tabs example"
          classes={{ indicator: classes.tabIndicator }}
        >
          <Tab
            value={"open"}
            icon={<MoveToInboxIcon />}
            label={i18n.t("tickets.tabs.open.title")}
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"closed"}
            icon={<CheckBoxIcon />}
            label={i18n.t("tickets.tabs.closed.title")}
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"search"}
            icon={<SearchIcon />}
            label={i18n.t("tickets.tabs.search.title")}
            classes={{ root: classes.tab }}
          />
        </Tabs>
      </Paper> */}
      <Paper square elevation={0} className={classes.ticketOptionsBox}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Can
              role={user.allUserChat === 'enabled' && user.profile === 'user' ? 'admin' : user.profile}
              perform="tickets-manager:showall"
              yes={() => (
                <Badge
                  color="primary"
                  invisible={
                    !isHoveredAll ||
                    isHoveredNew ||
                    isHoveredResolve ||
                    isHoveredOpen ||
                    isHoveredClosed
                  }
                  badgeContent={"Todos"}
                  classes={{ badge: classes.tabsBadge }}
                >
                  <ToggleButton
                    onMouseEnter={() => setIsHoveredAll(true)}
                    onMouseLeave={() => setIsHoveredAll(false)}
                    className={classes.button}
                    value="uncheck"
                    selected={showAllTickets}
                    onChange={() =>
                      setShowAllTickets((prevState) => !prevState)
                    }
                  >
                    {showAllTickets ? (
                      <VisibilityIcon className={classes.icon} />
                    ) : (
                      <VisibilityOffIcon className={classes.icon} />
                    )}
                  </ToggleButton>
                </Badge>
              )}
            />
            <Snackbar
              open={snackbarOpen}
              onClose={handleSnackbarClose}
              message={i18n.t("tickets.inbox.closedAllTickets")}
              ContentProps={{
                className: classes.snackbar,
              }}
              action={
                <>
                  <Button
                    className={classes.yesButton}
                    size="small"
                    onClick={CloseAllTicket}
                  >
                    {i18n.t("tickets.inbox.yes")}
                  </Button>
                  <Button
                    className={classes.noButton}
                    size="small"
                    onClick={handleSnackbarClose}
                  >
                    {i18n.t("tickets.inbox.no")}
                  </Button>
                </>
              }
            />
            <Badge
              color="primary"
              invisible={
                isHoveredAll ||
                !isHoveredNew ||
                isHoveredResolve ||
                isHoveredOpen ||
                isHoveredClosed
              }
              badgeContent={i18n.t("tickets.inbox.newTicket")}
              classes={{ badge: classes.tabsBadge }}
            >
              <IconButton
                onMouseEnter={() => setIsHoveredNew(true)}
                onMouseLeave={() => setIsHoveredNew(false)}
                className={classes.button}
                onClick={() => {
                  setNewTicketModalOpen(true);
                }}
              >
                <AddIcon className={classes.icon} />
              </IconButton>
            </Badge>
            {user.profile === "admin" && (
              <Badge
                color="primary"
                invisible={
                  isHoveredAll ||
                  isHoveredNew ||
                  !isHoveredResolve ||
                  isHoveredOpen ||
                  isHoveredClosed
                }
                badgeContent={i18n.t("tickets.inbox.closedAll")}
                classes={{ badge: classes.tabsBadge }}
              >
                <IconButton
                  onMouseEnter={() => setIsHoveredResolve(true)}
                  onMouseLeave={() => setIsHoveredResolve(false)}
                  className={classes.button}
                  onClick={handleSnackbarOpen}
                >
                  <PlaylistAddCheckOutlinedIcon style={{ color: "green" }} />
                </IconButton>
              </Badge>
            )}
            <Badge
              color="primary"
              invisible={
                !(
                  tab === "open" &&
                  !isHoveredAll &&
                  !isHoveredNew &&
                  !isHoveredResolve &&
                  !isHoveredClosed
                ) && !isHoveredOpen
              }
              badgeContent={i18n.t("tickets.inbox.open")}
              classes={{ badge: classes.tabsBadge }}
            >
              <IconButton
                onMouseEnter={() => {
                  setIsHoveredOpen(true);
                  setHoveredButton("open");
                }}
                onMouseLeave={() => {
                  setIsHoveredOpen(false);
                  setHoveredButton(null);
                }}
                style={{
                  height: 30,
                  width: 30,
                  border: isHoveredOpen
                    ? theme.mode === "light"
                      ? "3px solid #065183"
                      : "3px solid #FFF"
                    : tab === "open"
                      ? theme.mode === "light"
                        ? "3px solid #065183"
                        : "3px solid #FFF"
                      : theme.mode === "light"
                        ? "2px solid #aaa"
                        : "2px solid #aaa",
                  borderRadius: 8,
                  marginRight: 8,
                }}
                onClick={() => handleChangeTab(null, "open")}
              >
                <MoveToInboxIcon
                  style={{
                    color: isHoveredOpen
                      ? theme.mode === "light"
                        ? "#065183"
                        : "#FFF"
                      : tab === "open"
                        ? theme.mode === "light"
                          ? "#065183"
                          : "#FFF"
                        : "#aaa",
                  }}
                />
              </IconButton>
            </Badge>

            <Badge
              color="primary"
              invisible={
                !(
                  tab === "closed" &&
                  !isHoveredAll &&
                  !isHoveredNew &&
                  !isHoveredResolve &&
                  !isHoveredOpen
                ) && !isHoveredClosed
              }
              badgeContent={i18n.t("tickets.inbox.resolverd")}
              classes={{ badge: classes.tabsBadge }}
            >
              <IconButton
                onMouseEnter={() => {
                  setIsHoveredClosed(true);
                  setHoveredButton("closed");
                }}
                onMouseLeave={() => {
                  setIsHoveredClosed(false);
                  setHoveredButton(null);
                }}
                style={{
                  height: 30,
                  width: 30,
                  border: isHoveredClosed
                    ? theme.mode === "light"
                      ? "3px solid #065183"
                      : "3px solid #FFF"
                    : tab === "closed"
                      ? theme.mode === "light"
                        ? "3px solid #065183"
                        : "3px solid #FFF"
                      : theme.mode === "light"
                        ? "2px solid #aaa"
                        : "2px solid #aaa",
                  borderRadius: 8,
                  marginRight: 8,
                }}
                onClick={() => handleChangeTab(null, "closed")}
              >
                <CheckBoxIcon
                  style={{
                    color: isHoveredClosed
                      ? theme.mode === "light"
                        ? "#065183"
                        : "#FFF"
                      : tab === "closed"
                        ? theme.mode === "light"
                          ? "#065183"
                          : "#FFF"
                        : "#aaa",
                  }}
                />
              </IconButton>
            </Badge>
          </Grid>
          <Grid item>
            <TicketsQueueSelect
              selectedQueueIds={selectedQueueIds}
              userQueues={user?.queues}
              onChange={(values) => setSelectedQueueIds(values)}
            />
          </Grid>
        </Grid>
      </Paper>
      <TabPanel value={tab} name="open" className={classes.ticketsWrapper}>
        <Tabs
          value={tabOpen}
          onChange={handleChangeTabOpen}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {/* ATENDENDO */}
          <Tab
            label={
              <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                  <Badge
                    overlap="rectangular"
                    className={classes.badge}
                    badgeContent={openCount}
                    color="primary"
                  >
                    <MessageSharpIcon
                      style={{
                        fontSize: 18,
                      }}
                    />
                  </Badge>
                </Grid>
                <Grid item>
                  <Typography
                    style={{
                      marginLeft: 8,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {i18n.t("ticketsList.assignedHeader")}
                  </Typography>
                </Grid>
              </Grid>
            }
            value={"open"}
            name="open"
            classes={{ root: classes.tabPanelItem }}
          />

          {/* AGUARDANDO */}
          <Tab
            label={
              <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                  <Badge
                    overlap="rectangular"
                    classes={{ badge: classes.customBadge }}
                    badgeContent={pendingCount}
                    color="primary"
                  >
                    <ClockIcon
                      style={{
                        fontSize: 18,
                      }}
                    />
                  </Badge>
                </Grid>
                <Grid item>
                  <Typography
                    style={{
                      marginLeft: 8,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {i18n.t("ticketsList.pendingHeader")}
                  </Typography>
                </Grid>
              </Grid>
            }
            value={"pending"}
            name="pending"
            classes={{ root: classes.tabPanelItem }}
          />

          {/* GRUPOS */}
          <Tab
            label={
              <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                  <Badge
                    overlap="rectangular"
                    classes={{ badge: classes.customBadge }}
                    badgeContent={groupingCount}
                    color="primary"
                  >
                    <Group
                      style={{
                        fontSize: 18,
                      }}
                    />
                  </Badge>
                </Grid>
                <Grid item>
                  <Typography
                    style={{
                      marginLeft: 8,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {i18n.t("ticketsList.groupingHeader")}
                  </Typography>
                </Grid>
              </Grid>
            }
            value={"group"}
            name="group"
            classes={{ root: classes.tabPanelItem }}
          />
        </Tabs>

        <Paper className={classes.ticketsWrapper}>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle("open")}
            handleChangeTab={handleChangeTabOpen}
          />
          <TicketsList
            status="pending"
            selectedQueueIds={selectedQueueIds}
            showAll={user.profile === "admin" || user.allUserChat === 'enabled' ? showAllTickets : false}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
            handleChangeTab={handleChangeTabOpen}
          />
          <TicketsList
            status="group"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setGroupingCount(val)}
            style={applyPanelStyle("group")}
            handleChangeTab={handleChangeTabOpen}
          />
        </Paper>
      </TabPanel>
      <TabPanel value={tab} name="closed" className={classes.ticketsWrapper}>
        <TicketsList
          status="closed"
          showAll={showAllTickets}
          selectedQueueIds={selectedQueueIds}
          handleChangeTab={handleChangeTabOpen}
        />
      </TabPanel>
      <TabPanel value={tab} name="search" className={classes.ticketsWrapper}>
        {profile === "admin" && (
          <>
            <TicketsList
              statusFilter={selectedStatus}
              searchParam={searchParam}
              showAll={showAllTickets}
              tags={selectedTags}
              users={selectedUsers}
              selectedQueueIds={selectedQueueIds}
              whatsappIds={selectedWhatsapp}
              forceSearch={forceSearch}
              status="search"
            />
          </>
        )}

        {profile === "user" && (
          <TicketsList
            statusFilter={selectedStatus}
            searchParam={searchParam}
            showAll={false}
            tags={selectedTags}
            selectedQueueIds={selectedQueueIds}
            whatsappIds={selectedWhatsapp}
            forceSearch={forceSearch}
            status="search"
          />
        )}
      </TabPanel>
    </Paper>
  );
};

export default TicketsManagerTabs;
