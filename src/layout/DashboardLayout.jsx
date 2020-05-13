import React from "react";
import {DashboardFooterPanel, DashboardHeaderPanel, DashboardNavigationPanel} from "../components/panels";
import ChatContentPanel from "../components/panels/chat/ChatContentPanel";
import ChatSidebarPanel from "../components/panels/chat/ChatSidebarPanel";

const DashboardLayout = () => {
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