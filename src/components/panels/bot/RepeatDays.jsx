import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;
const Day = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  margin-right: 1rem;
  border-color: #191c20;
  cursor: pointer;
  > span {
    color: ${(props) => (props.active ? "#FFF" : "#828282")};
    background: ${(props) => (props.active ? "#6495ED" : "#f1f2f7")};
    font-size: 11px;
    line-height: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    margin: auto;
    text-align: center;
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: inherit;
  }
`;

const RepeatDays = (props) => {
  const { onClick, selectedDay } = props;

  return (
    <Wrapper>
      <Day data-name={"monday"} onClick={onClick} active={selectedDay === "monday"}>
        <span>M</span>
      </Day>
      <Day data-name={"tuesday"} onClick={onClick} active={selectedDay === "tuesday"}>
        <span>T</span>
      </Day>
      <Day data-name={"wednesday"} onClick={onClick} active={selectedDay === "wednesday"}>
        <span>W</span>
      </Day>
      <Day data-name={"thursday"} onClick={onClick} active={selectedDay === "thursday"}>
        <span>TH</span>
      </Day>
      <Day data-name={"friday"} onClick={onClick} active={selectedDay === "friday"}>
        <span>F</span>
      </Day>
      {/* <Day data-name={"saturday"} onClick={onClick} active={selectedDays.some((d) => d === "saturday")}>
        <span>S</span>
      </Day>
      <Day data-name={"sunday"} onClick={onClick} active={selectedDays.some((d) => d === "sunday")}>
        <span>S</span>
      </Day> */}
    </Wrapper>
  );
};

export default RepeatDays;
