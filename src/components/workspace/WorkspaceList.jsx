import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {addToChannels, getChannel, setSelectedChannel} from "../../redux/actions/chatActions";
import {addToModals} from "../../redux/actions/globalActions";
import {setUserGeneralSetting} from "../../redux/actions/settingsActions";
import {SvgIconFeather} from "../common";
import TopicList from "./TopicList";
import {replaceChar} from "../../helpers/stringFormatter";

const Wrapper = styled.li`
    ${props => !props.show && `display: none;`} 
    cursor: pointer;
    cursor: hand;
    position: relative;
    
    > a {
        font-weight: ${props => props.selected ? "bold" : "normal"};
        color: ${props => props.selected ? "#7a1b8b !important" : "#64625C"};
        margin-bottom: 10px;
        
        .badge {
            padding: 3px 7px;
            position: absolute;
            right: 25px;
            overflow: hidden;    
            transition: all .3s ease;
            top: 12px;
            opacity: 1;
            
            &.enter-active {                
                transform: translate(0, 0);                        
            }
            
            &.leave-active {
                opacity: 0;                
                transform: translate(0, 100%);                
            }
        }
    }
    
    ul {
        li {
            .badge {
                padding: 3px 7px;
                position: absolute;
                right: -40px;
                top: 0;
            }
        }
    }
`;

const TopicNav = styled.ul`
    display: block !important;
    overflow: hidden;    
    transition: all .3s ease;

    &.enter-active {
        max-height: ${props => props.maxHeight}px;        
    }

    &.leave-active {
        max-height: 0px;
    }
`;

const WorkspaceList = props => {

    const {className = "", show = true, workspace} = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const route = useRouteMatch();
    const ref = {
        container: useRef(null),
        arrow: useRef(null),
        nav: useRef(null),
    };

    const workspace_open_folder = useSelector(state => state.settings.user.GENERAL_SETTINGS.workspace_open_folder);

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
        //set the selected topic
        if (workspace.selected) return;
        if (workspace.is_external === 1) {

        } else {

            history.push(`/workspace/${route.params.page}/${workspace.id}/${replaceChar(workspace.name)}`);

            if (workspace.channel_loaded === undefined) {
                dispatch(
                    getChannel({channel_id: workspace.topic_detail.channel.id}, (err, res) => {
                        if (err) return;
                        let channel = {
                            ...res.data,
                            hasMore: true,
                            skip: 0,
                            replies: [],
                            selected: true,
                        };
                        dispatch(addToChannels(channel));
                        dispatch(setSelectedChannel(channel));
                    }),
                );
            }
        }
    };

    const handleShowTopics = (e) => {
        e.preventDefault();

        if (workspace.type === "FOLDER") {
            if (!showTopics) {
                dispatch(
                    setUserGeneralSetting({
                        workspace_open_folder: {
                            ...workspace_open_folder,
                            [workspace.id]: workspace.id,
                        },
                    }),
                );
            } else {
                delete workspace_open_folder[workspace.id];
                dispatch(
                    setUserGeneralSetting({
                        workspace_open_folder: workspace_open_folder,
                    }),
                );
            }
            setShowTopics(prevState => !prevState);
        } else {
            handleSelectWorkspace();
        }
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

    return (
        <Wrapper ref={ref.container} className={`worskpace-list ${className}`}
                 selected={workspace.selected}
                 show={show}>
            <a className={`${workspace.selected && "active"}`} href="/"
               onClick={handleShowTopics}>{workspace.name}
                {
                    workspace.type === "FOLDER" &&
                    <i ref={ref.arrow}
                       className={`sub-menu-arrow ti-angle-up ${showTopics ? "ti-minus rotate-in" : "ti-plus"}`}/>
                }
                {
                    workspace.unread_count > 0 &&
                    <Badge color="danger">
                        {
                            workspace.unread_count
                        }
                    </Badge>
                }
            </a>
            {
                workspace.type === "FOLDER" &&
                <TopicNav ref={ref.nav} maxHeight={maxHeight}
                          className={showTopics === null ? "" : showTopics ? "enter-active" : "leave-active"}>
                    {
                        Object.keys(workspace.topics).length > 0 && Object.values(workspace.topics).map(topic => {
                            return <TopicList key={topic.id} topic={topic}/>;
                        })
                    }
                    <li className="nav-action" onClick={handleShowWorkspaceModal}>
                        <SvgIconFeather icon="plus"/> New workspace
                    </li>
                </TopicNav>
            }
        </Wrapper>
    );
};

export default WorkspaceList;