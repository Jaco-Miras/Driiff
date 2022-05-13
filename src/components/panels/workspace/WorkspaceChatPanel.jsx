import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { ChatContentPanel } from "../chat";
import { useRouteMatch } from "react-router-dom";
import { SvgEmptyState } from "../../common";
import { createWorkspaceTeamChannel } from "../../../redux/actions/workspaceActions";
import { useFetchWsCount } from "../../hooks";
//mport { fetchRecentPosts } from "../../../redux/actions/postActions";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div``;

const Chatblock = styled.div`
  padding: 24px 24px 0 24px;
  @media (max-width: 991.99px) {
    padding: 15px;
  }
`;
const EmptyState = styled.div`
  padding: 8rem 0;
  max-width: 375px;
  margin: auto;
  text-align: center;

  svg {
    display: block;
  }
  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const WorkspaceChatPanel = (props) => {
  const { className = "", workspace } = props;
  const route = useRouteMatch();
  //const params = useParams();
  const dispatch = useDispatch();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);
  const [activating, setActivating] = useState(false);
  useFetchWsCount();

  const handleActivateTeamChat = () => {
    if (!activating) {
      setActivating(true);
      dispatch(
        createWorkspaceTeamChannel({ id: workspace.id }, (err, res) => {
          setActivating(false);
        })
      );
    }
  };

  useEffect(() => {
    const snoozeContainer = document.getElementById("toastS");
    if (snoozeContainer && isMobile) snoozeContainer.classList.add("d-none");
    return () => {
      if (snoozeContainer && isMobile) snoozeContainer.classList.remove("d-none");
    };
  }, []);

  // useEffect(() => {
  //   if (params.hasOwnProperty("workspaceId")) {
  //     dispatch(fetchRecentPosts({ topic_id: params.workspaceId }));
  //   }
  // }, [params.workspaceId]);

  return (
    <Wrapper className={`workspace-chat container-fluid ${className}`}>
      <Chatblock className="row no-gutters chat-block">
        {workspace && !workspace.team_channel.code && route.path.startsWith("/workspace/team-chat/") && user.type === "internal" && (
          <EmptyState>
            <SvgEmptyState icon={3} height={252} />
            <button className="btn btn-outline-primary btn-block" disable={activating} onClick={handleActivateTeamChat}>
              {!activating ? "Activate chat" : "Activating..."}
            </button>
          </EmptyState>
        )}
        {((route.path.startsWith("/workspace/chat") && selectedChannel && workspace.is_shared && selectedChannel.id === workspace.channel.id) ||
          (route.path.startsWith("/workspace/chat") && selectedChannel && !workspace.is_shared && selectedChannel.id === workspace.team_channel.id) ||
          (route.path.startsWith("/workspace/team-chat") && workspace && workspace.team_channel.code && user.type === "internal" && selectedChannel && selectedChannel.id === workspace.team_channel.id)) && (
          <ChatContentPanel className={"col-lg-12"} isWorkspace={true} selectedChannel={selectedChannel} />
        )}
      </Chatblock>
    </Wrapper>
  );
};

export default WorkspaceChatPanel;
