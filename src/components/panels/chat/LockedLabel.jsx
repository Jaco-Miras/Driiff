import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {useTranslation} from "../../hooks";

const Wrapper = styled.div`
  font-weight: 500;
  color: #9b9b9b;
  padding: 10px 10px 10px 0;
`;

const { _t } = useTranslation();

const dictionary = {
    chatInfoPrivateWorkspace: _t("CHAT.INFO_PRIVATE_WORKSPACE", "You are in a private workspace."),
  };


const LockedLabel = (props) => {

    const { channel } = props;

    const workspaces = useSelector((state) => state.workspaces.workspaces);

    if (channel && workspaces.hasOwnProperty(channel.entity_id)) {
        if (workspaces[channel.entity_id].is_lock === 1 && workspaces[channel.entity_id].active === 1 && !channel.is_archived) {
            return <Wrapper>{dictionary.chatInfoPrivateWorkspace}</Wrapper>
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export default LockedLabel;