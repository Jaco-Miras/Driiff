import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import styled from "styled-components";
import { SvgIcon } from "./SvgIcon";

const ImageTextLinkContainer = styled.span`
  justify-content: center;
`;

const ImageTextLink = forwardRef((props, ref) => {
  const {
    className = "",
    rotate = "",
    iconPosition = "left",
    children,
    href,
    icon,
    clickHandler,
    onClick,
    iconLeft,
    iconRight,
    iconLeftRotate,
    iconRightRotate,
    iconLeftOnClick,
    iconRightOnClick,
    iconRightDataSet,
    iconLeftDataSet,
    dataSet,
    target = null,
    dataTip = "",
    style = null,
  } = props;

  const handleContainerOnClick = (e) => {
    handleOnClick(e);
  };

  const handleOnClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (href) {
      if (clickHandler) {
        clickHandler(href);
      } else {
        //window.location.href = e.target.href
        window.open(e.target.href, "_blank");
      }
    }

    if (onClick) {
      if (dataSet) {
        onClick(e, dataSet);
      } else {
        onClick(e);
      }
    }
  };

  const handleLeftIconClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (iconLeftOnClick) {
      if (iconLeftDataSet) {
        iconLeftOnClick(e, iconLeftDataSet);
      } else {
        iconLeftOnClick(e);
      }
    } else {
      handleOnClick(e);
    }
  };

  const handleRightIconClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (iconRightOnClick) {
      if (iconRightDataSet) {
        iconRightOnClick(e, iconRightDataSet);
      } else {
        iconRightOnClick(e);
      }
    } else {
      handleOnClick(e);
    }
  };

  return (
    <ImageTextLinkContainer
      ref={ref}
      style={style}
      className={`img-lnk component-image-text-link ${className}`}
      onClick={(e) => handleContainerOnClick(e)}
      data-event="touchstart focus mouseover"
      data-event-off="mouseout"
      data-tip={dataTip}
    >
      {iconLeft && <SvgIcon className={"svg-icon-left"} onClick={(e) => handleLeftIconClick(e)} icon={iconLeft} rotate={iconLeftRotate} dataSet={iconLeftDataSet} />}
      <a target={target} href={href} onClick={(e) => handleOnClick(e)}>
        {(iconPosition === "right" || iconPosition === "both") && icon && <SvgIcon className={"svg-icon-right"} icon={icon} rotate={rotate} />}
        {children}
        {(iconPosition === "left" || iconPosition === "both") && icon && <SvgIcon className={"svg-icon-left"} icon={icon} rotate={rotate} />}
      </a>
      {iconRight && <SvgIcon className={"svg-icon-right"} onClick={(e) => handleRightIconClick(e)} icon={iconRight} rotate={iconRightRotate} dataSet={iconRightDataSet} />}
    </ImageTextLinkContainer>
  );
});

const { string, func, number, oneOfType, object } = PropTypes;

ImageTextLink.propTypes = {
  className: string,
  onClick: func,
  dataTip: string,
  href: string,
  iconPosition: string,
  clickHandler: func,
  icon: string,
  iconLeft: string,
  iconLeftOnClick: func,
  iconRight: string,
  iconRightOnClick: func,
  iconLeftRotate: number,
  iconRightRotate: number,
  rotate: number,
  dataSet: oneOfType([number, string, object]),
  iconLeftDataSet: oneOfType([number, string, object]),
  iconRightDataSet: oneOfType([number, string, object]),
};

export default ImageTextLink;
