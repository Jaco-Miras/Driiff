import React from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {setNavMode} from "../../../redux/actions/globalActions";
import {SvgIcon, SvgIconFeather} from "../../common/SvgIcon";

const Wrapper = styled.div`
`;

const DriffLogo = styled(SvgIcon)`
    width: 70px;
    height: 30px;
    filter: brightness(0) saturate(100%) invert(1);
    cursor: pointer;
    cursor: hand; 
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

const MainNavigationTabPanel = (props) => {

    const {className = ""} = props;
    const history = useHistory();
    const dispatch = useDispatch();

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

    const handleLogout = (e) => {
        e.preventDefault();
        history.push("/logout");
    };

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
                        <NavIconContainer>
                            <NavIcon icon={`bar-chart-2`} onClick={handleIconClick}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer>
                            <NavIcon icon={`command`} data-link="/workspace/dashboard" onClick={handleIconClick}/>
                        </NavIconContainer>
                    </li>
                    <li>
                        <NavIconContainer className={`nav-container active`}>
                            <NavIcon icon={`message-circle`} data-link="/chat" onClick={handleIconClick}/>
                        </NavIconContainer>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <NavIconContainer className={`nav-container`}>
                            <NavIcon icon={`settings`} data-link="/settings" onClick={handleIconClick}/>
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

export default React.memo(MainNavigationTabPanel);