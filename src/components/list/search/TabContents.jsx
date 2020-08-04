import React from "react";
import { ChannelTabResults, ChatTabResults, CommentTabResults, FilesTabResults, PeopleTabResults, PostsTabResults, WorkspaceTabResults } from "./index";

const TabContents = (props) => {

    const { activeTab, tabs, redirect } = props;
    console.log(tabs)
    return (
        <div className="tab-content" id="myTabContent">
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "channel") &&  "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("CHANNEL") && <ChannelTabResults channels={tabs.CHANNEL.items} page={tabs.CHANNEL.page} redirect={redirect}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "chat") &&  "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("CHAT") && <ChatTabResults chats={tabs.CHAT.items} page={tabs.CHAT.page} redirect={redirect}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "comment") &&  "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("COMMENT") && <CommentTabResults comments={tabs.COMMENT.items} page={tabs.COMMENT.page} redirect={redirect}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "document") && "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("DOCUMENT") && <FilesTabResults files={tabs.DOCUMENT.items} page={tabs.DOCUMENT.page} redirect={redirect}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "people") && "active show"}`} id="users" role="tabpanel">
                { tabs.hasOwnProperty("PEOPLE") && <PeopleTabResults people={tabs.PEOPLE.items} page={tabs.PEOPLE.page} redirect={redirect}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "post") && "active show"}`} id="photos" role="tabpanel">
                { tabs.hasOwnProperty("POST") && <PostsTabResults posts={tabs.POST.items} page={tabs.POST.page} redirect={redirect}/> }
            </div>
            <div className={`tab-pane fade ${(activeTab === null || activeTab === "workspace") &&  "active show"}`} role="tabpanel">
                { tabs.hasOwnProperty("WORKSPACE") && <WorkspaceTabResults workspaces={tabs.WORKSPACE.items} page={tabs.WORKSPACE.page} redirect={redirect}/> }
            </div>
        </div>
    );
};

export default TabContents;