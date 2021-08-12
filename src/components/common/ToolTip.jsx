import React from "react";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";

const Wrapper = styled(Tooltip)``;

const ToolTip = (props) => {
  const { arrowSize = 5, distance = 10, content, children, direction = "up-middle", ...otherProps } = props;

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");

    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  return (
    <Wrapper direction={direction} arrowSize={arrowSize} distance={distance} onToggle={toggleTooltip} content={content} zIndex={2000} {...otherProps}>
      {children}
    </Wrapper>
  );
};

export default ToolTip;
