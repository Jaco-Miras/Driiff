import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Card from "./Card";
import WelcomeCard from "./WelcomeCard";
import AboutCard from "./AboutCard";
import CountCard from "./CountCard";
import ShortcutsCard from "./ShortcutsCard";
//import SearchCard from "./SearchCard";
import PostMentionCard from "./PostMentionCard";
import MembersCard from "./MembersCard";
import { useTranslationActions } from "../../hooks";
//import FilesFolderCard from "./FilesFolderCard";

const Wrapper = styled.div`
  overflow: auto;
  @media (min-width: 768px) {
    overflow: hidden;
  }

  .card.overflow-unset {
    overflow: unset;
  }
  .first-column {
    @media (min-width: 768px) {
      height: 100%;
      display: flex;
      flex-flow: column;
      .welcome-card {
        min-height: 74px;
      }

      .maxh-10 {
        flex: 1 1 80px;
      }
      .maxh-40 {
        flex: 2 2 50%;
      }
      .maxh-50 {
        flex: 0 0 auto;
      }
    }
  }
  .search-container {
    min-height: 74px;
    .card-body {
      padding: 19px 1rem;
    }
  }
  .second-column {
    height: 100%;
    display: flex;
    flex-flow: column;
    @media (min-width: 768px) {
      padding-left: 0;
      > .row {
        //height: calc(100% - 82px);
        height: 100%;
      }
      .row > .count-cards {
        padding-right: 7px;
        height: 100%;
        display: flex;
        flex-flow: column;
      }
      .row > .quicklinks-postmention {
        padding-left: 7px;
        height: 100%;
        display: flex;
        flex-flow: column;
      }
      .members-card {
        flex: 0 1 auto;
        min-height: 0;
      }
      // .files-folder-card {
      //   flex: 1 0 180px;
      // }
      .count-card {
        flex: 0 0 74px;
      }
    }
  }
`;

const QuicklinksMentionColumn = styled.div`
  // @media (min-width: 768px) {
  //   > div:first-child {
  //     min-height: 250px;
  //   }
  // }
`;

