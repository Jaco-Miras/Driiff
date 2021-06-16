import React from "react";
import styled from "styled-components";

const Wrapper = styled.a`
border-radius: 5px !important;
background-color: #FFF !important;
box-shadow: 0 1px 1px 0 rgba(0,0,0,0.11) !important; 
text-decoration: none !important;
display: inline-block;
height: auto !important;
padding:5px 10px;
margin-bottom: 5px;
color: #000 !important;
font-family: Inter !important;
font-size: 13px !important;
letter-spacing: 0 !important;
line-height: 21px !important;
margin-right: 1pt;
margin-left: 1pt;
::before { content : url(${props => props.favlink});  display: inline-block;vertical-align: middle;line-height: normal; padding-right: .3em;}
`;
const FancyLink = (props) => {
  const { link, title } = props;
  return (
    <Wrapper href={`${link}`} target="_blank" favlink={'https://www.google.com/s2/favicons?domain=' + link}>
      {title}
    </Wrapper>
  );
};
export default FancyLink;