import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {replaceChar} from "../../../helpers/stringFormatter";
import {getUnreadNotificationCounterEntries, setNavMode} from "../../../redux/actions/globalActions";
import {NavLink, SvgIcon, SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    li {
        position: relative;
        
        .badge {
            position: relative;
            width: 8px;
            height: 8px;
            padding: 0;
            top: -8px;
            right: 0px;
            background: #f44;           
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

    const [workspacePath, setWorkpacePath] = useState("/workspace/dashboard");

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
    }, []);

    useEffect(() => {
        if (active_topic) {
            const {workspace, topic} = active_topic;
            if (workspace) {
                setWorkpacePath(`/workspace/dashboard/${workspace.id}/${replaceChar(workspace.name)}/${topic.id}/${replaceChar(topic.name)}/`);
            } else {
                setWorkpacePath(`/workspace/dashboard/${topic.id}/${replaceChar(topic.name)}/`);
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
                        <NavIconContainer to="/dashboard">
                            <NavIcon icon={`bar-chart-2`}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer to={workspacePath}>
                            <NavIcon icon={`command`}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ?
                                              `/chat/${lastVisitedChannel.code}` : "/chat"}>
                            <NavIcon icon={`message-circle`}/>
                            {
                                props.match.params.page === "workspace" && unreadCounter.hasOwnProperty("chat_message") && unreadCounter.chat_message >= 1 &&
                                <Badge data-count={unreadCounter.chat_message}>&nbsp;</Badge>
                            }
                        </NavIconContainer>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <NavIconContainer to="/settings">
                            <NavIcon icon={`settings`}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer to="/logout">
                            <NavIcon icon={`log-out`}/>
                        </NavIconContainer>
                    </li>
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(MainNavigationTabPanel);