const WsDashboardPanel = (props) => {
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  //const dashboardBg = useSelector((state) => state.settings.driff.background);
  const companyName = useSelector((state) => state.settings.driff.company_name);
  const user = useSelector((state) => state.session.user);
  //const personalLinks = useSelector((state) => state.settings.user.GENERAL_SETTINGS.personal_links);
  const { _t } = useTranslationActions();
  const dictionary = {
    shortcuts: _t("SIDEBAR.SHORTCUTS", "Shortcuts"),
    search: _t("GENERAL.SEARCH", "Search"),
    aboutThisCompany: _t("ABOUT_THIS_COMPANY_NAME", "About this ::name::", { name: companyName }),
    hiUser: _t("LABEL.HI_USER", "Hi ::first_name::", { first_name: user.first_name }),
    dailyDigest: _t("LABEL.DAILY_DIGEST", "Here's your Driff daily digest"),
    remindersDue: _t("LABEL.REMINDERS_DUE", "Reminders due"),
    unreadChats: _t("LABEL.UNREAD_CHATS", "Unread chats"),
    unreadPosts: _t("LABEL.UNREAD_POSTS", "Unread posts"),
    newUsers: _t("WORKSPACE.NEW_USERS", "New users"),
    postMentionsActions: _t("LABEL.POST_MENTIONS_ACTIONS", "Post mentions and actions"),
    shorcutsTooltip: _t("TOOLTIP.SHORCUTS_DASHBOARD", "These quicklinks make it easy to find company info back quickly"),
    postMentionsTooltip: _t("TOOLTIP.POST_MENTIONS_ACTIONS", "People who mentioned you or post where people need your input"),
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    startWritingPost: _t("LABEL.START_WRITING_POST", "Start writing a new post,"),
    noQuickLinks: _t("LABEL.NO_QUICK_LINKS", "No quick links yet, wait for your admin to add quick links"),
    personalLinks: _t("SIDEBAR.PERSONAL_LINKS", "Personal"),
    dailyWsDigest: _t("LABEL.DAILY_WS_DIGEST", "Here's the overview of ::name::", { name: activeTopic ? activeTopic.name : "" }),
    aboutThisWorkspace: _t("DASHBOARD.ABOUT_THIS_WORKSPACE", "About this workspace"),
    wsShorcutsTooltip: _t("TOOLTIP.WS_SHORCUTS_DASHBOARD", "These quicklinks make it easy to find workspace info back quickly"),
    foldersOrFilesShared: _t("LABEL.FOLDERS_OR_FILES_SHARED", "Folders or files shared"),
    foldersOrFilesSharedTooltip: _t("TOOLTIP.FOLDERS_OR_FILES_SHARED", "Folders or files shared tooltip"),
    openAllSharedFiles: _t("LABEL.OPEN_ALL_SHARED_FILES", "Open all shared files and folders"),
    noWsQuickLinks: _t("LABEL.NO_WORKSPACE_QUICK_LINKS", "This WorkSpace has no quicklinks yet. Click on the + icon to add quicklinks for all workspace members."),
    nothingToDoHere: _t("LABEL.NOTHING_TO_DO_HERE", "Nothing to do here!"),
    chatWebhooksTitle: _t("CHAT_WEBHOOKS.TITLE", "Chat Webhooks"),
    chatWebhooksTeams: _t("CHAT_WEBHOOKS.TEAMS", "Teams"),
    chatWebhooksGuest: _t("CHAT_WEBHOOKS.GUEST", "Guest"),
    chatWebhooksCopy: _t("CHAT_WEBHOOKS.COPY", "copy"),
    chatWebhooksClipboardCopy: _t("CHAT_WEBHOOKS.CLIPBOARD_COPY", "Copied to clipboard"),
    webhookTooltip: _t("CHAT_WEBHOOKS.TOOLTIP_TITLE", "Chat Webhooks"),
    webhookExplainerText1: _t("CHAT_WEBHOOKS.EXPLAINER_TEXT_1", "Driff webhook is used to get external notifications inside your Driff. Connections can be made with Jira, Gripp, etc"),
    webhookExplainerText2: _t("CHAT_WEBHOOKS.EXPLAINER_TEXT_2", "Checkout our support http://support.getdriff.com/ to read more about integrations."),
  };

  return (
    <Wrapper className={"container-fluid fadeIn dashboard-panel"}>
      <div className={"row h-100"}>
        <div className={"col-md-4 first-column"}>
          <Card className="mb-2 welcome-card">
            <WelcomeCard dictionary={dictionary} isWorkspace={true} />
          </Card>
          <Card className="mb-2 about-card">
            <AboutCard dictionary={dictionary} isWorkspace={true} workspace={activeTopic} />
          </Card>
        </div>
        <div className={"col-md-6 second-column"}>
          {/* <Card className="mb-2 search-container">
            <SearchCard dictionary={dictionary} />
          </Card> */}
          <div className={"row"}>
            <div className={"col-md-6 count-cards"}>
              <Card className="mb-2 count-card">
                <CountCard text={dictionary.remindersDue} type={"reminders"} isWorkspace={true} workspace={activeTopic} />
              </Card>
              <Card className="mb-2 count-card">
                <CountCard text={dictionary.unreadChats} type={"chat"} isWorkspace={true} workspace={activeTopic} />
              </Card>
              <Card className="mb-2 count-card">
                <CountCard text={dictionary.unreadPosts} type={"posts"} isWorkspace={true} workspace={activeTopic} />
              </Card>
              {/* <Card className="mb-2 files-folder-card">
                <FilesFolderCard workspace={activeTopic} dictionary={dictionary} />
              </Card> */}
              <Card className="mb-2 overflow-unset members-card">
                <MembersCard workspace={activeTopic} />
              </Card>
            </div>
            <QuicklinksMentionColumn className={"col-md-6 quicklinks-postmention"}>
              <Card className="mb-2">
                <ShortcutsCard dictionary={dictionary} isWorkspace={true} workspace={activeTopic} />
              </Card>
              <Card className="mb-2">
                <PostMentionCard dictionary={dictionary} isWorkspace={true} workspace={activeTopic} />
              </Card>
            </QuicklinksMentionColumn>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default WsDashboardPanel;
