import React from "react";
import styled from "styled-components";
import WorkInProgressSidebar from "../wip/WorkInProgressSidebar";
import WorkInProgressSearch from "../wip/WorkInProgressSearch";
import WIPList from "../wip/WIPList";
import WIPDetail from "../wip/WIPDetail";
import { useWIP } from "../../hooks";

const Wrapper = styled.div``;

const WorkspaceWorkInProgressPanel = () => {
  const { wip, wips } = useWIP();
  return (
    <Wrapper className={"container-fluid h-100 fadeIn"}>
      <div className="row app-block">
        <WorkInProgressSidebar />
        <div className="col-md-9 app-content">
          <div className="app-content-overlay" />
          {!wip && <WorkInProgressSearch />}
          {!wip && <WIPList wips={wips} />}
          {wip && <WIPDetail item={wip} />}
        </div>
      </div>
    </Wrapper>
  );
};

export default WorkspaceWorkInProgressPanel;
