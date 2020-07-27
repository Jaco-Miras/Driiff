import React from "react";
import { ChannelTabResults, ChatTabResults, FilesTabResults, PeopleTabResults, PostsTabResults, WorkspaceTabResults } from "./index";

const TabContents = (props) => {

    const { activeTab, tabs } = props;
    console.log(tabs)
    return (
        <div className="tab-content" id="myTabContent">
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "chat") &&  "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("CHAT") && <ChatTabResults chats={tabs.CHATS.items}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "channel") &&  "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("CHANNEL") && <ChannelTabResults channels={tabs.CHANNEL.items}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "files") && "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("DOCUMENT") && <FilesTabResults files={tabs.DOCUMENT.items}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "people") && "active show"}`} id="users" role="tabpanel">
                { tabs.hasOwnProperty("PEOPLE") && <PeopleTabResults people={tabs.PEOPLE.items}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "post") && "active show"}`} id="photos" role="tabpanel">
                { tabs.hasOwnProperty("POST") && <PostsTabResults posts={tabs.POST.items}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "workspace") &&  "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("WORKSPACE") && <WorkspaceTabResults workspaces={tabs.WORKSPACE.items}/> }
            </div>
        </div>
    );
};

export default TabContents;