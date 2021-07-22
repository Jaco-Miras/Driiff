import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  border-left: 5px solid #822492;
  text-align: left;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  position: relative;

  .bg-overlay {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transition: all 0.3s ease;
    background: linear-gradient(0deg, rgba(252, 252, 252, 1) 0%, rgba(252, 252, 252, 0.25) 50%, rgba(255, 255, 255, 0.5) 100%);
    opacity: 0;

    .dark & {
      background: none;
    }

    &.hide {
      opacity: 1;
    }
  }

  .card-body {
    position: relative;
    z-index: 1;
  }

  .feather {
    cursor: pointer;
    &:hover {
      color: #7a1b8b;
    }
  }
  .card-title {
    position: relative;

    .feather-edit {
      right: 0;
      width: 16px;
      position: absolute;
    }
  }
  .file-attachments {
    .files {
      width: 100%;
    }
  }
`;

const DashboardDescriptionContainer = styled.div`
  &.hide {
    .btn-toggle-show {
      display: block;
      color: #828282;
    }
  }
  &.show {
    .btn-toggle-show {
      display: block;
      color: #828282;
    }
  }

  .btn-toggle-show {
    text-align: right;
    display: none;
  }
`;

const DashboardDescription = styled.div`
  transition: all 0.3s ease;
  max-width: 700px;
  min-height: 140px;

  &.hide {
    max-height: 140px;
  }

  &.show {
    max-height: ${(props) => props.height}px;
  }

  img {
    max-width: 100%;
    max-height: 250px;
  }
`;

const DashboardAboutWorkspace = (props) => {
  const { className = "", onEditClick, workspace, isMember, isExternal, dictionary } = props;

  const [prevWorkspaceDescription, setPrevWorkspaceDescription] = useState("");
  const [showMore, setShowMore] = useState(null);
  const [descriptionHeight, setDescriptionHeight] = useState(140);

  const refs = {
    description: useRef(null),
  };

  const refDescription = (e) => {
    if (refs.description.current === null && e) {
      refs.description.current = e;

      if (e.clientHeight > 140) {
        setDescriptionHeight(e.clientHeight);
        setShowMore(false);
      } else {
        setShowMore(null);
      }
    }
  };

  const toggleShowMore = (e) => {
    e.preventDefault();
    setShowMore((state) => !state);
  };

  useEffect(() => {
    if (refs.description.current) {
      if (showMore === true) {
        setTimeout(() => {
          refs.description.current.style.overflow = "";
        }, [300]);
      } else if (showMore === false) {
        refs.description.current.style.overflow = "hidden";
      }
    }
  }, [showMore, refs.description.current]);

  useEffect(() => {
    if (workspace && prevWorkspaceDescription !== workspace.description) {
      setPrevWorkspaceDescription(workspace.description);
      setShowMore(null);
      refs.description.current = null;
    }
  }, [workspace]);

  return (
    <Wrapper className={`dashboard-about-workspace card ${className}`}>
      <div className={`bg-overlay ${showMore === null ? "" : showMore === true ? "show" : "hide"}`} />
      <div className="card-body">
        <h5 className="card-title">
          {dictionary.aboutThisWorkspace} {isMember === true && !isExternal && workspace.active === 1 && <SvgIconFeather icon="edit" onClick={onEditClick} />}
        </h5>
        {workspace && (
          <>
            <DashboardDescriptionContainer className={showMore === null ? "" : showMore === true ? "show" : "hide"}>
              <DashboardDescription
                ref={refDescription}
                height={descriptionHeight}
                className={`dashboard-description ${showMore === null ? "" : showMore === true ? "show" : "hide"}`}
                dangerouslySetInnerHTML={{ __html: workspace.description }}
              />
              {showMore !== null && (
                <div onClick={toggleShowMore} className="btn-toggle-show cursor-pointer mt-2">
                  {showMore ? dictionary.showLess : dictionary.showMore}
                </div>
              )}
            </DashboardDescriptionContainer>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(DashboardAboutWorkspace);
