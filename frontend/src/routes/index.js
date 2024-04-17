import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LoggedInLayout from "../layout";
import Dashboard from "../pages/Dashboard/";
import TicketResponsiveContainer from "../pages/TicketResponsiveContainer";
import Signup from "../pages/Signup";
import Login from "../pages/Login/";
import Connections from "../pages/Connections/";
import SettingsCustom from "../pages/SettingsCustom/";
// import Financeiro from "../pages/Financeiro/";
import Users from "../pages/Users";
import Contacts from "../pages/Contacts/";
import ChatMoments from "../pages/Moments"
import Queues from "../pages/Queues/";
import Tags from "../pages/Tags/";
import MessagesAPI from "../pages/MessagesAPI/";
import Helps from "../pages/Helps/";
import ContactLists from "../pages/ContactLists/";
import ContactListItems from "../pages/ContactListItems/";
import Companies from "../pages/Companies/";
import QuickMessages from "../pages/QuickMessages/";
import { AuthProvider } from "../context/Auth/AuthContext";
import { TicketsContextProvider } from "../context/Tickets/TicketsContext";
import { WhatsAppsProvider } from "../context/WhatsApp/WhatsAppsContext";
import Route from "./Route";
import Schedules from "../pages/Schedules";
import Campaigns from "../pages/Campaigns";
import CampaignsConfig from "../pages/CampaignsConfig";
import CampaignReport from "../pages/CampaignReport";
import Annoucements from "../pages/Annoucements";
import Chat from "../pages/Chat";
import Prompts from "../pages/Prompts";
import AllConnections from "../pages/AllConnections/";

// import Integrations from '../pages/Integrations';
// import GoogleCalendarComponent from '../pages/Integrations/components/GoogleCalendarComponent';

import Subscription from "../pages/Subscription/";
import QueueIntegration from "../pages/QueueIntegration";
import Files from "../pages/Files/";
import ToDoList from "../pages/ToDoList/";
import Kanban from "../pages/Kanban";
import TagsKanban from "../pages/TagsKanban";
import ScheduledMessages from "../pages/Scheduled Messages";
const Routes = () => {
  const [showCampaigns, setShowCampaigns] = useState(false);

  useEffect(() => {
    const cshow = localStorage.getItem("cshow");
    if (cshow !== undefined) {
      setShowCampaigns(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketsContextProvider>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            {/* <Route exact path="/financeiro-aberto" component={Financeiro} isPrivate /> */}
            <WhatsAppsProvider>
              <LoggedInLayout>
                <Route exact path="/companies" component={Companies} isPrivate />
                <Route exact path="/" component={Dashboard} isPrivate />
                <Route exact path="/tickets/:ticketId?" component={TicketResponsiveContainer} isPrivate />
                <Route exact path="/connections" component={Connections} isPrivate />
                <Route exact path="/quick-messages" component={QuickMessages} isPrivate />
                <Route exact path="/todolist" component={ToDoList} isPrivate />
                <Route exact path="/schedules" component={Schedules} isPrivate />
                <Route exact path="/tags" component={Tags} isPrivate />
                <Route exact path="/contacts" component={Contacts} isPrivate />
                <Route exact path="/helps" component={Helps} isPrivate />
                <Route exact path="/users" component={Users} isPrivate />
                <Route exact path="/messages-api" component={MessagesAPI} isPrivate />
                <Route exact path="/settings" component={SettingsCustom} isPrivate />
                <Route exact path="/queues" component={Queues} isPrivate />
                <Route exact path="/queue-integration" component={QueueIntegration} isPrivate />
                <Route exact path="/announcements" component={Annoucements} isPrivate />
                <Route exact path="/chats/:id?" component={Chat} isPrivate />
                <Route exact path="/scheduled_messages" component={ScheduledMessages} isPrivate />
                <Route exact path="/files" component={Files} isPrivate />
                <Route exact path="/moments" component={ChatMoments} isPrivate />
                <Route exact path="/Kanban" component={Kanban} isPrivate />
                <Route exact path="/TagsKanban" component={TagsKanban} isPrivate />
                <Route exact path="/prompts" component={Prompts} isPrivate />
                <Route exact path="/allConnections" component={AllConnections} isPrivate />
                {showCampaigns && (
                  <>
                    <Route exact path="/contact-lists" component={ContactLists} isPrivate />
                    <Route exact path="/contact-lists/:contactListId/contacts" component={ContactListItems} isPrivate />
                    <Route exact path="/campaigns" component={Campaigns} isPrivate />
                    <Route exact path="/campaign/:campaignId/report" component={CampaignReport} isPrivate />
                    <Route exact path="/campaigns-config" component={CampaignsConfig} isPrivate />
                  </>
                )}
              </LoggedInLayout>
            </WhatsAppsProvider>
          </Switch>
          <ToastContainer autoClose={3000} />
        </TicketsContextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
