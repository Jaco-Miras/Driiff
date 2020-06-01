import React from "react";
import styled from "styled-components";
import {NavLink} from "../../common";
import {SettingsLink} from "../../workspace";

const Wrapper = styled.div`    
`;

const Navbar = styled.ul`
    display: block;
    width: 100%;
    margin-left: -30px;
    
    li {
        display: inline-block;
        width: 15%;
        text-align: center;
        
        &:last-child {
            text-align: right;
        }
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

    const pathname = props.match.url.replace(`/workspace/${props.match.params.page}`, "");

    return (
        <>
            <Wrapper className={`page-header ${className}`}>
                <div className="container-fluid d-sm-flex justify-content-between">
                    <Navbar className="navbar-nav">
                        <li className="nav-item">
                            <MainNavLink isSub={true} to={`/workspace/dashboard${pathname}`}>Dashboard</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to={`/workspace/posts${pathname}`}>Posts</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to={`/workspace/chat${pathname}`}>Chat</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to={`/workspace/files${pathname}`}>Files</MainNavLink>
                        </li>
                        <li className="nav-item">
                            <MainNavLink isSub={true} to={`/workspace/people${pathname}`}>People</MainNavLink>
                        </li>
                        <SettingsLink/>
                    </Navbar>
                </div>
            </Wrapper>
        </>
    );
};

export default React.memo(WorkspacePageHeaderPanel);