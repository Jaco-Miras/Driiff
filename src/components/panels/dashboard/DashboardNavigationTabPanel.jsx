import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {SvgIconFeather} from "../../common/SvgIcon";

const Wrapper = styled.div`
`;

const NavIconContainer = styled.span`
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

const DashboardNavigationTabPanel = (props) => {

    const {className = ""} = props;
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    const handleIconClick = (e) => {
    };

    const handleLogout = (e) => {
        e.preventDefault();
        history.push("/logout");
    };

    return (
        <Wrapper className={`navigation-menu-tab ${className}`}>
            <div>
                <div className="navigation-menu-tab-header" data-toggle="tooltip" title=""
                     data-placement="right"
                     data-original-title={user.name}>
                    <a href="/" className="nav-link" data-toggle="dropdown" aria-expanded="false">
                        <figure className="avatar avatar-sm">
                            <img src={user.profile_image_link} className="rounded-circle"
                                 alt="avatar"/>
                        </figure>
                    </a>
                </div>
            </div>
            <div className="flex-grow-1">
                <ul>
                    <li>
                        <NavIconContainer>
                            <NavIcon icon={`bar-chart-2`} onClick={handleIconClick}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer>
                            <NavIcon icon={`command`} onClick={handleIconClick}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer className={`nav-container active`}>
                            <NavIcon icon={`message-circle`} onClick={handleIconClick}/>
                        </NavIconContainer>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <NavIconContainer className={`nav-container`}>
                            <NavIcon icon={`settings`} onClick={handleLogout}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer className={`nav-container`}>
                            <NavIcon icon={`log-out`} onClick={handleLogout}/>
                        </NavIconContainer>
                    </li>
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardNavigationTabPanel);