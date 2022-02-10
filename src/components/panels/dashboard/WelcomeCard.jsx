import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: block;
  span {
    display: block;
  }
  span:first-child {
    font-weight: bold;
  }
  span:last-child {
    font-weight: 500;
  }
`;

const WelcomeCard = (props) => {
  const { dictionary } = props;
  return (
    <Wrapper>
      <span>{dictionary.hiUser} 👋</span>
      <span>{dictionary.dailyDigest}</span>
    </Wrapper>
  );
};

export default WelcomeCard;
