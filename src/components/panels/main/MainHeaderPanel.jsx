import React from "react";
import {Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {CompanyHeaderPanel} from "../company";
import {WorkspaceHeaderPanel} from "../workspace";

const Wrapper = styled.div`
`;

const MainHeaderPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`header ${className}`}>
            <Switch>
                <Route
                    {...props}
                    component={WorkspaceHeaderPanel}
                    path={["/workspace/:page"]}/>
                <Route
                    {...props}
                    component={CompanyHeaderPanel}
                    path={["/:page"]}/>
            </Switch>
        </Wrapper>
    );
};

export default React.memo(MainHeaderPanel);