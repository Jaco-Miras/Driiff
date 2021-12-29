import React, { useState, useRef } from "react";
import styled from "styled-components";
import { TeamListItem } from "../../list/people/item";
import { SvgIconFeather } from "../../common";
import { useSelector } from "react-redux";
import { useToaster } from "../../hooks";

const Wrapper = styled.div`
  .feather-edit {
    cursor: pointer;
  }
  .feather-plus {
    color: #8b8b8b;
  }
  overflow: unset;

  .card-title {
    position: relative;
    .feather-plus {
      right: 0;
      width: 16px;
      position: absolute;
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme.colors.primary};
      }
    }
  }

  .team-list-item {
    position: relative;

    .more-options-tooltip {
      &.orientation-top {
        bottom: 10px;
      }
      &.orientation-right {
        left: 100%;
      }
    }

    .more-options {
      visibility: visible;
      display: flex;
    }
  }

  .file-attachments {
    .files {
      width: 100%;
    }
  }
`;

// const EmptyState = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

const DashboardTeam = (props) => {
  const { className = "", workspace, onEditClick, isExternal, isMember, dictionary, actions } = props;
  const mainRef = useRef(null);
  //const [scrollRef, setScrollRef] = useState(null);

  const [showMore, setShowMore] = useState(false);

  const toaster = useToaster();

  const loggedUser = useSelector((state) => state.session.user);

  // const assignRef = (e) => {
  //   if (scrollRef === null) {
  //     setScrollRef(e);
  //   }
  // };

  const hideOptions = !isMember || workspace.active === 0;
  // const members = workspace.members.filter((m) => m.active === 1 || !m.has_accepted);
  const members = workspace.members;

  const handleToggleShow = () => {
    setShowMore((prevState) => !prevState);
  };

  const slicedUsers = () => {
    if (showMore) {
      return members;
    } else {
      return members.slice(0, 5);
    }
  };

  const onLeaveWorkspace = (workspace, member) => {
    let callback = (err, res) => {
      if (err) return;
      toaster.success(
        <>
          {dictionary.leaveWorkspace}
          <b>{workspace.name}</b>
        </>
      );
    };
    actions.leave(workspace, member, callback);
  };

  const onAddRole = (member, role) => {
    let payload = {
      topic_id: workspace.id,
      user_id: member.id,
      role,
    };
    actions.addRole(payload);
  };

  return (
    <Wrapper className={`dashboard-team card ${className}`} ref={mainRef}>
      <div className="card-body">
        <h5 className="card-title">
          {dictionary.team} {isMember === true && !isExternal && workspace.active === 1 && <SvgIconFeather onClick={onEditClick} icon="plus" />}
        </h5>

        {members.length === 0 ? (
          <>{dictionary.emptyTeam}</>
        ) : (
          <ul className="list-group list-group-flush">
            {slicedUsers().map((member, i) => {
              return (
                <TeamListItem
                  key={member.id}
                  member={member}
                  //parentRef={scrollRef}
                  //onEditClick={onEditClick}
                  onLeaveWorkspace={onLeaveWorkspace}
                  onAddRole={onAddRole}
                  hideOptions={hideOptions}
                  actions={actions}
                  workspace_id={workspace.id}
                  dictionary={dictionary}
                  showMoreButton={i === 4 && members.length > 5 && !showMore}
                  showLessButton={i === members.length - 1 && members.length > 5 && showMore}
                  toggleShow={handleToggleShow}
                  loggedUser={loggedUser}
                  workspace={workspace}
                  //scrollRef={mainRef.current}
                />
              );
            })}
          </ul>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(DashboardTeam);
