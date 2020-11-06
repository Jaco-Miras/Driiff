import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../../common";
import { useGoogleApis, useTimeFormat } from "../../../hooks";
import { CompanyPostBadge } from "./index";
import quillHelper from "../../../../helpers/quillHelper";
import Tooltip from "react-tooltip-lite";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  flex: unset;
  svg {
    cursor: pointer;
    margin-right: 5px;
  }
  
  .author-avatar {
    width: 40px;
    height: 40px;
  }
  
  .author-name {
    display: block;
    color: #505050;
    font-size: 14px;   
    font-weight: 500;
    color: rgb(80, 80, 80);
    .dark & {
      color: #c7c7c7;   
  }
  .recipients {
    color: #8b8b8b;
    font-size: 10px;
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
    box-shadow: 0 5px 10px -1px rgba(0,0,0,0.15);
    background: #fff;
    max-height: 0;
    opacity: 0;
    
    &:hover {
      max-height: 300px;
      opacity: 1;    
    }
    
    .dark & {
      border: 1px solid #25282c;
      background: #25282c;
    }
    
    > span {
      display: block;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0.25rem 0.5rem;
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

const Icon = styled(SvgIconFeather)`
  width: 16px;
  cursor: pointer;
`;

const CompanyPostBody = (props) => {
  const { post, user, postActions, dictionary, disableOptions } = props;

  const postRecipients = useSelector((state) => state.global.recipients
    .filter((r) => post.recipient_ids.includes(r.id))
    .sort((a, b) => {
      if (a.type !== b.type) {
        if (a.type === "TOPIC") return -1;
        if (b.type === "TOPIC") return 1;
      }
      return a.name.localeCompare(b.name);
    })
  );

  const [star, setStar] = useState(post.is_favourite);
  const { localizeDate, fromNow } = useTimeFormat();
  const googleApis = useGoogleApis();

  const handleStarPost = () => {
    if (disableOptions) return;
    postActions.starPost(post);
    setStar(!star);
  };

  const handleArchivePost = () => {
    postActions.archivePost(post);
  };

  const handlePostBodyRef = (e) => {
    if (e) {
      const googleLinks = e.querySelectorAll(`[data-google-link-retrieve="0"]`);
      googleLinks.forEach((gl) => {
        let e = gl;
        e.dataset.googleLinkRetrieve = 1;
        googleApis.getFile(e, e.dataset.googleFileId);
      });
    }
  };

  const renderUserResponsibleNames = () => {
    let recipient_names = "to ";
    const otherPostRecipients = postRecipients.filter(r => !(r.type === "USER" && r.type_id === user.id));
    const hasMe = postRecipients.some(r => r.type_id === user.id);
    if (otherPostRecipients.length) {
      recipient_names += otherPostRecipients.filter((r, i) => i < (hasMe ? 4 : 5))
        .map(r => `<span class="receiver">${r.name}</span>`)
        .join(`, `);
    }

    if (hasMe) {
      if (otherPostRecipients.length >= 1) {
        recipient_names += `, ${dictionary.me}`;
      } else {
        recipient_names += dictionary.me;
      }
    }

    let otherRecipientNames = "";
    if ((otherPostRecipients.length + (hasMe ? 1 : 0)) > 5) {
      otherRecipientNames += otherPostRecipients.filter((r, i) => i >= (hasMe ? 4 : 5))
        .map(r => `<span class="receiver">${r.name}</span>`).join("");

      otherRecipientNames = `<span class="ellipsis-hover">... <span class="recipient-names">${otherRecipientNames}</span></span>`;
    }

    return `${recipient_names} ${otherRecipientNames}`;
  };

  return (
    <Wrapper className="card-body">
      <div className="d-flex align-items-center p-l-r-0 m-b-20">
        <div className="d-flex justify-content-between align-items-center text-muted w-100">
          <div className="d-inline-flex justify-content-center align-items-start">
            <Avatar className="author-avatar mr-2" id={post.author.id} name={post.author.name}
                    imageLink={post.author.profile_image_thumbnail_link ? post.author.profile_image_thumbnail_link : post.author.profile_image_link}/>
            <div>
              <span className="author-name">{post.author.first_name}</span>
              {
                postRecipients.length >= 1 &&
                <span className="recipients" dangerouslySetInnerHTML={{ __html: renderUserResponsibleNames() }}/>
              }
            </div>
          </div>
          <div className="d-inline-flex">
            <CompanyPostBadge post={post} isBadgePill={true} dictionary={dictionary}/>
            {post.files.length > 0 && <Icon className="mr-2" icon="paperclip"/>}
            <Icon className="mr-2" onClick={handleStarPost} icon="star" fill={star ? "#ffc107" : "none"}
                  stroke={star ? "#ffc107" : "currentcolor"}/>
            {!disableOptions && <Icon className="mr-2" onClick={handleArchivePost} icon="archive"/>}
            <div className={"time-stamp"}>
              <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip}
                             content={`${localizeDate(post.created_at.timestamp)}`}>
                <span className="text-muted">{fromNow(post.created_at.timestamp)}</span>
              </StyledTooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="mw-100" ref={handlePostBodyRef} dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(post.body) }}/>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyPostBody);
