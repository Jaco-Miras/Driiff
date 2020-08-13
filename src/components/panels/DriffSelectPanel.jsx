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
      
      h2 {
        margin-top: 2rem;
        font-size: 26px;
        text-align: left;
        max-width: 280px;
        height: 60px;
      }
      
      .col-set-up {
        background-color: #7a1b8b;
        
        h2 {
          color: #fff;
        }
        
        .btn.btn-outline-light {
          background-color: #fff;
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
        <div className="col-12 col-md-6 border col-set-up">
          <h2>Setup a new Driff</h2>
          <Link className="btn btn-outline-light mt-4 mb-4" to="/driff-register">
            + Create a Driff
          </Link>
        </div>
        <div className="col-12 col-md-6 border">
          <h2>Is your team already using Driff?</h2>
          <Link className="btn btn-outline-light mt-4 mb-4" to="/driff">
            Sign in to Driff
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default withRouter(DriffSelectPanel);
