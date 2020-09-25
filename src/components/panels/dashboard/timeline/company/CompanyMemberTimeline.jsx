import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Avatar} from "../../../../common";
import {useTimeFormat} from "../../../../hooks";

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

const CompanyMemberTimeline = (props) => {
  const {className = "", data} = props;
  const {fromNow} = useTimeFormat();

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
        return `Updated workspace to ${message.title}`;
      }
      if (message.added_members.length !== 0 || message.removed_members.length) {
      }
    } else {
      if (data.body.includes("NEW_ACCOUNT_ACTIVATED")) {
        return `${data.body.replace(`NEW_ACCOUNT_ACTIVATED `, "")} is added to the company`;
      } else if (data.body.includes("POST_CREATE")) {
        let item = JSON.parse(data.body.replace("POST_CREATE::", ""));
        return <>{item.author.name} <b>created the post {item.post.title}</b></>
      } else {
        console.log(data);
        return data.body;
      }
    }
  };

  const renderAddedMembers = (joined = false) => {
    if (joined) {
      if (message.accepted_members && message.accepted_members.length) {
        let author = users[message.accepted_members[0]];
        return `${author.name} has joined`;
      } else {
        let author = recipients.filter((r) => r.type_id === message.author.id && message.added_members.includes(r.type_id))[0];
        if (author) {
          if (author.type_id === user.id) {
            return "You joined.";
          } else {
            return `${author.name} has joined`;
          }
        }
      }
    } else {
      if (message.accepted_members && message.accepted_members.length) {

      } else {
        let members = recipients.filter((r) => message.added_members.includes(r.type_id) && r.type_id !== message.author.id).map((r) => r.name);
        if (members.length) {
          return members.join(", ") + " is added.";
        }
      }
    }
  };

  const renderRemovedMembers = (left = false) => {
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

  if (data.body.includes("POST_CREATE"))
    return <></>

  return (
    <Wrapper className={`member-timeline timeline-item ${className}`}>
      <div>
        {
          message !== null ?
            <>
              {
                message.author ?
                  <Avatar
                    className="mr-3"
                    name={message.author.name} imageLink={message.author.profile_image_link}
                    id={message.author.id}/>
                  : <Avatar className="mr-3" imageLink={null} isBot={true}/>
              }
            </>
            :
            <Avatar className="mr-3" imageLink={null} isBot={true}/>
        }
      </div>
      {
        message !== null ?
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
          :
          <div>
            <h6 className="d-flex justify-content-between mb-4">
              <span className="title">{renderTitle()}</span>
              <span className="text-muted font-weight-normal">{fromNow(data.created_at.timestamp)}</span>
            </h6>
          </div>
      }
    </Wrapper>
  );
};

export default React.memo(CompanyMemberTimeline);
