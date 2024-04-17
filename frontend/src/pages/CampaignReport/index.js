import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { Grid, LinearProgress, Typography } from "@material-ui/core";
import api from "../../services/api";
import { has, get, isNull } from "lodash";
import CardCounter from "../../components/Dashboard/CardCounter";
import GroupIcon from "@material-ui/icons/Group";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useDate } from "../../hooks/useDate";
import usePlans from "../../hooks/usePlans";
import { AuthContext } from "../../context/Auth/AuthContext";

import { socketConnection } from "../../services/socket";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    // padding: theme.spacing(2),
    padding: theme.padding,
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  textRight: {
    textAlign: "right",
  },
  tabPanelsContainer: {
    // padding: theme.spacing(2),
    padding: theme.padding,
  },
}));

const CampaignReport = () => {
  const classes = useStyles();
  const history = useHistory();

  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState({});
  const [validContacts, setValidContacts] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [confirmationRequested, setConfirmationRequested] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  const { user } = useContext(AuthContext);

  const { datetimeToClient } = useDate();
  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useCampaigns) {
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
    if (mounted.current) {
      findCampaign();
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted.current && has(campaign, "shipping")) {
      if (has(campaign, "contactList")) {
        const contactList = get(campaign, "contactList");
        const valids = contactList.contacts.filter((c) => c.isWhatsappValid);
        setValidContacts(valids.length);
      }

      if (has(campaign, "shipping")) {
        const contacts = get(campaign, "shipping");
        const delivered = contacts.filter((c) => !isNull(c.deliveredAt));
        const confirmationRequested = contacts.filter(
          (c) => !isNull(c.confirmationRequestedAt)
        );
        const confirmed = contacts.filter(
          (c) => !isNull(c.deliveredAt) && !isNull(c.confirmationRequestedAt)
        );
        setDelivered(delivered.length);
        setConfirmationRequested(confirmationRequested.length);
        setConfirmed(confirmed.length);
        setDelivered(delivered.length);
      }
    }
  }, [campaign]);

  useEffect(() => {
    setPercent((delivered / validContacts) * 100);
  }, [delivered, validContacts]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-campaign`, (data) => {

      if (data.record.id === +campaignId) {
        setCampaign(data.record);

        if (data.record.status === "FINALIZADA") {
          setTimeout(() => {
            findCampaign();
          }, 5000);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const findCampaign = async () => {
    setLoading(true);
    const { data } = await api.get(`/campaigns/${campaignId}`);
    setCampaign(data);
    setLoading(false);
  };

  const formatStatus = (val) => {
    switch (val) {
      case "INATIVA":
        return i18n.t("campaignReport.inactive");
      case "PROGRAMADA":
        return i18n.t("campaignReport.scheduled");
      case "EM_ANDAMENTO":
        return i18n.t("campaignReport.process");
      case "CANCELADA":
        return i18n.t("campaignReport.cancelled");
      case "FINALIZADA":
        return i18n.t("campaignReport.finished");
      default:
        return val;
    }
  };

  return (
    <MainContainer>
      <MainHeader>
        <Grid style={{ width: "99.6%" }} container>
          <Grid xs={12} item>
            <Title>{i18n.t("campaignReport.title")} {campaign.name || i18n.t("campaignReport.campaign")}</Title>
          </Grid>
        </Grid>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Typography variant="h6" component="h2">
          Status: {formatStatus(campaign.status)} {delivered} de {validContacts}
        </Typography>
        <Grid spacing={2} container>
          <Grid xs={12} item>
            <LinearProgress
              variant="determinate"
              style={{ height: 15, borderRadius: 3, margin: "20px 0" }}
              value={percent}
            />
          </Grid>
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<GroupIcon fontSize="inherit" />}
              title={i18n.t("campaignReport.validContacts")}
              value={validContacts}
              loading={loading}
            />
          </Grid>
          {campaign.confirmation && (
            <>
              <Grid xs={12} md={4} item>
                <CardCounter
                  icon={<DoneIcon fontSize="inherit" />}
                  title={i18n.t("campaignReport.confirmationsRequested")}
                  value={confirmationRequested}
                  loading={loading}
                />
              </Grid>
              <Grid xs={12} md={4} item>
                <CardCounter
                  icon={<DoneAllIcon fontSize="inherit" />}
                  title={i18n.t("campaignReport.confirmations")}
                  value={confirmed}
                  loading={loading}
                />
              </Grid>
            </>
          )}
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<CheckCircleIcon fontSize="inherit" />}
              title={i18n.t("campaignReport.deliver")}
              value={delivered}
              loading={loading}
            />
          </Grid>
          {campaign.whatsappId && (
            <Grid xs={12} md={4} item>
              <CardCounter
                icon={<WhatsAppIcon fontSize="inherit" />}
                title={i18n.t("campaignReport.connection")}
                value={campaign.whatsapp.name}
                loading={loading}
              />
            </Grid>
          )}
          {campaign.contactListId && (
            <Grid xs={12} md={4} item>
              <CardCounter
                icon={<ListAltIcon fontSize="inherit" />}
                title={i18n.t("campaignReport.contactLists")}
                value={campaign.contactList.name}
                loading={loading}
              />
            </Grid>
          )}
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<ScheduleIcon fontSize="inherit" />}
              title={i18n.t("campaignReport.schedule")}
              value={datetimeToClient(campaign.scheduledAt)}
              loading={loading}
            />
          </Grid>
          <Grid xs={12} md={4} item>
            <CardCounter
              icon={<EventAvailableIcon fontSize="inherit" />}
              title={i18n.t("campaignReport.conclusion")}
              value={datetimeToClient(campaign.completedAt)}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Paper>
    </MainContainer>
  );
};

export default CampaignReport;
