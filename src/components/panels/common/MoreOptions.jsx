import React, {useRef, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useTooltipOrientation} from "../../hooks";

const Wrapper = styled.div`
  display: inline-flex;
  position: relative;
  width: 25px;

  svg {
    cursor: pointer;
    width: 100%;

    &:hover {
      color: #972c86;
    }
  }
`;
const MoreTooltip = styled.div`
  ${(props) => props.hide && "display: none"};
  z-index: 30;
  height: auto;
  position: absolute;
  cursor: pointer;
  width: ${(props) => props.width}px;
  background-color: #ffffff;
  color: #4d4d4d;
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);

  .dark & {
    color: #fff;
  }

  &.orientation-top {
    bottom: -10px;
  }
  &.orientation-bottom {
    top: calc(100% - 25px);
    bottom: auto;
  }
  &.orientation-left {
    right: calc(100% + 5px);
    left: auto;
  }
  &.orientation-right {
    left: calc(100% + 25px);
    right: auto;
  }

  button:hover {
    color: #972c86;
  }

  > div {
    text-align: left;
    padding: 4px 24px;
    cursor: pointer;

    &.active,
    &:hover {
      background-color: #f0f0f0;
      color: #7a1b8b;
    }
  }

  > div:last-child {
    border-bottom: none;
  }
`;

const MoreOptions = (props) => {
  const { className = "", item, moreButton = "more-horizontal", children = "More Options", width = 200, scrollRef = null, ...rest } = props;

  const refs = {
    options: useRef(),
    container: useRef(),
    scrollRef: scrollRef,
  };

  let timeout = null;

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const { orientation } = useTooltipOrientation(refs.container, refs.options, scrollRef, showMoreOptions);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreOptions(!showMoreOptions);
  };

  const handleMouseLeave = () => {
    timeout = setTimeout(() => {
      setShowMoreOptions(false);
    }, 600);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeout);
  };

  return (
    <Wrapper className={`more-options ${className}`} onClick={handleClick} ref={refs.container} onMouseEnter={handleMouseEnter} {...rest}>
      <SvgIconFeather onMouseLeave={handleMouseLeave} data-event="touchstart focus mouseover" data-event-off="mouseout" data-tip="Message options" icon={moreButton} />
      {showMoreOptions && (
        <MoreTooltip
          ref={refs.options}
          width={width}
          hide={orientation.vertical === null || orientation.horizontal === null}
          className={`more-options-tooltip orientation-${orientation.vertical} orientation-${orientation.horizontal}`}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          {children}
        </MoreTooltip>
      )}
    </Wrapper>
  );
};

export default React.memo(MoreOptions);
