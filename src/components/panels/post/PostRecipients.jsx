import React from "react";
import styled from "styled-components";
import { renderToString } from "react-dom/server";
import { useWindowSize } from "../../hooks";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  .client-shared {
    background: ${(props) => props.theme.colors.fourth};
    color: #212529;
    margin-right: 5px;
    .feather {
      margin-right: 5px;
    }
  }
  .client-not-shared {
    background: #d6edff;
    color: #212529;
    margin-right: 5px;
    .feather {
      margin-right: 5px;
    }
  }
  .receiver {
    display: inline-block;
    align-items: center;
  }
  .feather-eye {
    vertical-align: text-top;
  }
  .ellipsis-hover {
    position: relative;

    &:hover {
      .recipient-names {
        opacity: 1;
        max-height: 300px;
      }
    }
  }
  .recipient-names {
    transition: all 0.5s ease;
    position: absolute;
    top: 20px;
    left: -2px;
    width: 200px;
    border-radius: 8px;
    overflow-y: auto;
    border: 1px solid #fff;
    box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
    background: #fff;
    max-height: 0;
    opacity: 0;
    z-index: 1;

    &:hover {
      max-height: 300px;
      opacity: 1;
    }
`;

const LockIcon = styled(SvgIconFeather)`
  width: 12px;
  margin: 0;
`;

const PostRecipients = (props) => {
  const { classNames = "", dictionary, post, user, isExternalUser } = props;
  const hasExternalWorkspace = post.recipients.some((r) => r.type === "TOPIC" && r.is_shared);
  const winSize = useWindowSize();
  const renderUserResponsibleNames = () => {
    const hasMe = post.recipients.some((r) => r.type_id === user.id);
    const recipientSize = winSize.width > 576 ? (hasMe ? 4 : 5) : hasMe ? 0 : 1;
    let recipient_names = "";
    const otherPostRecipients = post.recipients.filter((r) => !(r.type === "USER" && r.type_id === user.id));

    if (post.shared_with_client && hasExternalWorkspace && !isExternalUser) {
      recipient_names += `<span class="receiver client-shared" style="color:#29323F;">${renderToString(<LockIcon icon="eye" />)} ${dictionary.sharedClientBadge}</span>`;
    } else if (!post.shared_with_client && hasExternalWorkspace && !isExternalUser) {
      recipient_names += `<span class="receiver client-not-shared">${renderToString(<LockIcon icon="eye-off" />)} ${dictionary.notSharedClientBadge}</span>`;
    }

    if (otherPostRecipients.length) {
      recipient_names += otherPostRecipients
        .filter((r, i) => i < recipientSize)
        .map((r) => {
          if (["DEPARTMENT", "TOPIC"].includes(r.type))
            return `<span class="receiver">${r.name} ${r.type === "TOPIC" && r.private === 1 ? renderToString(<LockIcon icon="lock" />) : ""} ${r.type === "TOPIC" && r.is_shared ? renderToString(<LockIcon icon="eye" />) : ""}</span>`;
          else return `<span class="receiver">${r.type && r.type === "TEAM" ? `${dictionary.teamLabel} ${r.name}` : r.name}</span>`;
        })
        .join(", ");
    }

    if (hasMe) {
      if (otherPostRecipients.length >= 1) {
        recipient_names += `<span class="receiver">${dictionary.me}</span>`;
      } else {
        recipient_names += `<span class="receiver">${dictionary.me}</span>`;
      }
    }

    let otherRecipientNames = "";
    if (otherPostRecipients.length + (hasMe ? 1 : 0) > recipientSize) {
      otherRecipientNames += otherPostRecipients
        .filter((r, i) => i >= recipientSize)
        .map((r) => {
          if (["DEPARTMENT", "TOPIC"].includes(r.type))
            return `<span class="receiver">${r.name} ${r.type === "TOPIC" && r.private === 1 ? renderToString(<LockIcon icon="lock" />) : ""} ${r.type === "TOPIC" && r.is_shared ? renderToString(<LockIcon icon="eye" />) : ""}</span>`;
          else return `<span class="receiver">${r.type && r.type === "TEAM" ? `${dictionary.teamLabel} ${r.name}` : r.name}</span>`;
        })
        .join("");

      otherRecipientNames = `<span class="ellipsis-hover">... <span class="recipient-names">${otherRecipientNames}</span></span>`;
    }

    return `${recipient_names} ${otherRecipientNames}`;
  };
  return (
    <Wrapper className={`post-recipients ${classNames} ${hasExternalWorkspace && !isExternalUser && "has-external"}`}>
      <span className="recipients" dangerouslySetInnerHTML={{ __html: renderUserResponsibleNames() }} />
    </Wrapper>
  );
};

export default PostRecipients;
