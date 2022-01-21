import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { MoreOptions } from "../common";
import WIPDetailBody from "./WIPDetailBody";
import WIPDetailCounters from "./WIPDetailCounters";
import WIPDetailFooter from "./WIPDetailFooter";
import WIPDetailComments from "./WIPDetailComments";
import { useWIPActions, useWIPComments } from "../../hooks";
import moment from "moment";

const Wrapper = styled.div`
  min-height: auto;
  overflow: visible !important;
  height: auto !important;
`;

const WIPDetailWrapper = styled.div`
  min-height: 240px;
  .card-body {
    padding: 1rem 1.5rem;
  }
`;

const MainHeader = styled.div`
  .feather-eye-off {
    position: relative;
    top: -1px;
    margin-right: 0.25rem;
    width: 12px;
  }
  min-height: 70px;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      .post-title {
        width: 100%;
      }
    }
  }

  .company-post-detail-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .close {
    .dark & {
      color: #fff;
    }
  }

  .author-name {
    color: #a7abc3;
    font-size: 14px;
  }
  .deadline-label {
    border-radius: 6px;
    padding: 3px 5px;
    background-color: hsla(0, 0%, 82.4%, 0.2);
    font-size: 12px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    font-weight: normal;
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;

  &.close {
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
`;

const StyledMoreOptions = styled(MoreOptions)`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  height: 36px;
  width: 40px;
  align-items: center;
  justify-content: center;
  .feather-more-horizontal {
    width: 25px;
    height: 24px;
  }
  .more-options-tooltip {
    left: auto;
    right: 0;
    top: 25px;
    width: 250px;

    svg {
      width: 14px;
    }
  }
`;

const MainBody = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  flex-flow: column;

  .receiver {
    border-radius: 6px;
    padding: 3px 5px;
    background-color: rgba(210, 210, 210, 0.2);
    font-size: 11px;
    margin-right: 3px;
    cursor: pointer;
  }

  a {
    color: #7a1b8b;
    text-decoration: underline;

    .dark & {
      color: #7a1b8b !important;
    }
  }

  .clap-count-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    &:hover {
      .not-read-users-container,
      .read-users-container {
        opacity: 1;
        max-height: 300px;
      }
    }
    .not-read-users-container,
    .read-users-container {
      position: absolute;
      left: 22px;
      z-index: 1;
      bottom: 0;
      border-radius: 8px;
      opacity: 0;
      max-height: 0;
      transition: all 0.5s ease;
      overflow-y: auto;
      border: 1px solid #fff;
      box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
      background: #fff;

      &:hover {
        max-height: 300px;
        opacity: 1;
      }

      .dark & {
        border: 1px solid #25282c;
        background: #25282c;
      }

      > span {
        padding: 0.25rem 0.5rem 0.25rem 0.25rem;
        display: flex;
        justify-content: flex-start;

        .name {
          display: block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }

  .user-reads-container {
    position: relative;
    display: inline-flex;
    margin-right: 0.5rem;

    .not-read-users-container,
    .read-users-container {
      transition: all 0.5s ease;
      position: absolute;
      right: 0;
      bottom: 30px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background-color: #fff;
      overflow: auto;
      opacity: 0;
      max-height: 0;

      &:hover {
        opacity: 1;
        max-height: 175px;
      }

      .dark & {
        background-color: #25282c;
        border: 1px solid #25282c;
      }

      > span {
        padding: 0.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .avatar {
          img {
            min-width: 2.3rem;
          }
        }

        .name {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      }
    }
  }

  .user-reads-container {
    span.not-readers:hover ~ span.not-read-users-container,
    span.no-readers:hover ~ span.read-users-container {
      opacity: 1;
      max-height: 175px;
    }
  }
`;

const WIPDetail = (props) => {
  const { item } = props;
  const wipActions = useWIPActions();
  const { comments } = useWIPComments();
  const user = useSelector((state) => state.session.user);
  const handleGoBack = () => {
    wipActions.goBack();
  };
  const getPriorityColor = () => {
    if (item.priority === "medium") {
      return "badge-warning";
    } else if (item.priority === "high") {
      return "badge-danger";
    } else {
      return "badge-twitter";
    }
  };
  const handleEditWIP = () => {
    wipActions.showModal("edit", item);
  };
  return (
    <>
      <Wrapper className="card card-body app-content-body mb-4">
        <WIPDetailWrapper className="fadeBottom">
          <MainHeader className="card-header d-flex justify-content-between">
            <div className="d-flex flex-column align-items-start">
              <div className="d-flex align-items-center">
                <div>
                  <Icon className="close mr-2" icon="arrow-left" width="24" height="24" onClick={handleGoBack} />
                </div>
                <div>
                  <h5 className="post-title mb-0">
                    <span>{item.title}</span>
                  </h5>
                  <span className="d-flex">
                    <span className={`badge ${getPriorityColor()}`}>{item.priority}</span>
                    <span className="deadline-label ml-2">
                      <Icon className="mr-2" icon="calendar" />
                      {moment(item.deadline.timestamp, "X").format("DD-MM-YYYY")}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              {item.author.id === user.id && (
                <ul>
                  <li>
                    <span data-toggle="modal" data-target="#editTaskModal" onClick={handleEditWIP}>
                      <a className="btn btn-outline-light ml-2" title="" data-toggle="tooltip" data-original-title="Edit WIP">
                        <Icon icon="edit-3" />
                      </a>
                    </span>
                  </li>
                  <li>
                    <a className="btn btn-outline-light ml-2" data-toggle="tooltip" title="" data-original-title="Delete WIP">
                      <Icon icon="trash" />
                    </a>
                  </li>
                  <li>
                    <StyledMoreOptions className="ml-2" width={220} moreButton={"more-horizontal"}></StyledMoreOptions>
                  </li>
                </ul>
              )}
              {/* {item.author.id !== user.id && (
                <div>
                  <StyledMoreOptions className="ml-2" width={170} moreButton={"more-horizontal"}></StyledMoreOptions>
                </div>
              )} */}
            </div>
          </MainHeader>
          <MainBody>
            <WIPDetailBody item={item} />
            <hr className="m-0" />
            <WIPDetailCounters item={item} />
            <WIPDetailComments item={item} comments={comments} />
            <WIPDetailFooter wip={item} />
            {/* <DropDocument
            hide={!showDropZone}
            ref={refs.dropZoneRef}
            onDragLeave={handleHideDropzone}
            onDrop={({ acceptedFiles }) => {
              dropAction(acceptedFiles);
            }}
            onCancel={handleHideDropzone}
          /> */}
          </MainBody>
        </WIPDetailWrapper>
      </Wrapper>
      <div className="mt-3 post-btm">&nbsp;</div>
    </>
  );
};

export default WIPDetail;
