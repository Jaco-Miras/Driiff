import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {
  useSettings,
  useSocketConnection,
  useTimeFormat,
  useToaster,
  useUserActions,
  useVisibilityChange
} from "../components/hooks";
import useFilesUpload from "../components/hooks/useFilesUpload";
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
import {getAPIUrl, getCurrentDriffUrl} from "../helpers/slugHelper";

const MainContent = styled.div``;

const AudioStyle = styled.audio`
  display: none;
  opacity: 0;
  visibility: hidden;
`;

const MainLayout = (props) => {
  useFilesUpload(props);
  useVisibilityChange();
  useSocketConnection();

  const {path} = useRouteMatch();
  const {logout: userLogout, displayWelcomeBanner} = useUserActions();
  const user = useSelector((state) => state.session.user);
  const socketMounted = useSelector((state) => state.global.socketMounted);
  const toaster = useToaster();
  const {localizeDate} = useTimeFormat();

  const refs = {
    audio: useRef(null),
  };

  const dispatch = useDispatch();

  const files = useSelector((state) => state.files.files);
  const notifications = useSelector((state) => state.notifications.notifications);
  const {
    chatSettings: {sound_enabled},
  } = useSettings();

  const history = useHistory();

  const handleSoundPlay = () => {
    if (sound_enabled && refs.audio.current) {
      const promiseAudioPlay = refs.audio.current.play();

      if (promiseAudioPlay !== undefined) {
        promiseAudioPlay
          .then(() => {
            // Start whatever you need to do only after playback
            // has begun.
          })
          .catch((error) => {
            /**
             * @todo need a fallback in case autoplay is not allowed
             **/
            if (error.name === "NotAllowedError") {
            } else {
            }
          });
      }
    }
  };

  const isExternal = user.type === "external";

  useEffect(() => {
    if (path === "/logout") {
      let redirectLink = `${getCurrentDriffUrl()}/logged-out`;
      window.location.href = `${getAPIUrl({isDNS: true})}/auth-web/logout?redirect_link=${redirectLink}`;
    }
  }, [path, dispatch, history]);

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

  useEffect(() => {
    if (user.id) {
      displayWelcomeBanner(user)
    }
  }, [user]);

  return (
    <>
      <AudioStyle ref={refs.audio} controls>
        <source src={require("../assets/audio/appointed.ogg")} type="audio/ogg"/>
        <source src={require("../assets/audio/appointed.mp3")} type="audio/mpeg"/>
        <source src={require("../assets/audio/appointed.m4r")} type="audio/m4r"/>
        Your browser does not support the audio element.
      </AudioStyle>
      <MainHeaderPanel isExternal={isExternal}/>
      <MainContent id="main">
        <Route render={(props) => <MainNavigationPanel isExternal={isExternal} {...props}/>} path={["/:page"]}/>
        <Switch>
          <Route render={(props) => <WorkspaceContentPanel isExternal={isExternal} {...props}/>} path={["/workspace"]}/>
          <Route render={(props) => <MainContentPanel {...props} isExternal={isExternal}/>} path={["/:page"]}/>
        </Switch>
      </MainContent>

      <MobileOverlay/>





      {/* {
             user.id !== undefined &&
             <Socket/>
             } */}

      {user.id !== undefined && window.Echo !== undefined && !socketMounted &&
      <SocketListeners localizeDate={localizeDate} toaster={toaster} soundPlay={handleSoundPlay}/>}

    </>
  );
};

export default React.memo(MainLayout);
