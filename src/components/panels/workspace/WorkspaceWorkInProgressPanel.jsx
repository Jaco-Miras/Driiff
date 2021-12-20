import React from "react";
import styled from "styled-components";
import WorkInProgressSidebar from "../wip/WorkInProgressSidebar";
import WorkInProgressSearch from "../wip/WorkInProgressSearch";
import GallerySidebarComments from "../wip/GallerySidebarComments";
import GalleryView from "../wip/GalleryView";
import GalleryViewPlaceholder from "../wip/GalleryViewPlaceholder";
import WIPList from "../wip/WIPList";
import WIPDetail from "../wip/WIPDetail";
import { useWIP } from "../../hooks";

const Wrapper = styled.div`
  height: ${(props) => (props.showGallery ? "calc(100vh - 115px)" : "100%")};
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;

  .app-lists {
    overflow: visible !important;
  }

  .app-block {
    overflow: ${(props) => (props.showGallery ? "hidden" : "inherit")};
  }

  .search-title {
    margin: 1.5rem 1.5rem 0;
  }

  .app-content-body {
    position: relative;
    overflow: visible !important;
    height: auto !important;
    min-height: auto;

    .app-lists {
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }
  .app-content-body.gallery-page {
    overflow: hidden !important;
  }

  .all-action-button {
    background: none;
    color: #828282;
    padding: 10px 5px 5px 5px;
    font-weight: 500;
    .dark & {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .unset-flex {
    flex: unset !important;
  }
  .other-posts-header {
    background-color: #fafafa !important;
    .dark & {
      background-color: hsla(0, 0%, 100%, 0.0784313725490196) !important;
    }
  }
`;

const WorkspaceWorkInProgressPanel = () => {
  const { wip, wips, showGallery } = useWIP();
  return (
    <Wrapper className={"container-fluid fadeIn"} showGallery={showGallery}>
      <div className="row app-block">
        {showGallery && <GallerySidebarComments />}
        {!showGallery && <WorkInProgressSidebar />}
        <div className="col-md-9 app-content">
          <div className="app-content-overlay" />
          {showGallery && wip && <GalleryView item={wip} />}
          {showGallery && !wip && <GalleryViewPlaceholder />}
          {!wip && !showGallery && <WorkInProgressSearch />}
          {!wip && !showGallery && <WIPList wips={wips} />}
          {wip && !showGallery && <WIPDetail item={wip} />}
        </div>
      </div>
    </Wrapper>
  );
};

export default WorkspaceWorkInProgressPanel;
