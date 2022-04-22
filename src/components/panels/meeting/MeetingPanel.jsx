import React from "react";
import styled from "styled-components";
import MeetingSidebar from "./MeetingSidebar";
import MeetingSearch from "./MeetingSearch";
import MeetingList from "./MeetingList";

const Wrapper = styled.div`
  overflow: auto;
  text-align: left;
  min-height: 100px;
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
  .app-block {
    overflow: unset !important;
    height: auto;
    .app-content .app-action .action-right {
      margin-left: 0;
    }
    .app-content .app-action {
      padding: 20px;
    }
  }
`;

const MeetingPanel = (props) => {
  const { isWorkspace = false } = props;

  return (
    <Wrapper className={"container-fluid h-100 fadeIn"}>
      <div className="row app-block">
        <MeetingSidebar className="col-lg-3" />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <MeetingSearch />
          <MeetingList isWorkspace={isWorkspace} />
        </div>
      </div>
    </Wrapper>
  );
};
export default React.memo(MeetingPanel);
