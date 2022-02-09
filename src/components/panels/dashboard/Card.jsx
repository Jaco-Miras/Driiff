import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  .card-body {
    padding: 1rem;
  }
`;

const Card = (props) => {
  const { className } = props;
  const classNames = "card " + className;
  return (
    <Wrapper className={classNames}>
      <div className="card-body">{props.children}</div>
    </Wrapper>
  );
};

export default Card;
