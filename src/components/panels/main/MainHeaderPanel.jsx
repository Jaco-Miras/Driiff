import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { CompanyHeaderPanel } from "../company";
import { WorkspaceHeaderPanel } from "../workspace";

const Wrapper = styled.div`
  display: ${(props) => (!props.hidePageHeader ? "flex" : "none")};
  @media (max-width: 560px) {
    height: 90px;
  }
  @media (min-width: 768px) {
    display: flex;
    height: 90px;
  }
`;

const MainHeaderPanel = (props) => {
  const { className = "", isExternal } = props;
  const hidePageHeader = useSelector((state) => state.chat.hidePageHeader);

  useEffect(() => {
    document.body.classList.add("stretch-layout");
  }, []);

  return (
    <Wrapper className={`header ${className}`} hidePageHeader={hidePageHeader} id="main-top-header">
      <Switch>
        <Route render={() => <WorkspaceHeaderPanel isExternal={isExternal} {...props} />} path={["/hub/:page"]} />
        <Route render={() => <CompanyHeaderPanel isExternal={isExternal} {...props} />} path={["/:page"]} />
      </Switch>
    </Wrapper>
  );
};

export default React.memo(MainHeaderPanel);
