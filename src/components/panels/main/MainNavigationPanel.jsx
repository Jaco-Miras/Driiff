import React from "react";
import {Route} from "react-router-dom";
import styled from "styled-components";
import {WorkspaceNavigationMenuBodyPanel} from "../workspace";
import {MainNavigationTabPanel} from "./index";

const Wrapper = styled.div`  
`;

const MainNavigationPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`navigation ${className}`}>
            <MainNavigationTabPanel/>
            <Route
                {...props}
                component={WorkspaceNavigationMenuBodyPanel}
                path={[
                    "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
                    "/workspace/:page/:workspaceId/:workspaceName",
                    "/workspace/:page",
                ]}/>
        </Wrapper>
    );
};

export default React.memo(MainNavigationPanel);