import React, {useEffect} from "react";
import {Link, withRouter} from "react-router-dom";
import {Form} from "reactstrap";
import styled from "styled-components";
import {SvgIcon} from "../common";

const Wrapper = styled.div`
  body & {
    &.form-wrapper {
      margin: 50px auto;
      max-width: 860px;
      width: 98%;
      @media (max-width: 576px) {
        width: auto;
        margin: 0 20px;
        padding: 32px;
      }
      h2 {
        margin: 0 0 20px 0;
        font-size: 32px;
        text-align: left;
        min-height: 80px;
        color: #000000;
        font-weight: 800;
        @media (max-width: 576px) {
          font-size: 24px;
          min-height: auto;
        }
      }
      p {
        text-align: left;
      }

      .col-sm-6 {
        padding: 60px 40px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        @media (max-width: 576px) {
          padding: 30px 20px;
          border-radius: 0;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .btn {
          width: 100%;
          text-align: center;
          justify-content: center;
          margin-bottom: 0 !important;
          font-size: 18px;
          height: 44px;
          font-weight: bold;
          color: #360c3e;
          &:hover {
            background-color: #7a1b8b;
            border-color: #7a1b8b;
          }
        }
        border: 1px solid #ddd;
        border-left: 0;

        @media (max-width: 576px) {
          border: 1px solid #ddd;
          border-top: 0;
        }
        &.col-set-up {
          background-color: #360c3e;
          border: 0;
          border-radius: 0;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          h2 {
            color: #fff;
          }
          p {
            color: #fff;
          }
          @media (max-width: 576px) {
            border-radius: 0;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }
          .btn.btn-outline-light {
            background-color: #fff;
            &:hover {
              background-color: rgba(255, 255, 255, 0.2) !important;
              border-color: rgba(255, 255, 255, 0.2) !important;
            }
          }
        }
      }
    }
  }

  .input-group {
    input {
      margin-bottom: 0 !important;
    }
    &.driff-name {
      .input-group-text {
        border-radius: 0 6px 6px 0;
      }
      .invalid-feedback {
          text-align: left;
      }
    }
  }
`;

const DriffSelectPanel = (props) => {
  const {className = ""} = props;

  useEffect(() => {
    document.body.classList.add("form-membership");

  }, []);

  return (
    <Wrapper className={`driff-register-panel fadeIn form-wrapper ${className}`}>
      <div id="logo">
        <SvgIcon icon={"driff-logo"} width="110" height="80"/>
      </div>
      <Form className="row">
        <div className="col-12 col-sm-6 col-set-up">
          <h2>Setup a new Driff</h2>
          <p>Lorem ipsum dolor sit amet</p>
          <Link className="btn btn-outline-light mt-4 mb-4" to="/driff-register">
            + Create a Driff
          </Link>
        </div>
        <div className="col-12 col-sm-6">
          <h2>Is your team already using Driff?</h2>
          <p>Lorem ipsum dolor sit amet</p>
          <Link className="btn btn-outline-light mt-4 mb-4" to="/driff">
            Sign in to Driff
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default withRouter(DriffSelectPanel);
