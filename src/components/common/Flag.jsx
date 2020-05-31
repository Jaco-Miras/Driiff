import React from "react";
import styled from "styled-components";

const Wrapper = styled.img`
`;

const Flag = (props) => {

    const {className = "", countryAbbr = "nl", ...otherProps} = props;

    let source = "";
    switch (countryAbbr.toLocaleLowerCase()) {
        case "en":
            source = require("../../assets/media/image/flags/262-united-kingdom.png");
            break;
        case "uk":
            source = require("../../assets/media/image/flags/262-united-kingdom.png");
            break;
        case "nl":
            source = require("../../assets/media/image/flags/195-netherlands.png");
            break;
        default:
            source = require("../../assets/media/image/flags/195-netherlands.png");
    }

    return (
        <Wrapper className={`flag ${className}`} src={source} alt="flag" {...otherProps}>
        </Wrapper>
    );
};

export default React.memo(Flag);