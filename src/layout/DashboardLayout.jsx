import React, {useEffect} from "react";
import {DashboardFooterPanel, DashboardHeaderPanel, DashboardNavigationPanel} from "../components/panels";
import ChatContentPanel from "../components/panels/chat/ChatContentPanel";
import ChatSidebarPanel from "../components/panels/chat/ChatSidebarPanel";
import {useDispatch} from 'react-redux';
import {getUserSettings} from '../redux/actions/settingsActions';

const DashboardLayout = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserSettings())
    },[])

    return (
        <>
            <DashboardHeaderPanel/>

            <DashboardNavigationPanel/>

            <div className="main-content">
                <div className="container-fluid h-100">
                    <div className="row no-gutters chat-block">
                        <ChatSidebarPanel className={`col-lg-4 border-right`}/>
                        <ChatContentPanel className={`col-lg-8`}/>
                    </div>
                </div>
                <DashboardFooterPanel/>
            </div>
        </>
    );
};

export default React.memo(DashboardLayout);