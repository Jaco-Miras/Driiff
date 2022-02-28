import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import Viewers from "../../list/post/item/Viewers";

const Wrapper = styled.div`
  .workspace-title {
    cursor: pointer;
  }
  .labels span {
    display: flex;
    align-items: center;
  }
  .mobile-icon {
    display: none;
  }
  @media (max-width: 414px) {
    .badge {
      display: none;
    }
    .mobile-icon {
      display: block;
    }
  }
  .user-reads-container {
    position: relative;
    display: inline-flex;
    margin-right: 0.5rem;

    .not-read-users-container,
    .read-users-container {
      transition: all 0.5s ease;
      z-index: 2;
      position: absolute;
      right: 0;
      top: 30px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background-color: #fff;
      overflow: auto;
      opacity: 0;
      max-height: 0;
      max-width: 200px;
      text-align: left;

      &:hover {
        opacity: 1;
        max-height: 175px;
        max-width: 200px;
        text-align: left;
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
      max-width: 200px;
      text-align: left;
    }
  }
  .avatar {
    min-width: 2.7rem;
    min-height: 2.7rem;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-right: 3px;
`;

const AllWorkspaceListDetail = (props) => {
  const { dictionary, item } = props;
  return (
    <Wrapper className="workspace-details">
      <div className="title-labels">
        <span className="workspace-title">{item.name}</span>
        {item.private === 1 && <Icon icon="lock" />}
        {item.workspace && (
          <span className="ml-1 d-flex align-items-center">
            <Icon icon="folder" />
            {item.workspace.name}
          </span>
        )}
        <span className="ml-1 d-flex align-items-center user-reads-container">
          <span className="no-readers">
            <Icon icon="user" />
            {Object.values(item.members).length}
          </span>
          <Viewers users={item.members} />
        </span>

        {item.is_shared && (
          <>
            <span className={"badge badge-external ml-1 align-items-center"}>
              <Icon icon="eye" /> {dictionary.withClient}
            </span>
            <Icon icon="eye" className="mobile-icon" />
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default AllWorkspaceListDetail;
