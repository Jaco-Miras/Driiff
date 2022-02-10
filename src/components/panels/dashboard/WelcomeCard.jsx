import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

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
  const user = useSelector((state) => state.session.user);
  return (
    <Wrapper>
      <span>Hi {user.first_name} 👋</span>
      <span>Here's your Driff daily digest</span>
    </Wrapper>
  );
};

export default WelcomeCard;
