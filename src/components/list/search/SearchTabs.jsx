import React from "react";

const SearchTabs = (props) => {

    const { activeTab, onSelectTab } = props;

    return (
        <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item">
                <a className={`nav-link ${(activeTab === "chat" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="chat" role="tab" aria-controls="clasic" aria-selected="true">
                Chat
                </a>
            </li>
            <li className="nav-item">
                <a className={`nav-link ${activeTab === "files" && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="files" role="tab" aria-controls="articles" aria-selected="false">
                Files
                </a>
            </li>
            <li className="nav-item">
                <a className={`nav-link ${activeTab === "posts" && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="posts" role="tab" aria-controls="photos" aria-selected="false">
                Posts
                </a>
            </li>
            <li className="nav-item">
                <a className={`nav-link ${activeTab === "people" && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="people" role="tab" aria-controls="users" aria-selected="false">
                People
                </a>
            </li>
        </ul>
    );
};

export default SearchTabs;