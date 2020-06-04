import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {setNavMode, getUnreadNotificationCounterEntries} from "../../../redux/actions/globalActions";
import {NavLink, SvgIcon, SvgIconFeather} from "../../common";
import {replaceChar} from "../../../helpers/stringFormatter";

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

    const generalSettings = useSelector(state => state.settings.user.GENERAL_SETTINGS);
    const unread = useSelector(state =>  state.global.unreadCounter);
    const [hasUnread, setHasUnread] = useState(false);

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
            getUnreadNotificationCounterEntries()
        )
    }, []);


    useEffect(() => {
        /**
         * @todo seggregat for chat
         */
        if (unread.length >= 1) {
            setHasUnread(true);
        } else {
            setHasUnread(false);
        }
    }, [unread])

    /**
     * @todo must not be here
     */
    let workspacePath = "/workspace/dashboard";
    if (generalSettings.active_topic) {
        const {workspace, topic} =  generalSettings.active_topic;
        if (workspace) {
            workspacePath += `/${workspace.id}/${replaceChar(workspace.name)}/${topic.id}/${replaceChar(topic.name)}/`;
        } else {
            workspacePath += `/${topic.id}/${replaceChar(topic.name)}/`;
        }
    }

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
                                hasUnread === true &&
                                <Badge>&nbsp;</Badge>
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