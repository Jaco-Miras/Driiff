import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  :first-of-type {
    padding-bottom: 10px;
  }
  :nth-child(even) {
    background: #f8f9fa;
  }
  :nth-child(odd) {
    background: transparent;
  }
  border-bottom: 1px solid #ebebeb;
  :last-of-type {
    border: none;
  }

  .custom-checkbox .ccl span:first-child {
    border-radius: 10px;
  }

  .list-group-done .custom-checkbox .cci.cci-active + .ccl span:first-child {
    background: #efefef;
    border: 1px solid #9098a9;
  }
  .list-group-done .custom-checkbox .cci.cci-active + .ccl span:first-child svg {
    stroke: #191c20;
  }
  div:first-child {
    padding-left: 20px;
    padding-right: 0;
  }
`;

const SpanTitle = styled.span`
  font-weight: 700;
  cursor: pointer;
  background: #f8f9fa !important;
  border: 1px solid #f8f9fa;
`;

const EmptyState = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  margin: auto;
  text-align: center;

  svg {
    display: block;
    margin: 0 auto;
  }

  h3 {
    font-size: 16px;
  }
  h5 {
    margin-bottom: 0;
    font-size: 14px;
  }

  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const TodoEmptyState = (props) => {
  const { dictionary } = props;
  return (
    <Wrapper>
      <div>
        <h6 className="mt-3 mb-0 font-size-11">
          <SpanTitle className={"badge"}>
            <SvgIconFeather icon="arrow-up" width={16} height={16} className="mr-1" />
            {dictionary.todo}
          </SpanTitle>
        </h6>
      </div>
      <EmptyState>
        <h3>{dictionary.noItemsFoundHeader}</h3>
        <h5>{dictionary.noItemsFoundText} </h5>
      </EmptyState>
    </Wrapper>
  );
};

export default TodoEmptyState;
