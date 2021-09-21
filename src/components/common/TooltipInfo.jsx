import React from "react";
import Tooltip from "react-tooltip-lite";
import { SvgIconFeather } from "./index";

const TooltipInfo = (props) => {
  const { content } = props;
  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };
  return (
    <Tooltip onToggle={toggleTooltip} content={content}>
      <SvgIconFeather icon="info" width={16} height={16} />
    </Tooltip>
  );
};
export default TooltipInfo;
