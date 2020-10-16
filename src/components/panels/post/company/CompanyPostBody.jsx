import React, { useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../../common";
import { useGoogleApis, useTimeFormat } from "../../../hooks";
import { CompanyPostBadge } from "./index";
import quillHelper from "../../../../helpers/quillHelper";
import Tooltip from "react-tooltip-lite";

const Wrapper = styled.div`
  flex: unset;
  svg {
    cursor: pointer;
    margin-right: 5px;
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
  const { post, postActions, dictionary, disableOptions } = props;

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

  return (
    <Wrapper className="card-body">
      <div className="d-flex align-items-center p-l-r-0 m-b-20">
        <div className="ml-auto d-flex align-items-center text-muted">
          {
            // !isAuthor && post.is_read_requirement &&
            // <MarkAsReadBtn onClick={markRead}>Mark as read</MarkAsReadBtn>
          }
          {
            // !isAuthor && post.is_read_requirement &&
            // <div className="mr-3 d-sm-inline d-none">
            //     <div className="badge badge-dark">
            //         I've read this
            //     </div>
            // </div>
          }
          <CompanyPostBadge post={post} isBadgePill={true} dictionary={dictionary} />
          {post.files.length > 0 && <Icon className="mr-2" icon="paperclip" />}
          <Icon className="mr-2" onClick={handleStarPost} icon="star" fill={star ? "#ffc107" : "none"} stroke={star ? "#ffc107" : "currentcolor"} />
          {!disableOptions && <Icon className="mr-2" onClick={handleArchivePost} icon="archive" />}
          <div className={"time-stamp"}>
            <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={`${localizeDate(post.created_at.timestamp)}`}>
              <span className="text-muted">{fromNow(post.created_at.timestamp)}</span>
            </StyledTooltip>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div ref={handlePostBodyRef} dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(post.body) }} />
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyPostBody);
