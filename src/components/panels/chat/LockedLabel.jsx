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

  const dictionary = {
    lockedLabel: _t("CHAT.INFO_PRIVATE_WORKSPACE", "You are in a private workspace.")
  };

  return (<>
    {
      channel && !channel.is_archived &&
      workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_lock === 1 && workspaces[channel.entity_id].active === 1 &&
      <Wrapper className={`locked-label ${className}`}>{dictionary.lockedLabel}</Wrapper>
    }
  </>);
};

export default LockedLabel;
