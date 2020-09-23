import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const BodyMentionDiv = styled.div`
  margin: 10px;
  border-radius: 8px;
  background: #f0f0f0;
  padding: 10px;
  display: block;
  .mention-name {
    color: #7a1b8b;
  }
  button {
    margin-right: 10px;
  }
`;
const BodyMention = (props) => {
  const { onAddUsers, onDoNothing, userIds, type = "post", basedOnId = true } = props;
  const userRecipients = useSelector((state) => state.global.recipients.filter((r) => r.type === "USER"));
  const mentionedUsers = userRecipients.filter((user) => {
    let userFound = false;
    userIds.forEach((id) => {
      if (basedOnId && id === user.id) {
        userFound = true;
      } else if (!basedOnId && id === user.type_id) {
        userFound = true;
      }
    });
    return userFound;
  });
  const handleAddToPost = () => {
    onAddUsers(mentionedUsers);
  };
  const handleDoNothing = () => {
    onDoNothing(mentionedUsers);
  };
  let pText = "but they are not recipients of this post";
  let addText = "Add to post";
  if (type === "task") {
    pText = "but they are not asignees of this task";
    addText = "Add to task";
  } else if (type === "chat") {
    pText = "but they are not members of this chat channel";
    addText = "Add to chat channel";
  }
  return (
    <BodyMentionDiv>
      <div>
        <p>
          You mentioned&nbsp;
          {mentionedUsers.map((mu, i) => {
            if (i === mentionedUsers.length - 1 && mentionedUsers.length > 1) {
              return (
                <div className={"mention-data"}>
                  <span key={i} className="mention-normal">
                    {" "}
                    and
                    <span className="mention" data-denotation-char="@" data-id={mu.type_id} data-value={mu.name}>
                      <span
                        className="mention-name pointer"
                        data-mid={mu.type_id}
                        onClick={(e) => {
                          e.stopPropagation();
                          //push(`/profile/${mu.type_id}`)
                        }}
                      >
                        <span className="ql-mention-denotation-char">@</span>
                        {mu.name}
                      </span>
                    </span>
                  </span>
                </div>
              );
            } else {
              return (
                <span key={i} className="mention" data-denotation-char="@" data-id={mu.type_id} data-value={mu.name}>
                  <span
                    className="mention-name pointer"
                    data-mid={mu.type_id}
                    onClick={(e) => {
                      e.stopPropagation();
                      // /push(`/profile/${mu.type_id}`)
                    }}
                  >
                    <span className="ql-mention-denotation-char">@</span>
                    {mu.name},
                  </span>
                </span>
              );
            }
          })}
          &nbsp;{pText}
        </p>
      </div>
      <div>
        <button className="btn btn-primary" onClick={handleAddToPost}>
          {addText}
        </button>
        <button className="btn btn-outline-primary" onClick={handleDoNothing}>
          Do nothing
        </button>
      </div>
    </BodyMentionDiv>
  );
};

export default BodyMention;
