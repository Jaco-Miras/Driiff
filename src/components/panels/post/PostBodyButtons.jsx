import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { SvgIconFeather } from "../../common";
import { useTimeFormat, usePostActions } from "../../hooks";

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

const PostBodyButtons = (props) => {
  const { dictionary, post, disableMarkAsRead, disableOptions } = props;

  const componentIsMounted = useRef(true);

  const { fromNow, localizeDate } = useTimeFormat();

  const postActions = usePostActions();

  const [star, setStar] = useState(post.is_favourite);
  const [archivedClicked, setArchivedClicked] = useState(false);
  const [starClicked, setStarClicked] = useState(false);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const handleStarPost = () => {
    if (disableOptions || starClicked) return;
    setStarClicked(true);
    postActions.starPost(post, () => {
      if (componentIsMounted.current) setStarClicked(false);
    });
    if (componentIsMounted.current) setStar(!star);
  };

  const handleArchivePost = () => {
    if (archivedClicked) return;
    setArchivedClicked(true);
    postActions.archivePost(post, () => {
      if (componentIsMounted.current) setArchivedClicked(false);
    });
  };

  const handleClosePost = () => {
    postActions.close(post);
  };

  return (
    <div className="d-inline-flex">
      {post.files.length > 0 && <Icon className="mr-2" icon="paperclip" />}
      <StyledTooltip arrowSize={5} onToggle={toggleTooltip} content={post.is_close ? dictionary.openThisPost : dictionary.closeThisPost}>
        <Icon className="mr-2" icon="x-circle" onClick={handleClosePost} />
      </StyledTooltip>
      <StyledTooltip arrowSize={5} onToggle={toggleTooltip} content={dictionary.starredFavorite}>
        <Icon className="mr-2" onClick={handleStarPost} icon="star" fill={star ? "#ffc107" : "none"} stroke={star ? "#ffc107" : "currentcolor"} />
      </StyledTooltip>
      {!disableOptions && !disableMarkAsRead() && (
        <StyledTooltip arrowSize={5} onToggle={toggleTooltip} content={dictionary.archive}>
          <Icon className="mr-2" onClick={handleArchivePost} icon="archive" />
        </StyledTooltip>
      )}
      <div className={"time-stamp"}>
        <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={`${localizeDate(post.created_at.timestamp)}`}>
          <span className="text-muted">{fromNow(post.created_at.timestamp)}</span>
        </StyledTooltip>
      </div>
    </div>
  );
};

export default PostBodyButtons;
