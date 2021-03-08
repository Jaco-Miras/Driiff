import React, { useEffect } from "react";
import styled from "styled-components";

import useUserLogout from "../hooks/useUserLogout";

const Wrapper = styled.form`
  margin: 50px auto;
  max-width: 430px;

  .btn-magic-link {
    background-color: #7a1b8b;
    color: #fff;
  }
`;

const ForceLogoutPanel = (props) => {
  const { logout } = useUserLogout();

  useEffect(() => {
    logout();
  }, []);

  return <Wrapper className="fadeIn"></Wrapper>;
};

export default React.memo(ForceLogoutPanel);
