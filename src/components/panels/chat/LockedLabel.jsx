import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  font-weight: 500;
  color: #9b9b9b;
  padding: 10px 10px 10px 0;
`;

const LockedLabel = (props) => {

    const { channel } = props;

    const workspaces = useSelector((state) => state.workspaces.workspaces);

    if (channel && workspaces.hasOwnProperty(channel.entity_id)) {
        if (workspaces[channel.entity_id].is_lock === 1 && workspaces[channel.entity_id].active === 1 && !channel.is_archived) {
            return <Wrapper>You are in a private workspace.</Wrapper>
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export default LockedLabel;