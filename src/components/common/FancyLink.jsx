import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";

import { getSiteMetaData } from "../../redux/services/chat";

const Wrapper = styled.div`
border-radius: 5px !important;
background-color: #F8F8F8 !important;
box-shadow: 0 1px 1px 0 rgba(0,0,0,0.11) !important; 
text-decoration: none !important;
display: inline-block;
height: 34px !important;
padding:5px 10px;
margin-bottom: 5px;
`;

const Img = styled.img`
height: 16px;
width: 16px;
`;

const Span = styled.span`color: #696969 !important;
font-family: Inter !important;
font-size: 13px !important;
letter-spacing: 0 !important;
line-height: 21px !important; padding-left: 5px;`;

const FancyLink = (props) => {

  const { className = "", link } = props;
  const [title, setTitle] = useState('No title found!');

  const metaA = function (data, callback) {
    getSiteMetaData(data).then((response) => {
      callback(response.data.title);
    });
  }

  metaA({ received_url: link }, function (response) {
    setTitle(title);
  });
  
  const faviLink = 'https://www.google.com/s2/favicons?domain=' + link;
  return (
    <Wrapper className={`${className}`}>
      <a href={link} target="_blank"><Img src={faviLink} /><Span>{title}</Span></a>
    </Wrapper>

  );
};

export default FancyLink;