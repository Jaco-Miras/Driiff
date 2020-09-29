import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Avatar} from "../../../common";
import {useTimeFormat} from "../../../hooks";
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
  const {className = "", data} = props;
  const {fromNow, localizeDate} = useTimeFormat();

  const user = useSelector((state) => state.session.user);
  const recipients = useSelector((state) => state.global.recipients.filter((r) => r.type === "USER"));

  let message = null;
  if (data.body.includes("CHANNEL_UPDATE")) {
    message = JSON.parse(data.body.replace("CHANNEL_UPDATE::", ""));
  }

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const renderTitle = () => {
    if (message.title !== "") {
      return `Updated workspace to ${message.title}`;
    }
    if (message.added_members.length !== 0 || message.removed_members.length) {
    }
  };

  const renderAddedMembers = (joined = false) => {
    if (message.author === null)
      return "";

    if (joined) {
      let author = recipients.filter((r) => r.type_id === message.author.id && message.added_members.includes(r.type_id))[0];
      if (author) {
        if (author.type_id === user.id) {
          return "You joined.";
        } else {
          return `${author.name} has joined`;
        }
      }
    } else {
      let members = recipients.filter((r) => message.added_members.includes(r.type_id) && r.type_id !== message.author.id).map((r) => r.name);
      if (members.length) {
        return members.join(", ") + " is added.";
      }
    }
  };

  const renderRemovedMembers = (left = false) => {
    if (message.author === null)
      return "";

    if (left) {
      let author = recipients.filter((r) => r.type_id === message.author.id && message.removed_members.includes(r.type_id))[0];
      if (author) {
        if (author.type_id === user.id) {
          return "You left.";
        } else {
          return `${author.name} has left`;
        }
      }
    } else {
      let members = recipients.filter((r) => message.removed_members.includes(r.type_id) && r.type_id !== message.author.id).map((r) => r.name);
      if (members.length) {
        return members.join(", ") + " is removed.";
      }
    }
  };

  if (message === null) return null;

  return (
    <Wrapper className={`member-timeline timeline-item ${className}`}>
      <div>{message !== null ? (
        <>{message.author ?
          <Avatar className="mr-3" name={message.author.name} imageLink={message.author.profile_image_link}
                  id={message.author.id}/> : <Avatar className="mr-3" imageLink={null} isBot={true}/>}</>
      ) : (
        <Avatar className="mr-3" imageLink={null} isBot={true}/>
      )}</div>
      <div>
        {message !== null ? (
          <>
            <h6 className="d-flex justify-content-between mb-4">
          <span className="title">
            {message.author && message.author.name} {renderTitle()}
          </span>
              <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
            </h6>
            {message.added_members.length || message.removed_members.length ? (
              <div className="mb-3 border p-3 border-radius-1">
                <p className="action-text">{message.added_members.length > 0 && renderAddedMembers(true)}</p>
                <p className="action-text">{message.added_members.length > 0 && renderAddedMembers()}</p>
                <p className="action-text">{message.removed_members.length > 0 && renderRemovedMembers(true)}</p>
                <p className="action-text">{message.removed_members.length > 0 && renderRemovedMembers()}</p>
              </div>
            ) : null}
          </>
        ) : (
          <div>
            <h6 className="d-flex justify-content-between mb-4">
              <span className="title">{renderTitle()}</span>
              <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip}
                             content={`${localizeDate(data.created_at.timestamp)}`}>
                <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
              </StyledTooltip>
            </h6>
          </div>)}
      </div>
    </Wrapper>
  );
};

export default React.memo(MemberTimeline);
