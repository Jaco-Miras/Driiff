import React, {useCallback, useState} from "react";
import styled from "styled-components";
import {TeamListItem} from "../../list/people/item";
//import {useUsers} from "../../hooks";
import { useSelector } from "react-redux";

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

const CompanyDashboardTeam = (props) => {
  const {className = "", onEditClick, dictionary, actions} = props;
  const [scrollRef, setScrollRef] = useState(null);
  const users = useSelector((state) => state.users.users);

  const [showMore, setShowMore] = useState(false);

  const assignRef = useCallback((e) => {
    if (scrollRef === null) {
      setScrollRef(e);
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleShow = () => {
    setShowMore(prevState => !prevState)
  };
  
  const filteredUsers = Object.values(users).filter((m) => m.active === 1
                          && m.type === "internal"
                          && !["gripp_project_bot",
                            "gripp_account_activation",
                            "gripp_offerte_bot",
                            "gripp_invoice_bot",
                            "gripp_police_bot"].includes(m.email))
                          .sort((a, b) => a.name.localeCompare(b.name))

  const slicedUsers = () => {
    if (showMore) {
      return filteredUsers
    } else {
      return filteredUsers.slice(0,5)
    }
  }

  return (
    <Wrapper className={`dashboard-team card ${className}`}>
      <div ref={assignRef} className="card-body">
        <h5 className="card-title">
          {dictionary.team}
        </h5>
        <ul className="list-group list-group-flush">
          {slicedUsers()
            .map((member, i) => {
              return <TeamListItem
                key={member.id}
                member={member}
                hideOptions={true}
                parentRef={scrollRef}
                onEditClick={onEditClick}
                actions={actions}
                dictionary={dictionary}
                showMoreButton={i === 4 && filteredUsers.length > 5 && !showMore}
                showLessButton={i === filteredUsers.length - 1 && filteredUsers.length > 5 && showMore}
                showMore={showMore}
                toggleShow={handleToggleShow}
                />;
            })}
        </ul>
      </div>
    </Wrapper>
  );
};

export default CompanyDashboardTeam;
