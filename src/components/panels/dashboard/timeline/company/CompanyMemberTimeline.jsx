import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar } from "../../../../common";
import { useTimeFormat } from "../../../../hooks";
import Tooltip from "react-tooltip-lite";

const Wrapper = styled.div`
  font-weight: bold;
  .action-text {
    margin: 0;
    color: #505050;
    .joined {
      color: #00c851;
      font-weight: bold;
    }
    .left {
      color: #f44;
      font-weight: bold;
    }
  }
`;

const toggleTooltip = () => {
  let tooltips = document.querySelectorAll("span.react-tooltip-lite");
  tooltips.forEach((tooltip) => {
    tooltip.parentElement.classList.toggle("tooltip-active");
  });
};

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CompanyMemberTimeline = (props) => {
  const { className = "", data, dictionary, scrollRef } = props;
  const { fromNow, localizeDate } = useTimeFormat();

  const user = useSelector((state) => state.session.user);
  const recipients = useSelector((state) => state.global.recipients.filter((r) => r.type === "USER"));
  const users = useSelector((state) => state.users.users);

  let message = null;
  if (data.body.includes("CHANNEL_UPDATE")) {
    message = JSON.parse(data.body.replace("CHANNEL_UPDATE::", ""));
  }

  const renderTitle = () => {
    if (message) {
      if (message.title && message.title !== "") {
        return `${dictionary.updatedWorkspaceTo} ${message.title}`;
      }
      // if (message.added_members.length !== 0 || message.removed_members.length) {
      // }
    } else {
      if (data.body.includes("NEW_ACCOUNT_ACTIVATED")) {
        return `${data.body.replace("NEW_ACCOUNT_ACTIVATED ", "")} ${dictionary.isAddedToCompany}`;
      } else if (data.body.includes("POST_CREATE")) {
        let parsedData = data.body.replace("POST_CREATE::", "");
        if (parsedData.trim() !== "") {
          let item = JSON.parse(data.body.replace("POST_CREATE::", ""));
          return (
            <>
              {item.author.name}{" "}
              <b>
                {dictionary.createdThePost} {item.post.title}
              </b>
            </>
          );
        }
      } else {
        return data.body;
      }
    }
  };

  const renderAddedMembers = (joined = false) => {
    if (message.author === null) return "";

    if (joined) {
      if (message.accepted_members && message.accepted_members.length) {
        let author = users[message.accepted_members[0]];
        return `${author.name} ${dictionary.hasJoined}`;
      } else {
        let author = recipients.filter((r) => r.type_id === message.author.id && message.added_members.includes(r.type_id))[0];
        if (author) {
          if (author.type_id === user.id) {
            return `${dictionary.youJoined}.`;
          } else {
            return `${author.name} ${dictionary.hasJoined}`;
          }
        }
      }
    } else {
      if (message.accepted_members && message.accepted_members.length) {
      } else {
        let members = recipients.filter((r) => message.added_members.includes(r.type_id) && r.type_id !== message.author.id).map((r) => r.name);
        if (members.length) {
          return members.join(", ") + ` ${dictionary.isAdded}.`;
        }
      }
    }
  };

  const renderRemovedMembers = (left = false) => {
    if (message.author === null) return "";

    if (left) {
      let author = recipients.filter((r) => r.type_id === message.author.id && message.removed_members.includes(r.type_id))[0];
      if (author) {
        if (author.type_id === user.id) {
          return `${dictionary.youLeft}.`;
        } else {
          return `${author.name} ${dictionary.hasLeft}`;
        }
      }
    } else {
      let members = recipients.filter((r) => message.removed_members.includes(r.type_id) && r.type_id !== message.author.id).map((r) => r.name);
      if (members.length) {
        return members.join(", ") + ` ${dictionary.isRemoved}.`;
      }
    }
  };

  if (data.body.includes("POST_CREATE")) return <></>;

  return (
    <Wrapper className={`member-timeline timeline-item ${className}`}>
      <div>
        {message !== null ? (
          <>
            {message.author ? (
              <Avatar className="mr-3" name={message.author.name} imageLink={message.author.profile_image_link} id={message.author.id} showSlider={true} scrollRef={scrollRef} />
            ) : (
              <Avatar className="mr-3" imageLink={null} isBot={true} />
            )}
          </>
        ) : (
          <Avatar className="mr-3" imageLink={null} isBot={true} />
        )}
      </div>
      {message !== null ? (
        <div>
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
        </div>
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
    </Wrapper>
  );
};

export default React.memo(CompanyMemberTimeline);
