import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {useSettings, useSocketConnection, useToaster, useUserLogout, useVisibilityChange} from "../components/hooks";
import useFilesUpload from "../components/hooks/useFilesUpload";
import {ModalPanel} from "../components/panels";
import {MainContentPanel, MainHeaderPanel, MainNavigationPanel} from "../components/panels/main";
import MobileOverlay from "../components/panels/MobileOverlay";
import {WorkspaceContentPanel} from "../components/panels/workspace";
import SocketListeners from "../components/socket/socketListeners";
//import Socket from "../components/socket/socket";
//import Socket from "../components/socket/socket";
import {getFiles} from "../redux/actions/fileActions";
import {getAllRecipients, getConnectedSlugs} from "../redux/actions/globalActions";
import {getNotifications} from "../redux/actions/notificationActions";
import {getMentions} from "../redux/actions/userAction";

const MainContent = styled.div`
`;

const AudioStyle = styled.audio`
    opacity: 0;
    visibility: hidden;    
`;

const MainLayout = (props) => {

    useUserLogout(props);
    useFilesUpload(props);
    useVisibilityChange();
    useSocketConnection();

    const user = useSelector(state => state.session.user);
    const toaster = useToaster();

    const refs = {
        audio: useRef(null),
    };

    const dispatch = useDispatch();

    const files = useSelector(state => state.files.files);
    const notifications = useSelector(state => state.notifications.notifications);
    const {
        chatSettings: {sound_enabled},
    } = useSettings();

    useEffect(() => {
        document.body.classList.remove("form-membership");
        dispatch(getAllRecipients());
        dispatch(getMentions());
        dispatch(getConnectedSlugs());
        if (Object.keys(files).length === 0) {
            dispatch(getFiles({sort: "desc"}));
        }
        if (Object.keys(notifications).length === 0) {
            dispatch(getNotifications({skip: 0, limit: 100}));
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSoundPlay = () => {
        if (sound_enabled && refs.audio.current) {
            refs.audio.current.play();
        }
    };

    return (
        <>
            <MainHeaderPanel/>
            <MainContent id="main">
                <Route
                    {...props}
                    component={MainNavigationPanel}
                    path={["/:page"]}/>
                <Switch>
                    <Route
                        {...props}
                        component={WorkspaceContentPanel}
                        path={["/workspace"]}/>
                    <Route
                        {...props}
                        component={MainContentPanel}
                        path={["/:page"]}/>
                </Switch>
            </MainContent>
            <ModalPanel/>
            <MobileOverlay/>
            <AudioStyle ref={refs.audio} controls>
                <source src={require("../assets/audio/appointed.ogg")} type="audio/ogg"/>
                <source src={require("../assets/audio/appointed.mp3")} type="audio/mpeg"/>
                <source src={require("../assets/audio/appointed.m4r")} type="audio/m4r"/>
                Your browser does not support the audio element.
            </AudioStyle>
            {/* {
             user.id !== undefined &&
             <Socket/>
             } */}
            {
                user.id !== undefined && window.Echo !== undefined &&
                <SocketListeners toaster={toaster} soundPlay={handleSoundPlay}/>
            }
        </>
    );
};

export default React.memo(MainLayout);