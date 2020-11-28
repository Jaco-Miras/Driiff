import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {TeamListItem} from "../../list/people/item";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
  .feather-edit {
    cursor: pointer;
  }

  .card-title {
    position: relative;
    .feather-plus {
      right: 0;
      width: 16px;
      position: absolute;
      cursor: pointer;
      &:hover {
        color: #7a1b8b;
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

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DashboardTeam = (props) => {
  const {className = "", workspace, onEditClick, isExternal, isMember, dictionary, actions} = props;
  const [scrollRef, setScrollRef] = useState(null);

  const [showMore, setShowMore] = useState(false);

  const assignRef = useCallback((e) => {
    if (scrollRef === null) {
      setScrollRef(e);
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hideOptions = (isMember && isExternal) || workspace.active === 0;
  const members = workspace.members.filter((m) => m.active === 1 || !m.has_accepted);

  const handleToggleShow = () => {
    setShowMore(prevState => !prevState)
  };

  const slicedUsers = () => {
    if (showMore) {
      return members
    } else {
      return members.slice(0,5)
    }
  }

  return (
    <Wrapper className={`dashboard-team card ${className}`}>
      <div ref={assignRef} className="card-body">
        <h5 className="card-title">
          {dictionary.team} {isMember === true && !isExternal && workspace.active === 1 &&
        <SvgIconFeather onClick={onEditClick} icon="plus"/>}
        </h5>

        {members.length === 0 ?
          <>{dictionary.emptyTeam}</>
          :
          <ul className="list-group list-group-flush">
            {slicedUsers().map((member,i) => {
              return <TeamListItem key={member.id} member={member} parentRef={scrollRef} onEditClick={onEditClick}
                                   hideOptions={hideOptions} actions={actions} workspace_id={workspace.id}
                                   dictionary={dictionary} showMoreButton={i === 4 && members.length > 5 && !showMore}
                                   showLessButton={i === members.length - 1 && members.length > 5 && showMore}
                                   showMore={showMore} toggleShow={handleToggleShow}/>;
            })}
          </ul>}
      </div>
    </Wrapper>
  );
};

export default React.memo(DashboardTeam);
