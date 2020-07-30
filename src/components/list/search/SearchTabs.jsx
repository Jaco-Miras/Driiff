import React from "react";

const SearchTabs = (props) => {

    const { activeTab, onSelectTab, tabs } = props;

    return (
        <ul className="nav nav-tabs mb-4" role="tablist">
            {
                tabs.hasOwnProperty("CHANNEL") && Object.keys(tabs.CHANNEL).length > 0 &&
                <li className="nav-item">
                    <a className={`nav-link ${(activeTab === "channel" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="channel" role="tab" aria-controls="clasic" aria-selected="true">
                    Channel
                    </a>
                </li>
            }
            {
                tabs.hasOwnProperty("CHAT") && Object.keys(tabs.CHAT).length > 0 &&
                <li className="nav-item">
                    <a className={`nav-link ${(activeTab === "chat" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="chat" role="tab" aria-controls="clasic" aria-selected="true">
                    Chat
                    </a>
                </li>
            }
            {
                tabs.hasOwnProperty("COMMENT") && Object.keys(tabs.COMMENT).length > 0 &&
                <li className="nav-item">
                    <a className={`nav-link ${(activeTab === "comment" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="comment" role="tab" aria-controls="clasic" aria-selected="true">
                    Comment
                    </a>
                </li>
            }
            {
                tabs.hasOwnProperty("DOCUMENT") && Object.keys(tabs.DOCUMENT).length > 0 &&
                <li className="nav-item">
                    <a className={`nav-link ${(activeTab === "document" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="document" role="tab" aria-controls="articles" aria-selected="false">
                    Files
                    </a>
                </li>
            }
            {
                tabs.hasOwnProperty("PEOPLE") && Object.keys(tabs.PEOPLE).length > 0 &&
                <li className="nav-item">
                    <a className={`nav-link ${(activeTab === "people" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="people" role="tab" aria-controls="users" aria-selected="false">
                    People
                    </a>
                </li>
            }
            {
                tabs.hasOwnProperty("POST") && Object.keys(tabs.POST).length > 0 &&
                <li className="nav-item">
                    <a className={`nav-link ${(activeTab === "post" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="post" role="tab" aria-controls="photos" aria-selected="false">
                    Posts
                    </a>
                </li>
            }
            {
                tabs.hasOwnProperty("WORKSPACE") && Object.keys(tabs.WORKSPACE).length > 0 &&
                <li className="nav-item">
                    <a className={`nav-link ${(activeTab === "workspace" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="workspace" role="tab" aria-controls="photos" aria-selected="false">
                    Workspace
                    </a>
                </li>
            }
        </ul>
    );
};

export default SearchTabs;