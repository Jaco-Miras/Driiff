import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { CompanyHeaderPanel } from "../company";
import { WorkspaceHeaderPanel } from "../workspace";

const Wrapper = styled.div``;

const MainHeaderPanel = (props) => {
  const { className = "", isExternal } = props;
  
  return (
    <Wrapper className={`header ${className}`}>
      <Switch>
        <Route render={() => <WorkspaceHeaderPanel isExternal={isExternal} {...props}/>} path={["/workspace/:page"]} />
        <Route render={() => <CompanyHeaderPanel isExternal={isExternal} {...props}/>} path={["/:page"]} />
      </Switch>
    </Wrapper>
  );
};

export default React.memo(MainHeaderPanel);
