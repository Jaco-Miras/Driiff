import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTranslation } from "../../hooks";

const Wrapper = styled.div`
  font-weight: 500;
  color: #9b9b9b;
  padding: 10px 10px 10px 0;
`;

const LockedLabel = (props) => {
  const { className = "", channel } = props;

  const { _t } = useTranslation();

  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const user = useSelector((state) => state.session.user);

  const dictionary = {
    lockedLabel: _t("CHAT.INFO_PRIVATE_WORKSPACE", "You are in a private workspace."),
    teamChat: _t("CHAT.INFO_TEAM_CHAT", "You are in the team chat"),
    clientChat: _t("CHAT.INFO_CLIENT_CHAT", "Client can read this chat"),
  };

  return (
    <>
      {channel && !channel.is_archived && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_lock === 1 && workspaces[channel.entity_id].active === 1 && (
        <Wrapper className={`locked-label ${className}`}>
          {workspaces[channel.entity_id].is_shared && workspaces[channel.entity_id].channel.id === channel.id && user.type === "internal" && dictionary.clientChat}
          {workspaces[channel.entity_id].is_shared && workspaces[channel.entity_id].team_channel.id === channel.id && user.type === "internal" && dictionary.teamChat}
          {/* {workspaces[channel.entity_id].is_shared && user.type === "internal" && " / "} */}
          {/* {dictionary.lockedLabel} */}
        </Wrapper>
      )}
    </>
  );
};

export default LockedLabel;
