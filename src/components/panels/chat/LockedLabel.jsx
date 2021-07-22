import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTranslationActions } from "../../hooks";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  font-weight: 500;
  color: #9b9b9b;
  padding: 10px 10px 10px 0;
`;

const EyeIcon = styled(SvgIconFeather)`
  width: 14px;
  height: 14px;
  margin-left: 5px;
`;

const LockedLabel = (props) => {
  const { className = "", channel } = props;

  const { _t } = useTranslationActions();

  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const user = useSelector((state) => state.session.user);

  const dictionary = {
    lockedLabel: _t("CHAT.INFO_PRIVATE_WORKSPACE", "You are in a private workspace."),
    teamChat: _t("CHAT.INFO_TEAM_CHAT", "You are in the team chat"),
    clientChat: _t("CHAT.INFO_CLIENT_CHAT", "Client can read this chat"),
  };

  return (
    <>
      {channel && !channel.is_archived && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].active === 1 && (
        <Wrapper className={`locked-label ${className}`}>
          {workspaces[channel.entity_id].is_shared && workspaces[channel.entity_id].channel.id === channel.id && user.type === "internal" && (
            <span>
              {dictionary.clientChat}
              <EyeIcon icon="eye" />
            </span>
          )}
          {workspaces[channel.entity_id].is_shared && workspaces[channel.entity_id].team_channel.id === channel.id && user.type === "internal" && (
            <span>
              {dictionary.teamChat} <EyeIcon icon="eye-off" />
            </span>
          )}
          {/* {workspaces[channel.entity_id].is_shared && user.type === "internal" && " / "} */}
          {/* {dictionary.lockedLabel} */}
        </Wrapper>
      )}
    </>
  );
};

export default LockedLabel;
