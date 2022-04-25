import React from "react";
import styled from "styled-components";

const Wrapper = styled.a`
  border-radius: 5px !important;
  background-color: #fff !important;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.11) !important;
  text-decoration: none !important;
  display: inline-block;
  height: auto !important;
  padding: 5px 10px;
  margin-bottom: 5px;
  color: #000 !important;
  font-family: Inter !important;
  font-size: 13px !important;
  letter-spacing: 0 !important;
  line-height: 21px !important;
  margin-right: 1pt;
  margin-left: 1pt;
  img {
    width: 1rem;
    height: 1rem;
  }
`;
const FancyLink = (props) => {
  const { link, title } = props;
  const favLink = link.replace("https://", "");
  return (
    <Wrapper href={`${link}`} target="_blank">
      <img src={"https://api.faviconkit.com/" + favLink} alt="link icon" className="mr-2"></img>
      {title}
    </Wrapper>
  );
};
export default FancyLink;
