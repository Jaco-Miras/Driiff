import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Card from "./Card";
import WelcomeCard from "./WelcomeCard";
import AboutCard from "./AboutCard";
import CountCard from "./CountCard";
import ShortcutsCard from "./ShortcutsCard";
import FavoriteWorkspaceCard from "./FavoriteWorkspaceCard";
import SearchCard from "./SearchCard";
import FavoriteChannelsCard from "./FavoriteChannelsCard";
//import NewUsersCard from "./NewUsersCard";
import PostMentionCard from "./PostMentionCard";
import { useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
  overflow: auto;
  @media (min-width: 768px) {
    overflow: hidden;
  }
  ${(props) =>
    props.bg &&
    `
  background: url("${props.bg}") no-repeat center center fixed;
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  `};
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
      .row {
        height: calc(100% - 82px);
      }
      .row > div:first-child {
        padding-right: 7px;
      }
      .row > div:last-child {
        padding-left: 7px;
      }
      .col-md-6 {
        height: 100%;
        display: flex;
        flex-flow: column;
      }
      .count-card {
        min-height: 74px;
      }
    }
  }
`;

const QuicklinksMentionColumn = styled.div`
  @media (min-width: 768px) {
    > div:first-child {
      flex: ${(props) => (props.personalLinks >= 4 ? "1 1 65%" : "1 1 30%")};
    }
    > div:last-child {
      flex: 2 1 20%;
    }

    .count-card {
      min-height: 74px;
    }
  }
`;

const DashboardPanel = (props) => {
  const dashboardBg = useSelector((state) => state.settings.driff.background);
  const companyName = useSelector((state) => state.settings.driff.company_name);
  const user = useSelector((state) => state.session.user);
  const personalLinks = useSelector((state) => state.settings.user.GENERAL_SETTINGS.personal_links);
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
  };
  return (
    <Wrapper className={"container-fluid fadeIn dashboard-panel"} bg={dashboardBg}>
      <div className={"row h-100"}>
        <div className={"col-md-4 first-column"}>
          <Card className="mb-2 welcome-card">
            <WelcomeCard dictionary={dictionary} isWorkspace={false} />
          </Card>
          <Card className="mb-2 about-card">
            <AboutCard dictionary={dictionary} />
          </Card>
        </div>
        <div className={"col-md-6 second-column"}>
          <Card className="mb-2 search-container">
            <SearchCard dictionary={dictionary} />
          </Card>
          <div className={"row"}>
            <div className={"col-md-6"}>
              <Card className="mb-2 count-card">
                <CountCard text={dictionary.remindersDue} type={"reminders"} />
              </Card>
              <Card className="mb-2 count-card">
                <CountCard text={dictionary.unreadChats} type={"chat"} />
              </Card>
              <Card className="mb-2 count-card">
                <CountCard text={dictionary.unreadPosts} type={"posts"} />
              </Card>
              <Card className="mb-2  maxh-40">
                <FavoriteChannelsCard dictionary={dictionary} />
              </Card>
              <Card className="mb-2">
                <FavoriteWorkspaceCard dictionary={dictionary} />
              </Card>
            </div>
            <QuicklinksMentionColumn className={"col-md-6 quicklinks-postmention"} personalLinks={personalLinks.length}>
              <Card className="mb-2">
                <ShortcutsCard dictionary={dictionary} />
              </Card>
              <Card className="mb-2">
                <PostMentionCard dictionary={dictionary} />
              </Card>
            </QuicklinksMentionColumn>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default DashboardPanel;
