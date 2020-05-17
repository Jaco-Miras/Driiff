import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {SvgIconFeather} from "../../common/SvgIcon";

const Wrapper = styled.div`
`;

const MainNavLink = styled(Link)`
`;

const WorkspacePageHeaderPanel = (props) => {

    const {className = ""} = props;

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
                            <SvgIconFeather icon="settings"/>
                        </li>
                    </ul>
                </div>
            </Wrapper>
        </>
    );
};

export default React.memo(WorkspacePageHeaderPanel);