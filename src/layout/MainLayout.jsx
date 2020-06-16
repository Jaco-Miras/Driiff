import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route} from "react-router-dom";
import styled from "styled-components";
import {useUserLogout, useVisibilityChange, useSocketConnection} from "../components/hooks";
import useFilesUpload from "../components/hooks/useFilesUpload";
import {ModalPanel} from "../components/panels";
import MobileOverlay from "../components/panels/MobileOverlay";
import {MainContentPanel, MainHeaderPanel, MainNavigationPanel} from "../components/panels/main";
//import Socket from "../components/socket/socket";
import {getFiles} from "../redux/actions/fileActions";
import {getAllRecipients, getConnectedSlugs} from "../redux/actions/globalActions";
import {getMentions} from "../redux/actions/userAction";
import SocketListeners from "../components/socket/socketListeners";

const MainContent = styled.div`
`;

const MainLayout = (props) => {

    useUserLogout(props);
    useFilesUpload(props);
    useVisibilityChange();
    useSocketConnection();

    const user = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    const files = useSelector(state => state.files.files);

    useEffect(() => {
        document.body.classList.remove("form-membership");
        dispatch(getAllRecipients());
        dispatch(getMentions());
        dispatch(getConnectedSlugs());
        if (Object.keys(files).length === 0) {
            dispatch(getFiles({sort: "desc"}));
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MainHeaderPanel/>
            <MainContent id="main">
                <Route
                    {...props}
                    component={MainNavigationPanel}
                    path={["/:page"]}/>
                <Route
                    {...props}
                    component={MainContentPanel}
                    path={["/:page"]}/>
            </MainContent>
            <ModalPanel/>
            <MobileOverlay/>
            {/* {
                user.id !== undefined &&
                <Socket/>
            } */}
            {
                user.id !== undefined && window.Echo !== undefined &&
                <SocketListeners/>
            }
        </>
    );
};

export default React.memo(MainLayout);