import React from "react";
import styled from "styled-components";
import {NavLink, SvgIconFeather} from "../../common";

const Wrapper = styled.div`    
`;

const Navbar = styled.ul`
    display: block;
    width: 100%;
    
    li {
        display: inline-block;
        width: 15%;
    }
`;

const MainNavLink = styled(NavLink)`    
    padding: 10px 40px;
    border-radius: 8px;
    color: #5d5d5d;
    margin: 0 0.2rem;

    &.active {
        background-color: #7a1b8b;
        color: #fff;
    }
`;

const WorkspacePageHeaderPanel = (props) => {

    const {className = ""} = props;

    return (
        <>
            <Wrapper className={`page-header ${className}`}>
                <div className="container-fluid d-sm-flex justify-content-between">
                    <Navbar className="navbar-nav">
                        <li className="nav-item">
                            <MainNavLink isSub={true} to="/workspace/dashboard">Dashboard</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to="/workspace/posts">Posts</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to="/workspace/chat">Chat</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to="/workspace/files">Files</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to="/workspace/people">People</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <SvgIconFeather icon="settings"/>
                        </li>
                    </Navbar>
                </div>
            </Wrapper>
        </>
    );
};

export default React.memo(WorkspacePageHeaderPanel);