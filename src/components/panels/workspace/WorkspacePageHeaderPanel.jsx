import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {setNavMode} from "../../../redux/actions/globalActions";
import {SvgIconFeather} from "../../common/SvgIcon";

const Wrapper = styled.div`
    ${props => {
    switch (props.navMode) {
        case 3:
            return `
            margin-left: 75px;;
            
            .navigation-toggler {
                display: none;
            }
            `;
        case 0:
            return `margin-left: 0;`;
        case 1:
            return `margin-left: 75px;`;
        default:
            return ``;
    }
}}
`;

const CompanyName = styled.h1`    
`;

const MainNavLink = styled(Link)`
`;

const WorkspacePageHeaderPanel = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();
    const navMode = useSelector(state => state.global.navMode);
    const user = useSelector(state => state.session.user);

    const handleToggleNavigation = (e) => {
        e.preventDefault();

        const mode = navMode - 1;
        dispatch(
            setNavMode({mode: mode < 0 ? 2 : mode}),
        );
    };

    return (
        <>
            <Wrapper className={`page-header ${className}`}>
                <div className="container-fluid d-sm-flex justify-content-between">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <MainNavLink to="/workspace/dashboard">Dashboard</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink to="/workspace/posts">Posts</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink to="/workspace/chat">Chat</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink to="/workspace/files">Files</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink to="/workspace/people">People</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <SvgIconFeather icon="settings" />
                        </li>
                    </ul>
                </div>
            </Wrapper>
        </>
    );
};

export default React.memo(WorkspacePageHeaderPanel);