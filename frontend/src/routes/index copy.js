import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../context/Auth/AuthContext";
import { TicketsContextProvider } from "../context/Tickets/TicketsContext";
import { WhatsAppsProvider } from "../context/WhatsApp/WhatsAppsContext";
const Route = lazy(() => import("./Route"));

const LoggedInLayout = lazy(() => import("../layout"));
const Dashboard = lazy(() => import("../pages/Dashboard/"));
const TicketResponsiveContainer = lazy(() => import("../pages/TicketResponsiveContainer"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login/"));
const Connections = lazy(() => import("../pages/Connections/"));
const SettingsCustom = lazy(() => import("../pages/SettingsCustom/"));
// import Financeiro from "../pages/Financeiro/";
const Users = lazy(() => import("../pages/Users"));
const Contacts = lazy(() => import("../pages/Contacts/"));
const ChatMoments = lazy(() => import("../pages/Moments"));
const Queues = lazy(() => import("../pages/Queues/"));
const Tags = lazy(() => import("../pages/Tags/"));
const MessagesAPI = lazy(() => import("../pages/MessagesAPI/"));
const Helps = lazy(() => import("../pages/Helps/"));
const ContactLists = lazy(() => import("../pages/ContactLists/"));
const ContactListItems = lazy(() => import("../pages/ContactListItems/"));
const Companies = lazy(() => import("../pages/Companies/"));
const QuickMessages = lazy(() => import("../pages/QuickMessages/"));
const Schedules = lazy(() => import("../pages/Schedules"));
const Campaigns = lazy(() => import("../pages/Campaigns"));
const CampaignsConfig = lazy(() => import("../pages/CampaignsConfig"));
const CampaignReport = lazy(() => import("../pages/CampaignReport"));
const Annoucements = lazy(() => import("../pages/Annoucements"));
const Chat = lazy(() => import("../pages/Chat"));
const QueueIntegration = lazy(() => import('../pages/QueueIntegration/'));
const Files = lazy(() => import('../pages/Files/'));
const ToDoList = lazy(() => import('../pages/ToDoList/'));
const Kanban = lazy(() => import('../pages/Kanban/'));
const TagsKanban = lazy(() => import('../pages/TagsKanban/'));

const Routes = () => {
  const [showCampaigns, setShowCampaigns] = useState(false);

  useEffect(() => {
    const cshow = localStorage.getItem("cshow");
    if (cshow !== undefined) {
      setShowCampaigns(true);
    }
  }, []);

  function LoadingFallback() {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketsContextProvider>
          <Switch>
            <Suspense fallback={<LoadingFallback />}>
              <Route exact path="/login" component={Login} />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <Route exact path="/signup" component={Signup} />
            </Suspense>
            {/* <Route exact path="/financeiro-aberto" component={Financeiro} isPrivate /> */}
            <WhatsAppsProvider>
              <Suspense fallback={<LoadingFallback />}>
                <LoggedInLayout>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/companies" component={Companies} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/" component={Dashboard} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/tickets/:ticketId?" component={TicketResponsiveContainer} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/connections" component={Connections} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/quick-messages" component={QuickMessages} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/todolist" component={ToDoList} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/schedules" component={Schedules} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/tags" component={Tags} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/contacts" component={Contacts} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/helps" component={Helps} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/users" component={Users} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/messages-api" component={MessagesAPI} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/settings" component={SettingsCustom} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/queues" component={Queues} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/queue-integration" component={QueueIntegration} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/announcements" component={Annoucements} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/chats/:id?" component={Chat} isPrivate />1
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/files" component={Files} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/moments" component={ChatMoments} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/Kanban" component={Kanban} isPrivate />
                  </Suspense>
                  <Suspense fallback={<LoadingFallback />}>
                    <Route exact path="/TagsKanban" component={TagsKanban} isPrivate />
                  </Suspense>


                  {showCampaigns && (
                    <>
                      <Suspense fallback={<LoadingFallback />}>
                        <Route exact path="/contact-lists" component={ContactLists} isPrivate />
                      </Suspense>
                      <Suspense fallback={<LoadingFallback />}>
                        <Route exact path="/contact-lists/:contactListId/contacts" component={ContactListItems} isPrivate />
                      </Suspense>
                      <Suspense fallback={<LoadingFallback />}>
                        <Route exact path="/campaigns" component={Campaigns} isPrivate />
                      </Suspense>
                      <Suspense fallback={<LoadingFallback />}>
                        <Route exact path="/campaign/:campaignId/report" component={CampaignReport} isPrivate />
                      </Suspense>
                      <Suspense fallback={<LoadingFallback />}>
                        <Route exact path="/campaigns-config" component={CampaignsConfig} isPrivate />
                      </Suspense>
                    </>
                  )}
                </LoggedInLayout>
              </Suspense>
            </WhatsAppsProvider>
          </Switch>
          <ToastContainer autoClose={3000} />
        </TicketsContextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
