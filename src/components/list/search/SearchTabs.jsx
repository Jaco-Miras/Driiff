import React from "react";
import styled from "styled-components";

const Wrapper = styled.ul`
  &.nav-pills .nav-link.active {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;
const SearchTabs = (props) => {
  const { activeTab, onSelectTab, tabs, dictionary } = props;

  return (
    <Wrapper className="nav nav-pills mb-4" role="tablist">
      {tabs.hasOwnProperty("CHANNEL") && Object.keys(tabs.CHANNEL).length > 0 && (
        <li className="nav-item">
          <a className={`nav-link ${(activeTab === "channel" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="channel" role="tab" aria-controls="clasic" aria-selected="true">
            {dictionary.chatChannel}
          </a>
        </li>
      )}
      {tabs.hasOwnProperty("CHAT") && Object.keys(tabs.CHAT).length > 0 && (
        <li className="nav-item">
          <a className={`nav-link ${(activeTab === "chat" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="chat" role="tab" aria-controls="clasic" aria-selected="true">
            {dictionary.message}
          </a>
        </li>
      )}
      {tabs.hasOwnProperty("COMMENT") && Object.keys(tabs.COMMENT).length > 0 && (
        <li className="nav-item">
          <a className={`nav-link ${(activeTab === "comment" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="comment" role="tab" aria-controls="clasic" aria-selected="true">
            {dictionary.comment}
          </a>
        </li>
      )}
      {tabs.hasOwnProperty("DOCUMENT") && Object.keys(tabs.DOCUMENT).length > 0 && (
        <li className="nav-item">
          <a className={`nav-link ${(activeTab === "document" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="document" role="tab" aria-controls="articles" aria-selected="false">
            {dictionary.files}
          </a>
        </li>
      )}
      {tabs.hasOwnProperty("PEOPLE") && Object.keys(tabs.PEOPLE).length > 0 && (
        <li className="nav-item">
          <a className={`nav-link ${(activeTab === "people" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="people" role="tab" aria-controls="users" aria-selected="false">
            {dictionary.people}
          </a>
        </li>
      )}
      {tabs.hasOwnProperty("POST") && Object.keys(tabs.POST).length > 0 && (
        <li className="nav-item">
          <a className={`nav-link ${(activeTab === "post" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="post" role="tab" aria-controls="photos" aria-selected="false">
            {dictionary.posts}
          </a>
        </li>
      )}
      {tabs.hasOwnProperty("WORKSPACE") && Object.keys(tabs.WORKSPACE).length > 0 && (
        <li className="nav-item">
          <a className={`nav-link ${(activeTab === "workspace" || activeTab === null) && "active"}`} onClick={onSelectTab} data-toggle="tab" data-value="workspace" role="tab" aria-controls="photos" aria-selected="false">
            {dictionary.workspace}
          </a>
        </li>
      )}
    </Wrapper>
  );
};

export default SearchTabs;
