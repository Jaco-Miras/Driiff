import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useTranslationActions } from "../hooks";

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
const PostInputMention = (props) => {
  const { onAddToPost, userMentionOnly = false, quillMentions = [], postRecipients = [], workspaceMembers = [] } = props;

  const { _t } = useTranslationActions();
  const user = useSelector((state) => state.session.user);
  const isExternalUser = user.type === "external";
  const users = useSelector((state) => state.users.users);
  const recipients = useSelector((state) => state.global.recipients);

  const [ignoredMentions, setIgnoredMentions] = useState([]);
  const toMention = [...recipients]
    .filter((r) => {
      if (userMentionOnly) return r.type === "USER";
      else return true;
    })
    .map((r) => {
      if (r.type === "USER") {
        return {
          ...r,
          type: users[r.type_id] ? users[r.type_id].type : "internal",
        };
      } else return r;
    });

  const topicRecipientIds = postRecipients.filter((r) => r.type === "TOPIC").map((r) => r.id);

  let userRecipientIds = postRecipients
    .map((r) => {
      if (r.type === "USER") {
        return r.type_id;
      } else {
        return r.participant_ids;
      }
    })
    .flat();

  const workspaceMentionIds = quillMentions
    .filter((m) => m.type === "TOPIC" && !topicRecipientIds.some((rid) => rid === parseInt(m.id)))
    .map((m) => parseInt(m.id))
    .filter((id) => !isNaN(id));

  const userMentionIds = quillMentions
    .filter((m) => m.type !== "TOPIC" && !userRecipientIds.some((uid) => uid === parseInt(m.type_id)))
    .map((m) => parseInt(m.type_id))
    .filter((id) => !isNaN(id));

  const mentions = Object.values(toMention).filter((r) => {
    if (ignoredMentions.length && ignoredMentions.some((m) => parseInt(m.id) === parseInt(r.id) && r.type === m.type)) {
      return false;
    }

    if ((r.type === "internal" || r.type === "external") && workspaceMembers.some((id) => r.type_id === id)) return false;
    if ((r.type === "TOPIC" && workspaceMentionIds.some((id) => r.id === id)) || ((r.type === "internal" || r.type === "external") && userMentionIds.some((id) => r.type_id === id))) {
      return true;
    } else {
      return false;
    }
  });
  const handleAddToPost = () => {
    onAddToPost(mentions);
    setIgnoredMentions([...mentions, ...ignoredMentions]);
  };
  const handleDoNothing = () => {
    //onDoNothing(mentions);
    setIgnoredMentions([...mentions, ...ignoredMentions]);
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

  if (isExternalUser || mentions.length === 0) return null;
  return (
    <BodyMentionDiv>
      <div>
        <p>
          {dictionary.youMentioned}&nbsp;
          {mentions.map((mu, i) => {
            const denotation = mu.type === "WORKSPACE" || mu.type === "TOPIC" ? "/" : "@";
            if (i === mentions.length - 1 && mentions.length > 1) {
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

export default PostInputMention;
