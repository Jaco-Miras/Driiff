import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {DashboardFooterPanel, DashboardHeaderPanel, DashboardNavigationPanel} from "../components/panels";
import ChatContentPanel from "../components/panels/chat/ChatContentPanel";
import ChatSidebarPanel from "../components/panels/chat/ChatSidebarPanel";
import Socket from "../components/socket/socket";
import {getAllRecipients} from "../redux/actions/globalActions";
import {getUserSettings} from "../redux/actions/settingsActions";
import {getMentions} from "../redux/actions/userAction";

const MainContent = styled.div`
    padding-top: 1rem;
    //apply test height
    height: calc(100vh - 100px);
    overflow: hidden;
    ${props => {
    switch (props.navMode) {
        case 0:
            return `margin-left: 0;`;
        case 1:
            return `margin-left: 75px;`;
        default:
            return `margin-left: 300px`;
    }
}}
`;

const DashboardLayout = () => {

    const dispatch = useDispatch();

    const navMode = useSelector(state => state.global.navMode);

    useEffect(() => {
        dispatch(getUserSettings());
        dispatch(getAllRecipients());
        dispatch(getMentions())
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DashboardHeaderPanel/>

            <DashboardNavigationPanel/>
            <Socket/>
            <MainContent className="main-content" navMode={navMode}>
                <div className="container-fluid h-100">
                    <div className="row no-gutters chat-block">
                        <ChatSidebarPanel className={`col-lg-4 border-right`}/>
                        <ChatContentPanel className={`col-lg-8`}/>
                    </div>
                </div>
                <DashboardFooterPanel/>
            </MainContent>
        </>
    );
};

export default React.memo(DashboardLayout);