import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { CompanyHeaderPanel } from "../company";
import { WorkspaceHeaderPanel } from "../workspace";

const Wrapper = styled.div`
  @media (max-width: 560px) {
    height: 110px;
  }
`;

const MainHeaderPanel = (props) => {
  const { className = "", isExternal } = props;

  useEffect(() => {
    document.body.classList.add("stretch-layout");
  }, []);

  return (
    <Wrapper className={`header ${className}`} id="main-top-header">
      <Switch>
        <Route render={() => <WorkspaceHeaderPanel isExternal={isExternal} {...props} />} path={["/workspace/:page"]} />
        <Route render={() => <CompanyHeaderPanel isExternal={isExternal} {...props} />} path={["/:page"]} />
      </Switch>
    </Wrapper>
  );
};

export default React.memo(MainHeaderPanel);
