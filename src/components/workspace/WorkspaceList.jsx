import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {addToChannels, getChannel, setSelectedChannel} from "../../redux/actions/chatActions";
import {addToModals} from "../../redux/actions/globalActions";
import {setActiveTopic} from "../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../common";
import TopicList from "./TopicList";

const Wrapper = styled.li`
    ${props => !props.show && `display: none;`} 
    cursor: pointer;
    cursor: hand;
    
    > a {
        font-weight: ${props => props.selected ? "bold" : "normal"};
        color: ${props => props.selected ? "#7a1b8b !important" : "#64625C"};
        margin-bottom: 10px;
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

    const [showTopics, setShowTopics] = useState(false);
    const [maxHeight, setMaxHeight] = useState(0);

    const handleSelectWorkpace = () => {
        //set the selected topic
        if (workspace.selected) return;
        if (workspace.is_external === 1) {

        } else {
            dispatch(setActiveTopic(workspace));

            history.push(`/workspace/${route.params.page}/${workspace.name}/${workspace.id}`);

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
            setShowTopics(!showTopics);
        } else {
            handleSelectWorkpace();
        }
    };

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

    useEffect(() => {
        if (ref.nav.current !== null) {
            setMaxHeight(ref.nav.current.offsetHeight);

            const navClassList = ref.nav.current.classList;
            navClassList.add("leave-active");
        }
    }, [ref.nav, maxHeight]);

    useEffect(() => {
        if (ref.container.current && ref.arrow.current) {
            let navClassList = ref.nav.current.classList;
            let iClassList = ref.arrow.current.classList;

            if (showTopics) {
                iClassList.remove("ti-plus");
                iClassList.add("ti-minus");
                iClassList.add("rotate-in");
                navClassList.add("enter-active");
                navClassList.remove("leave-active");
            } else {
                iClassList.add("ti-plus");
                iClassList.remove("ti-minus");
                iClassList.remove("rotate-in");
                navClassList.add("leave-active");
                navClassList.remove("enter-active");
            }
        }
    }, [showTopics]);

    return (
        <Wrapper ref={ref.container} className={`worskpace-list ${className}`} selected={workspace.selected}
                 show={show}>
            <a href="/" onClick={handleShowTopics}>{workspace.name}
                {
                    workspace.type === "FOLDER" &&
                    <i ref={ref.arrow}
                       className={`sub-menu-arrow ti-angle-up`}></i>
                }
            </a>
            {
                workspace.type === "FOLDER" &&
                <TopicNav ref={ref.nav} maxHeight={maxHeight}>
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