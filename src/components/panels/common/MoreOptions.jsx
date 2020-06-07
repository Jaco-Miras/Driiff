import React, {useRef, useState} from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useOutsideClick, useTooltipOrientation} from "../../hooks";

const Wrapper = styled.div`
  display: inline-flex;
  position: relative;
`;
const MoreButton = styled.button`
  width: 16px;
  height: 16px;
  padding: 0;
  cursor: pointer;
  border: none;
  background: transparent;
  
  svg {
    width: 100%;
    
    &:hover {
        color: #972c86;;
    }
  }
`;
const MoreTooltip = styled.div`
    ${props => props.show && `display: none;`}
    z-index: 30;
    height: auto;
    position: absolute;
    cursor: pointer;
    width: ${props => props.width}px;
    height: auto;
    background-color: #ffffff;
    color: #4d4d4d;
    border-radius: 8px;
    padding: 8px 0px;
    cursor: pointer;
    box-shadow: 0 5px 10px -1px rgba(0,0,0,.15);
    border-top: 1px solid #eeeeee !important;
    
    
    &.orientation-top {        
        bottom: -10px;
    }
    &.orientation-bottom {
        top: calc(100% - 25px);
        bottom: auto;
    }
    &.orientation-left {
        right: calc(100% + 25px);
        left: auto;
    }
    &.orientation-right {
        left: calc(100% + 25px);
        right: auto;
    }
    
    button:hover{
        color: #972c86;
    }
    
    > div {
        text-align: left;
        padding: 4px 24px;
        cursor: pointer;
        &:hover {
            background-color: #F0F0F0;
            color: #7A1B8B;
        }
    }
    
    > div:last-child{
        border-bottom: none;
    }
`;


const MoreOptions = props => {

    const {className = "", item, moreButton = `horizontal`, children = "More Options", width = 200, scrollRef = null, ...rest} = props;
    const refs = {
        options: useRef(),
        container: useRef(),
        scrollRef: scrollRef,
    };
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const {orientation} = useTooltipOrientation(refs.container, refs.options, scrollRef, showMoreOptions, "bottom", 0);

    const handleClick = () => {
        setShowMoreOptions(!showMoreOptions);
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            setShowMoreOptions(false);
        }, 500);
    };

    useOutsideClick(refs.options, handleClick, showMoreOptions);

    return <Wrapper
        className={`more-options ${className}`}
        onClick={handleClick}
        ref={refs.container}
        {...rest}>
        <MoreButton
            data-event="touchstart focus mouseover" data-event-off="mouseout" data-tip="Message options">
            <SvgIconFeather icon={`more-${moreButton}`}/>
        </MoreButton>
        {
            showMoreOptions &&
            <MoreTooltip
                ref={refs.options}
                width={width}
                show={orientation.vertical === null || orientation.horizontal === null}
                className={`more-options-tooltip orientation-${orientation.vertical} orientation-${orientation.horizontal}`}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </MoreTooltip>
        }
    </Wrapper>;
};

export default React.memo(MoreOptions);