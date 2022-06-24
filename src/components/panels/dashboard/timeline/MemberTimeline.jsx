import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar } from "../../../common";
import { useTimeFormat } from "../../../hooks";
import Tooltip from "react-tooltip-lite";

const Wrapper = styled.div`
    font-weight: bold;
    .action-text {
        margin: 0;
        color: #505050;
        .joined {
            color: #00c851
            font-weight: bold;
        }
        .left {
            color: #f44;
            font-weight: bold;
        }
    }
`;

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MemberTimeline = (props) => {
  const { className = "", data, dictionary, scrollRef } = props;
  const { fromNow, localizeDate } = useTimeFormat();

  // const user = useSelector((state) => state.session.user);
  // const recipients = useSelector((state) => state.global.recipients.filter((r) => r.type === "USER"));
  const users = useSelector((state) => state.users.users);
  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  const teams = useSelector((state) => state.users.teams);

  const allUsers = [...Object.values(users), ...inactiveUsers];

  let message = null;
  let author = null;
  if (data.body.includes("CHANNEL_UPDATE")) {
    message = JSON.parse(data.body.replace("CHANNEL_UPDATE::", ""));
  }

  if (message && message.author) {
    if (message.author.name) {
      author = message.author;
    } else {
      author = allUsers.find((u) => u.id === message.author);
    }
  }

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const renderTitle = () => {
    if (message.title !== "") {
      return `${dictionary.updatedWorkspaceTo} ${message.title}`;
    }
    // if (message.added_members.length !== 0 || message.removed_members.length) {
    // }
  };

  const renderAddedMembers = () => {
    if (message.author === null) {
      if (message.accepted_members) {
        let members = allUsers.filter((u) => message.accepted_members.some((id) => id === u.id));
        if (members.length) {
          return members.map((m) => m.name).join(", ") + ` ${dictionary.isAdded}.`;
        }
      } else {
        return "";
      }
    } else {
      if (message.accepted_members) {
        let members = allUsers.filter((u) => message.accepted_members.some((id) => id === u.id));
        if (members.length) {
          return members.map((m) => m.name).join(", ") + ` ${dictionary.isAdded}.`;
        }
      } else {
        let members = allUsers.filter((u) => message.added_members.some((id) => id === u.id));
        if (members.length) {
          return members.map((m) => m.name).join(", ") + ` ${dictionary.isAdded}.`;
        }
      }
    }
  };

  const renderAddedTeams = () => {
    if (message.author === null) {
      if (message.added_teams) {
        let members = Object.values(teams).filter((t) => message.added_teams.some((id) => id === t.id));
        if (members.length) {
          return members.map((m) => m.name).join(", ") + ` ${dictionary.isAdded}.`;
        }
      } else {
        return "";
      }
    } else {
      if (message.added_teams) {
        let members = Object.values(teams).filter((t) => message.added_teams.some((id) => id === t.id));
        if (members.length) {
          return members.map((m) => m.name).join(", ") + ` ${dictionary.isAdded}.`;
        }
      }
    }
  };

  const renderRemovedTeams = () => {
    if (message.author === null) {
      return "";
    } else {
      if (message.removed_teams) {
        let members = Object.values(teams).filter((t) => message.removed_teams.some((id) => id === t.id));
        if (members.length) {
          return members.map((m) => m.name).join(", ") + ` ${dictionary.isRemoved}.`;
        }
      }
    }
  };

  const renderRemovedMembers = () => {
    if (message.author === null) {
      return "";
    } else {
      let members = allUsers.filter((u) => message.removed_members.some((id) => id === u.id));
      if (members.length) {
        return members.map((m) => m.name).join(", ") + ` ${dictionary.isRemoved}.`;
      }
    }
  };

  if (message === null) return null;

  return (
    <Wrapper className={`member-timeline timeline-item ${className}`}>
      <div>
        {message !== null ? (
          <>{author ? <Avatar className="mr-3" name={author.name} imageLink={author.profile_image_link} id={author.id} showSlider={true} scrollRef={scrollRef} /> : <Avatar className="mr-3" imageLink={null} isBot={true} />}</>
        ) : (
          <Avatar className="mr-3" imageLink={null} isBot={true} />
        )}
      </div>
      <div>
        {message !== null ? (
          <>
            <h6 className="d-flex justify-content-between mb-4">
              <span className="title">
                {author && author.name} {renderTitle()}
              </span>
              <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
            </h6>
            {message.added_members.length || message.removed_members.length || (message.added_teams && message.added_teams.length) || (message.removed_teams && message.removed_teams.length) ? (
              <div className="mb-3 border p-3 border-radius-1">
                {/* <p className="action-text">{message.added_members.length > 0 && renderAddedMembers(true)}</p> */}
                <p className="action-text">{message.added_members.length > 0 && renderAddedMembers()}</p>
                {/* <p className="action-text">{message.removed_members.length > 0 && renderRemovedMembers(true)}</p> */}
                <p className="action-text">{message.removed_members.length > 0 && renderRemovedMembers()}</p>
                <p className="action-text">{message.added_teams && message.added_teams.length > 0 && renderAddedTeams()}</p>
                <p className="action-text">{message.removed_teams && message.removed_teams.length > 0 && renderRemovedTeams()}</p>
              </div>
            ) : null}
          </>
        ) : (
          <div>
            <h6 className="d-flex justify-content-between mb-4">
              <span className="title">{renderTitle()}</span>
              <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={`${localizeDate(data.created_at.timestamp)}`}>
                <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
              </StyledTooltip>
            </h6>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(MemberTimeline);
