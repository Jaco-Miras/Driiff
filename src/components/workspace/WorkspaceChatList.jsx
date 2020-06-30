import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {addToModals} from "../../redux/actions/globalActions";
import {useSettings, useToaster} from "../hooks";
import ChannelTitle from "../list/chat/ChannelTitle";
import ReplyPreview from "../list/chat/ReplyPreview";
import {WorkspaceChannelOptions, WorkspaceChatDateIcons} from "./channel";

const Wrapper = styled.li`    
    cursor: pointer;
    cursor: hand;
    position: relative;
    ${props => props.selected && "padding-left: 14px !important"};
    transition: all 0.15s linear;
    .more-options {
        position: relative;
        opacity: 0;
        z-index: -1;
    }

    &:hover {
        .more-options {
            opacity: 1;
            z-index: 1;
            &.active {
                color: #4d4d4d !important;
            }
        }
        .chat-timestamp {
            opacity: 0;
            visibility: hidden;
        }
        h6 {
            color: #7A1B8B;
        }
    }
    h6 {
        ${props => props.selected && "color: #7A1B8B"};
    }
    &:after {
        ${props => props.selected && "content: ''"};
        width: 3px;
        height: 100%;
        background: #7A1B8B;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        animation: fadeIn 0.15s linear;
    }


    .chat-timestamp {
        position: absolute;
        right: 0px;
        white-space: nowrap;
        transition: opacity 0.3s ease;
        svg {
            margin-left: 4px;
            fill: #ffc107;
            color: #ffc107;
        }
        .badge {
            position: absolute;
            right: calc(100% + 14px)
        }
    }
    .feather-more-horizontal {
        width: 25px;
        height: 25px;
        position: relative;
        right: 0;
        ${"" /* border: 1px solid #dee2e6; */}
        fill: currentColor;
        padding: 3px;
        top: 2px;
    }
`;

const Initials = styled.span`
    background-color: #fff;
    display: flex;    
    margin: auto;
    height: 20px;
    text-align: center;
    width: 100%;
    height: 100%;
    object-fit: cover;
    align-items: center;
    justify-content: center;
`;

const ChannelTitlePreview = styled.div`
    padding-right: 60px;
`;

const Timestamp = styled.div`
    position: relative;
`;

const WorkspaceChatList = props => {

    let {className = "", selectedChannel = null, workspace, setChannel} = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const route = useRouteMatch();
    const toaster = useToaster();

    const ref = {
        container: useRef(null),
        arrow: useRef(null),
        nav: useRef(null),
    };

    const {generalSettings: {workspace_open_folder}, setGeneralSetting} = useSettings();


    const [showTopics, setShowTopics] = useState(null);
    const [maxHeight, setMaxHeight] = useState(null);

    const handleShowWorkspaceModal = () => {
        let payload = {
            type: "workspace_create_edit",
            mode: "create",
            item: workspace,
        };

        dispatch(
            addToModals(payload),
        );
    };

    const handleSelectWorkspace = () => {
        if (typeof workspace.topic_detail === "undefined") {
            toaster.warning(<>TBD - Channel is not created for this open topic</>);
        } else {
            setChannel(workspace.topic_detail.channel.code);
        }

        //history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
    };

    const handleInitials = title => {

        if (typeof title === "undefined") return "";

        var result = "";
        var tokens = title.split(" ");
        for (var i = 0; i < tokens.length; i++) {
            result += tokens[i].substring(0, 3).toUpperCase();
        }
        return result.substring(0, 3);
    };

    const [optionsVisible, setOptionsVisible] = useState(false);

    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    useEffect(() => {
        if (ref.nav.current !== null) {
            setMaxHeight(ref.nav.current.offsetHeight);
        }
    }, [ref.nav, maxHeight]);

    useEffect(() => {
        if (showTopics === null && maxHeight !== null) {
            setShowTopics(workspace.selected || workspace_open_folder.hasOwnProperty(workspace.id));
        }
    }, [showTopics, workspace.id, workspace.selected, maxHeight, workspace_open_folder]);


    workspace.title = workspace.name;

    return (
        <>
            {
                workspace.topics && Object.keys(workspace.topics).length > 0 ?
                <li>
                    <h6>{workspace.title}</h6>
                    <ul className="list-group list-group-flush">
                        {
                            Object.values(workspace.topics).map(topic => {
                                return <WorkspaceChatList
                                    show={true}
                                    key={topic.id}
                                    workspace={topic}/>;
                            })
                        }
                    </ul>
                </li>
                                                                             :
                <Wrapper
                    ref={ref.container}
                    selected={selectedChannel !== null && workspace.topic_detail && workspace.topic_detail.channel.code === selectedChannel.code}
                    className={`list-group-item d-flex align-items-center link-1 pl-0 pr-0 pb-3 pt-3 ${className}`}
                    onClick={handleSelectWorkspace}>
                    <div className="pr-3">
                        <div className="avatar avatar-sm  ico-avatar-loaded border">
                            <Initials className="rounded-circle">{handleInitials(workspace.name)}</Initials>
                        </div>
                    </div>
                    <ChannelTitlePreview className={`flex-grow-1`}>
                        <ChannelTitle channel={workspace}/>
                        <ReplyPreview channel={workspace}/>
                    </ChannelTitlePreview>
                    <Timestamp className="text-right ml-auto">
                        <WorkspaceChatDateIcons
                            className={"chat-date-icons"}
                            workspace={workspace}
                            optionsVisible={optionsVisible}
                        />
                        <WorkspaceChannelOptions
                            selectedWorkspace={workspace}
                            workspace={workspace}
                            onShowOptions={toggleOptions}
                        />
                    </Timestamp>
                </Wrapper>
            }
        </>
    );
};

export default React.memo(WorkspaceChatList);