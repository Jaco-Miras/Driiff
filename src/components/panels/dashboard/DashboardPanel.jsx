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
import NewUsersCard from "./NewUsersCard";

const Wrapper = styled.div`
  overflow: auto;
  @media (min-width: 768px) {
    overflow: hidden;
  }
  ${(props) =>
    props.bg &&
    `
  background-image: url("${props.bg}")`};
  .second-column {
    @media (min-width: 768px) {
      padding-left: 0;
      .row > div:first-child {
        padding-right: 7px;
      }
      .row > div:last-child {
        padding-left: 7px;
      }
    }
  }
  .card.overflow-unset {
    overflow: unset;
  }
  .first-column {
    @media (min-width: 768px) {
      height: 100%;
      display: flex;
      flex-flow: column;
      .maxh-10 {
        flex: 1 1 80px;
      }
      .maxh-40 {
        flex: 2 2 50%;
      }
      .maxh-50 {
        flex: 1 1 50%;
      }
    }
  }
`;

const DashboardPanel = (props) => {
  const dashboardBg = useSelector((state) => state.settings.driff.background);
  return (
    <Wrapper className={"container-fluid fadeIn dashboard-panel"} bg={dashboardBg}>
      <div className={"row h-100"}>
        <div className={"col-md-4 first-column"}>
          <Card className="mb-3 maxh-10">
            <WelcomeCard />
          </Card>
          <Card className="mb-3 maxh-50">
            <AboutCard />
          </Card>
          <Card className="mb-3  maxh-40">
            <FavoriteChannelsCard />
          </Card>
        </div>
        <div className={"col-md-6 mh-100 second-column"}>
          <Card className="mb-3">
            <SearchCard />
          </Card>
          <div className={"row"}>
            <div className={"col-md-6"}>
              <Card className="mb-3">
                <CountCard text={"Reminders due"} type={"reminders"} />
              </Card>
              <Card className="mb-3">
                <CountCard text={"Unread chats"} type={"chat"} />
              </Card>
              <Card className="mb-3">
                <CountCard text={"Unread posts"} type={"posts"} />
              </Card>
              <Card className="mb-3 overflow-unset">
                <NewUsersCard />
              </Card>
            </div>
            <div className={"col-md-6"}>
              <Card className="mb-3">
                <ShortcutsCard />
              </Card>
              <Card className="mb-3">
                <FavoriteWorkspaceCard />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default DashboardPanel;
