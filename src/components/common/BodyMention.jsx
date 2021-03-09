import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useTranslation } from "../hooks";

const BodyMentionDiv = styled.div`
  margin: 10px;
  border-radius: 8px;
  background: #f0f0f0;
  padding: 10px;
  display: block;
  .dark & {
    background: #191c20;
  }
  .mention-name {
    color: #7a1b8b;
  }
  button {
    margin-right: 10px;
  }
`;
const BodyMention = (props) => {
  const { onAddUsers, onDoNothing, userIds, type = "post" } = props;

  const { _t } = useTranslation();
  const users = useSelector((state) => state.users.mentions);
  //const workspaces = useSelector((state) => state.workspaces.workspaces);
  const recipients = useSelector((state) => state.global.recipients);
  //const toMention = Object.assign({}, users, workspaces);
  const toMention = [...recipients].map((r) => {
    if (r.type === "USER") {
      return {
        ...r,
        type: users[r.type_id] ? users[r.type_id].type : "internal",
      };
    } else return r;
  });
  const mentionedUsers = Object.values(toMention).filter((user) => {
    return userIds.some((id) => id === user.id);
  });
  //console.log(toMention, userIds);
  // const userRecipients = useSelector((state) => state.global.recipients.filter((r) => r.type === "USER"));
  // const mentionedUsers = userRecipients.filter((user) => {
  //   let userFound = false;
  //   userIds.forEach((id) => {
  //     if (basedOnId && id === user.id) {
  //       userFound = true;
  //     } else if (!basedOnId && id === user.type_id) {
  //       userFound = true;
  //     }
  //   });
  //   return userFound;
  // });
  const handleAddToPost = () => {
    onAddUsers(mentionedUsers);
  };
  const handleDoNothing = () => {
    onDoNothing(mentionedUsers);
  };

  const dictionary = {
    addToChat: _t("MENTION.ADD_TO_CHAT", "Add to chat"),
    addToPost: _t("MENTION.ADD_TO_POST", "Add to post"),
    addToWorkspace: _t("MENTION.ADD_TO_WORKSPACE", "Add to workspace"),
    notChatMembers: _t("MENTION.NOT_CHAT_MEMBERS", "but they are not members of this chat"),
    notWorkspaceMembers: _t("MENTION.NOT_WORKSPACE_MEMBERS", "but they are not members of this workspace"),
    notPostRecipients: _t("MENTION.NOT_POST_RECIPIENTS", "but they are not recipients of this post"),
    doNothing: _t("MENTION.DO_NOTHING", "Do nothing"),
    youMentioned: _t("MENTION.YOU_MENTIONED", "You mentioned"),
    and: _t("GENERAL.AND", "and"),
  };

  let pText = dictionary.notPostRecipients;
  let addText = dictionary.addToPost;
  if (type === "chat") {
    pText = dictionary.notChatMembers;
    addText = dictionary.addToChat;
  } else if (type === "workspace") {
    pText = dictionary.notWorkspaceMembers;
    addText = dictionary.addToWorkspace;
  }
  return (
    <BodyMentionDiv>
      <div>
        <p>
          {dictionary.youMentioned}&nbsp;
          {mentionedUsers.map((mu, i) => {
            const denotation = mu.type === "WORKSPACE" || mu.type === "TOPIC" ? "/" : "@";
            if (i === mentionedUsers.length - 1 && mentionedUsers.length > 1) {
              return (
                <div className={"mention-data"}>
                  <span key={i} className="mention-normal">
                    {" "}
                    {dictionary.and}
                    <span className="mention" data-denotation-char="@" data-id={mu.type_id} data-value={mu.name}>
                      <span
                        className="mention-name pointer"
                        data-mid={mu.type_id}
                        onClick={(e) => {
                          e.stopPropagation();
                          //push(`/profile/${mu.type_id}`)
                        }}
                      >
                        <span className="ql-mention-denotation-char">{denotation}</span>
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
                    <span className="ql-mention-denotation-char">{denotation}</span>
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
          {dictionary.doNothing}
        </button>
      </div>
    </BodyMentionDiv>
  );
};

export default BodyMention;
