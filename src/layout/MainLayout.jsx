import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  useDriff,
  useFilesUpload,
  useSettings,
  useSocketConnection,
  useTimeFormat,
  useToaster,
  useUserActions,
  useVisibilityChange,
  useWorkspaceActions,
  useInitialLoad
} from "../components/hooks";
import { MainContentPanel, MainHeaderPanel, MainNavigationPanel } from "../components/panels/main";
import MobileOverlay from "../components/panels/MobileOverlay";
import { WorkspaceContentPanel } from "../components/panels/workspace";
import SocketListeners from "../components/socket/socketListeners";
import { getAPIUrl, getCurrentDriffUrl } from "../helpers/slugHelper";
import { PushNotificationBar, usePushNotification } from "../components/webpush";

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
  useInitialLoad();
  const { mounted, showNotificationBar, onClickAskUserPermission, onClickRemindLater } = usePushNotification();
  const { path } = useRouteMatch();
  const { displayWelcomeBanner } = useUserActions();
  const uDriff = useDriff();

  const user = useSelector((state) => state.session.user);
  const toaster = useToaster();
  const { localizeDate } = useTimeFormat();
  const workspaceActions = useWorkspaceActions();
  const refs = {
    audio: useRef(null),
  };

  const dispatch = useDispatch();

  const {
    driffSettings: {isCompSettingsLoaded},
    chatSettings: {sound_enabled},
    generalSettings: {notifications_on}
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
    if (user.id && isCompSettingsLoaded) {
      displayWelcomeBanner()
    }
  }, [user, isCompSettingsLoaded]);

  return (
    <>
      <AudioStyle ref={refs.audio} controls>
        <source src={require("../assets/audio/appointed.ogg")} type="audio/ogg"/>
        <source src={require("../assets/audio/appointed.mp3")} type="audio/mpeg"/>
        <source src={require("../assets/audio/appointed.m4r")} type="audio/m4r"/>
        Your browser does not support the audio element.
      </AudioStyle>
      {
        showNotificationBar && mounted &&
        <PushNotificationBar onClickAskUserPermission={onClickAskUserPermission} onClickRemindLater={onClickRemindLater}/>
      }
      { mounted && <MainHeaderPanel isExternal={isExternal}/> }
      {
        mounted && 
        <MainContent id="main">
          <Route render={(props) => <MainNavigationPanel isExternal={isExternal} {...props} showNotificationBar={showNotificationBar}/>} path={["/:page"]}/>
          <Switch>
            <Route render={(props) => <WorkspaceContentPanel isExternal={isExternal} {...props}/>} path={["/workspace"]}/>
            <Route render={(props) => <MainContentPanel {...props} isExternal={isExternal}/>} path={["/:page"]}/>
          </Switch>
        </MainContent>
      }
      <MobileOverlay/>
      {user.id !== undefined && window.Echo !== undefined &&
      <SocketListeners useDriff={uDriff} localizeDate={localizeDate} toaster={toaster} soundPlay={handleSoundPlay}
                       workspaceActions={workspaceActions} notificationsOn={notifications_on}/>}
    </>
  );
};

export default React.memo(MainLayout);
