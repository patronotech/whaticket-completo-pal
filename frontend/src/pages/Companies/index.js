import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { socketConnection } from "../../services/socket";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";

import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import CompanyModal from "../../components/CompaniesModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";
import usePlans from "../../hooks/usePlans";
import moment from "moment";

const reducer = (state, action) => {
    if (action.type === "LOAD_COMPANIES") {
        const companies = action.payload;
        const newCompanies = [];

        companies.forEach((company) => {
            const companyIndex = state.findIndex((u) => u.id === company.id);
            if (companyIndex !== -1) {
                state[companyIndex] = company;
            } else {
                newCompanies.push(company);
            }
        });

        return [...state, ...newCompanies];
    }

    if (action.type === "UPDATE_COMPANIES") {
        const company = action.payload;
        const companyIndex = state.findIndex((u) => u.id === company.id);

        if (companyIndex !== -1) {
            state[companyIndex] = company;
            return [...state];
        } else {
            return [company, ...state];
        }
    }

    if (action.type === "DELETE_COMPANIES") {
        const companyId = action.payload;

        const companyIndex = state.findIndex((u) => u.id === companyId);
        if (companyIndex !== -1) {
            state.splice(companyIndex, 1);
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

const Companies = () => {
    const classes = useStyles();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [deletingCompany, setDeletingCompany] = useState(null);
    const [companyModalOpen, setCompanyModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [companies, dispatch] = useReducer(reducer, []);
    const { dateToClient, datetimeToClient } = useDate();

    // const { getPlanCompany } = usePlans();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function fetchData() {
            if (!user.super) {
                toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
                setTimeout(() => {
                    history.push(`/`)
                }, 1000);
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            const fetchCompanies = async () => {
                try {
                    const { data } = await api.get("/companiesPlan/", {
                        params: { searchParam, pageNumber },
                    });
                    dispatch({ type: "LOAD_COMPANIES", payload: data.companies });
                    setHasMore(data.hasMore);
                    setLoading(false);
                } catch (err) {
                    toastError(err);
                }
            };
            fetchCompanies();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber]);

    useEffect(() => {
        const companyId = user.companyId;
        const socket = socketConnection({ companyId, userId: user.id });
        // const socket = socketConnection();

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleOpenCompanyModal = () => {
        setSelectedCompany(null);
        setCompanyModalOpen(true);
    };

    const handleCloseCompanyModal = () => {
        setSelectedCompany(null);
        setCompanyModalOpen(false);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleEditCompany = (company) => {
        setSelectedCompany(company);
        setCompanyModalOpen(true);
    };

    const handleDeleteCompany = async (companyId) => {
        try {
            await api.delete(`/companies/${companyId}`);
            toast.success(i18n.t("compaies.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingCompany(null);
        setSearchParam("");
        setPageNumber(1);
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

    const renderStatus = (row) => {
        return row.status === false ? "Não" : "Sim";
    };

    const renderPlanValue = (row) => {
        return row.planId !== null ? row.plan.amount ? row.plan.amount.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '00.00' : "-";
    };

    const renderWhatsapp = (row) => {
        return row.useWhatsapp === false ? "Não" : "Sim";
    };

    const renderFacebook = (row) => {
        return row.useFacebook === false ? "Não" : "Sim";
    };

    const renderInstagram = (row) => {
        return row.useInstagram === false ? "Não" : "Sim";
    };

    const renderCampaigns = (row) => {
        return row.useCampaigns === false ? "Não" : "Sim";
    };

    const renderSchedules = (row) => {
        return row.useSchedules === false ? "Não" : "Sim";
    };

    const renderInternalChat = (row) => {
        return row.useInternalChat === false ? "Não" : "Sim";
    };

    const renderExternalApi = (row) => {
        return row.useExternalApi === false ? "Não" : "Sim";
    };

    const rowStyle = (record) => {
        if (moment(record.dueDate).isValid()) {
            const now = moment();
            const dueDate = moment(record.dueDate);
            const diff = dueDate.diff(now, "days");
            if (diff >= 1 && diff <= 5) {
                return { backgroundColor: "#fffead" };
            }
            if (diff <= 0) {
                return { backgroundColor: "#fa8c8c" };
            }
            // else {
            //   return { backgroundColor: "#affa8c" };
            // }
        }
        return {};
    };

    return (
        <MainContainer>
            <ConfirmationModal
                title={
                    deletingCompany &&
                    `${i18n.t("compaies.confirmationModal.deleteTitle")} ${deletingCompany.name}?`
                }
                open={confirmModalOpen}
                onClose={setConfirmModalOpen}
                onConfirm={() => handleDeleteCompany(deletingCompany.id)}
            >
                {i18n.t("compaies.confirmationModal.deleteMessage")}
            </ConfirmationModal>
            <CompanyModal
                open={companyModalOpen}
                onClose={handleCloseCompanyModal}
                aria-labelledby="form-dialog-title"
                companyId={selectedCompany && selectedCompany.id}
            />
            <MainHeader>
                <Title>{i18n.t("compaies.title")} ({companies.length})</Title>
                {/* <MainHeaderButtonsWrapper>
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
                        onClick={handleOpenCompanyModal}
                    >
                        {i18n.t("compaies.buttons.add")}
                    </Button>
                </MainHeaderButtonsWrapper> */}
            </MainHeader>
            <Paper
                className={classes.mainPaper}
                variant="outlined"
                onScroll={handleScroll}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">{i18n.t("compaies.table.ID")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.status")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.name")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.email")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.namePlan")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.value")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.createdAt")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.dueDate")}</TableCell>
                            <TableCell align="center">{i18n.t("compaies.table.lastLogin")}</TableCell>
                            {/* <TableCell align="center">{i18n.t("compaies.table.numberAttendants")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.numberConections")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.numberQueues")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.useWhatsapp")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.useFacebook")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.useInstagram")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.useCampaigns")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.useExternalApi")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.useInternalChat")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.useSchedules")}</TableCell> */}
                            {/* <TableCell align="center">{i18n.t("compaies.table.actions")}</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {companies.map((company) => (
                                <TableRow style={rowStyle(company)} key={company.id}>
                                    <TableCell align="center">{company.id}</TableCell>
                                    <TableCell align="center">{renderStatus(company.status)}</TableCell>
                                    <TableCell align="center">{company.name}</TableCell>
                                    <TableCell align="center">{company.email}</TableCell>
                                    <TableCell align="center">{company.plan.name}</TableCell>
                                    <TableCell align="center">R$ {renderPlanValue(company)}</TableCell>
                                    <TableCell align="center">{dateToClient(company.createdAt)}</TableCell>
                                    <TableCell align="center">{dateToClient(company.dueDate)}<br /><span>{company.recurrence}</span></TableCell>
                                    <TableCell align="center">{datetimeToClient(company.lastLogin)}</TableCell>
                                    {/* <TableCell align="center">{company.plan.users}</TableCell> */}
                                    {/* <TableCell align="center">{company.plan.connections}</TableCell> */}
                                    {/* <TableCell align="center">{company.plan.queues}</TableCell> */}
                                    {/* <TableCell align="center">{renderWhatsapp(company.plan.useWhatsapp)}</TableCell> */}
                                    {/* <TableCell align="center">{renderFacebook(company.plan.useFacebook)}</TableCell> */}
                                    {/* <TableCell align="center">{renderInstagram(company.plan.useInstagram)}</TableCell> */}
                                    {/* <TableCell align="center">{renderCampaigns(company.plan.useCampaigns)}</TableCell> */}
                                    {/* <TableCell align="center">{renderExternalApi(company.plan.useExternalApi)}</TableCell> */}
                                    {/* <TableCell align="center">{renderInternalChat(company.plan.useInternalChat)}</TableCell> */}
                                    {/* <TableCell align="center">{renderSchedules(company.plan.useSchedules)}</TableCell> */}
                                    {/* <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditCompany(company)}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setConfirmModalOpen(true);
                                                setDeletingCompany(company);
                                            }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                            {loading && <TableRowSkeleton columns={4} />}
                        </>
                    </TableBody>
                </Table>
            </Paper>
        </MainContainer>
    );
};

export default Companies;
