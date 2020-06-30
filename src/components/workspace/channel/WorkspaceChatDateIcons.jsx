import React, {useCallback} from "react";
import styled from "styled-components";
import {localizeChatChannelDate} from "../../../helpers/momentFormatJS";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    display: ${props => props.optionsVisible ? "none" : "initial"};
`;
const ActionContainer = styled.div`
    position: relative;
    top: 4px;
    display: flex;
    flex-direction: row-reverse;
`;
const Icon = styled(SvgIconFeather)`
    ${"" /* filter: brightness(0) saturate(100%) invert(43%) sepia(19%) saturate(0%) hue-rotate(214deg) brightness(87%) contrast(86%); */}
    position: relative;
    top: -3px;
    right: 0;
    width: 15px;
    height: 15px;
`;

const Badge = styled.span`
    color: #fff !important;

    &.unread {
        color: #7a1b8b !important;
    }
`;

const WorkspaceChatDateIcons = props => {

    const {workspace, optionsVisible} = props;

    const handleNotificationBadges = useCallback(() => {
        if (workspace.is_read === 0) {
            return <Badge className={`badge badge-primary badge-pill ml-auto unread`}>0</Badge>;
        } else {
            if (workspace.total_unread > 0) {
                return <Badge className="badge badge-primary badge-pill ml-auto">{workspace.total_unread}</Badge>;
            } else {
                return null;
            }
        }
    }, [workspace]);

    return (
        <Wrapper className="chat-timestamp" optionsVisible={optionsVisible}>
            {handleNotificationBadges()}
            <span className={`small text-muted`}>
                {
                    workspace.last_reply
                    ? localizeChatChannelDate(workspace.last_reply.created_at.timestamp)
                    : ""
                }
            </span>
            <ActionContainer>
                {
                    !!workspace.is_pinned &&
                    <Icon icon="star"/>
                }
                {
                    !!workspace.is_muted &&
                    <Icon icon="volume-x" className={`${!!workspace.is_pinned && "mr-1"}`}/>
                }
            </ActionContainer>
        </Wrapper>
    );
};

export default React.memo(WorkspaceChatDateIcons);