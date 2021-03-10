import React, { useEffect } from "react";
import styled from "styled-components";
import { sessionService } from "redux-react-session";
import { useHistory } from "react-router-dom";

const Wrapper = styled.form`
  margin: 50px auto;
  max-width: 430px;

  .btn-magic-link {
    background-color: #7a1b8b;
    color: #fff;
  }
`;

const ForceLogoutPanel = (props) => {
  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem("userAuthToken");
    localStorage.removeItem("token");
    localStorage.removeItem("atoken");
    sessionService
      .deleteSession()
      .then(() => sessionService.deleteUser())
      .then(() => {
        history.push("/login");
      });
  }, []);

  return <Wrapper className="fadeIn"></Wrapper>;
};

export default React.memo(ForceLogoutPanel);
