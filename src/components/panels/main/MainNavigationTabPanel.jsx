import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {replaceChar} from "../../../helpers/stringFormatter";
import {getUnreadNotificationCounterEntries, setNavMode} from "../../../redux/actions/globalActions";
import {NavLink, SvgIcon, SvgIconFeather} from "../../common";
import Tooltip from "react-tooltip-lite";

const Wrapper = styled.div`
    li {
        position: relative;
        .badge {
            position: absolute;
            width: 6px;
            height: 6px;
            padding: 0;
            background: rgba(255, 68, 68, 0.8);
            right: 22px;
            top: 16px;
            z-index: 9;
        }
    }
`;

const DriffLogo = styled(SvgIcon)`
    width: 70px;
    height: 30px;
    filter: brightness(0) saturate(100%) invert(1);
    cursor: pointer;
    cursor: hand;
`;

const NavIconContainer = styled(NavLink)`
    display: flex;
    color: #fff;
    height: 55px;
    justify-content: center;
    align-items: cente;
`;

const NavIcon = styled(SvgIconFeather)`
    cursor: pointer;
    cursor: hand;
`;

const MainNavigationTabPanel = (props) => {

    const {className = ""} = props;
    const history = useHistory();
    const dispatch = useDispatch();

    const {active_topic} = useSelector(state => state.settings.user.GENERAL_SETTINGS);
    const {lastVisitedChannel} = useSelector(state => state.chat);
    const unreadCounter = useSelector(state => state.global.unreadCounter);

    const [workspacePath, setWorkpacePath] = useState("/workspace/chat");

    const handleIconClick = (e) => {
        e.preventDefault();
        if (e.target.dataset.link) {
            dispatch(
                setNavMode({mode: 3}),
            );
        } else {
            dispatch(
                setNavMode({mode: 2}),
            );
        }
        history.push(e.target.dataset.link);
    };

    useEffect(() => {
        dispatch(
            getUnreadNotificationCounterEntries(),
        );

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleTooltip = () => {
        let tooltips = document.querySelectorAll("span.react-tooltip-lite");
        tooltips.forEach((tooltip) => {
            tooltip.parentElement.classList.toggle("tooltip-active");
        });
    };

    useEffect(() => {
        if (active_topic) {
            const {workspace, topic} = active_topic;
            if (workspace) {
                setWorkpacePath(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}/${topic.id}/${replaceChar(topic.name)}`);
            } else {
                setWorkpacePath(`/workspace/chat/${topic.id}/${replaceChar(topic.name)}`);
            }
        }
    }, [active_topic]);

    return (
        <Wrapper className={`navigation-menu-tab ${className}`}>
            <div>
                <div className="navigation-menu-tab-header" data-toggle="tooltip" title="Driff"
                     data-placement="right"
                     data-original-title="Driff">
                    <DriffLogo icon="driff-logo" data-link="/" onClick={handleIconClick}/>
                </div>
            </div>
            <div className="flex-grow-1">
                <ul>
                    <li>
                        <NavIconContainer to={workspacePath}>
                            <NavIcon icon={"command"}/>
                            {
                                (unreadCounter.workspace_chat_message + unreadCounter.workspace_post) >= 1 &&
                                <Badge
                                    data-count={(unreadCounter.workspace_chat_message + unreadCounter.workspace_post)}>&nbsp;</Badge>
                            }
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer
                            active={["dashboard", "posts", "chat", "files", "people"].includes(props.match.params.page)}
                            to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ?
                                `/chat/${lastVisitedChannel.code}` : "/chat"}>
                            <NavIcon icon={"message-circle"}/>
                            {
                                unreadCounter.hasOwnProperty("chat_message") && unreadCounter.chat_message >= 1 &&
                                <Badge
                                    data-count={unreadCounter.chat_message}>&nbsp;</Badge>
                            }
                        </NavIconContainer>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <NavIconContainer to="/settings">

                            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Settings">
                                <NavIcon icon={"settings"}/>
                            </Tooltip>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer to="/logout">
                            <NavIcon icon={"log-out"}/>
                        </NavIconContainer>
                    </li>
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(MainNavigationTabPanel);