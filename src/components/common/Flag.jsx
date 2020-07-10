import React from "react";
import styled from "styled-components";

const Wrapper = styled.img``;

const Flag = (props) => {
  const { className = "", countryAbbr = "nl", ...otherProps } = props;

  let country = countryAbbr;
  if (countryAbbr === null) country = "nl";

  let source = "";
  switch (country.toLocaleLowerCase()) {
    case "en":
      source = require("../../assets/media/image/flags/262-united-kingdom.png");
      break;
    case "uk":
      source = require("../../assets/media/image/flags/262-united-kingdom.png");
      break;
    case "nl":
      source = require("../../assets/media/image/flags/195-netherlands.png");
      break;
    case "de":
      source = require("../../assets/media/image/flags/066-germany.png");
      break;
    default:
      source = require("../../assets/media/image/flags/195-netherlands.png");
  }

  return <Wrapper className={`flag ${className}`} src={source} alt="flag" {...otherProps}></Wrapper>;
};

export default React.memo(Flag);
