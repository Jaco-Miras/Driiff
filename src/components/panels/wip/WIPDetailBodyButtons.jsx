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

const WIPDetailBodyButtons = (props) => {
  const { dictionary, item } = props;

  const componentIsMounted = useRef(true);

  const { fromNow, localizeDate } = useTimeFormat();

  const postActions = usePostActions();

  const [star, setStar] = useState(false);
  const [archivedClicked, setArchivedClicked] = useState(false);
  const [starClicked, setStarClicked] = useState(false);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const handleStarPost = () => {
    // if (disableOptions || starClicked) return;
    // setStarClicked(true);
    // postActions.starPost(post, () => {
    //   if (componentIsMounted.current) setStarClicked(false);
    // });
    // if (componentIsMounted.current) setStar(!star);
  };

  const handleArchivePost = () => {
    // if (archivedClicked) return;
    // setArchivedClicked(true);
    // postActions.archivePost(post, () => {
    //   if (componentIsMounted.current) setArchivedClicked(false);
    // });
  };

  return (
    <div className="d-inline-flex">
      <StyledTooltip arrowSize={5} onToggle={toggleTooltip} content={"favorite"}>
        <Icon className="mr-2" onClick={handleStarPost} icon="star" fill={star ? "#ffc107" : "none"} stroke={star ? "#ffc107" : "currentcolor"} />
      </StyledTooltip>

      <StyledTooltip arrowSize={5} onToggle={toggleTooltip} content={"archive"}>
        <Icon className="mr-2" onClick={handleArchivePost} icon="clock" />
      </StyledTooltip>

      <div className={"time-stamp"}>
        <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={`${localizeDate(item.created_at.timestamp)}`}>
          <span className="text-muted">{fromNow(item.created_at.timestamp)}</span>
        </StyledTooltip>
      </div>
    </div>
  );
};

export default WIPDetailBodyButtons;
