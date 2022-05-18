import React, { useEffect, useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  useDriff,
  useFilesUpload,
  useInitialLoad,
  useSettings,
  useSocketConnection,
  useTimeFormat,
  useToaster,
  useTranslationActions,
  useUserActions,
  useVisibilityChange,
  useWorkspaceActions,
  useProfilePicUpload,
  useLoadSharedDriff,
} from "../components/hooks";
import { MainContentPanel, MainHeaderPanel, MainNavigationPanel, MainSnoozePanel } from "../components/panels/main";
import MobileOverlay from "../components/panels/MobileOverlay";
import { WorkspaceContentPanel } from "../components/panels/workspace";
import SocketListeners from "../components/socket/socketListeners";
import { PushNotificationBar, usePushNotification } from "../components/webpush";
import { getAPIUrl, getCurrentDriffUrl } from "../helpers/slugHelper";
import { setIdleStatus } from "../redux/actions/globalActions";
import NotificationTopBar from "../components/panels/topbar/NotificationTopBar";
import JitsiContainer from "../components/panels/chat/JitsiContainer";
import JitsiDraggable from "../components/panels/chat/JitsiDraggable";
import ImpersonationTopBar from "../components/panels/topbar/ImpersonationTopBar";

const MainContent = styled.div`
  &.top-40 .main-content {
    margin-top: 40px;
  }
`;

const AudioStyle = styled.audio`
  display: none;
  opacity: 0;
  visibility: hidden;
`;

const MODAL_TIMER = 30000;

const MainLayout = (props) => {
  useFilesUpload(props);
  useVisibilityChange();
  useSocketConnection();
  useInitialLoad();
  useLoadSharedDriff();
  const { mounted, showNotificationBar, onClickAskUserPermission, onClickRemindLater } = usePushNotification();

  const { path } = useRouteMatch();
  const { displayWelcomeBanner, updateProfileImage } = useUserActions();
  const uDriff = useDriff();
  const { _t } = useTranslationActions();

  const [clickCounter, setClickCounter] = useState(0);
  const { renderDropDocument, uploadModal } = useProfilePicUpload();

  const dictionary = {
    huddlePublished: _t("HUDDLE.HUDDLE_PUBLISHED", "Huddle published"),
    likedYourPost: _t("TOAST.LIKED_YOUR_POST", "liked your post"),
    likedYourComment: _t("TOAST.LIKED_YOUR_COMMENT", "liked your comment"),
  };

  //const subscriptions = useSelector((state) => state.admin.subscriptions);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const sharedWsLoaded = useSelector((state) => state.workspaces.sharedWorkspacesLoaded);
  const user = useSelector((state) => state.session.user);
  const toaster = useToaster();
  const { localizeDate } = useTimeFormat();
  const workspaceActions = useWorkspaceActions();
  const refs = {
    audio: useRef(null),
    dropZoneRef: useRef(null),
  };
  const slug = uDriff.actions.getName();

  const dispatch = useDispatch();

  const {
    driffSettings: { isCompSettingsLoaded },
    chatSettings: { sound_enabled },
    generalSettings: { notifications_on, notification_sound, first_login, userCanceledProfileUpload },
  } = useSettings();

  const { generalSettings } = useSettings();

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
          });
      }
    }
  };

  const isExternal = user.type === "external";

  useEffect(() => {
    if (path === "/logout") {
      let redirectLink = `${getCurrentDriffUrl()}/logged-out`;
      window.location.href = `${getAPIUrl({ isDNS: true })}/auth-web/logout?redirect_link=${redirectLink}`;
    }
  }, [path, dispatch, history]);

  useEffect(() => {
    if (user.id && isCompSettingsLoaded) {
      displayWelcomeBanner();
    }
  }, [user, isCompSettingsLoaded]);

  useEffect(() => {
    if (refs.audio.current) {
      refs.audio.current.pause();
      refs.audio.current.load();
    }
  }, [notification_sound]);

  useEffect(() => {
    const modalTimer = setTimeout(() => {
      if (!userCanceledProfileUpload && first_login && !user.profile_image_thumbnail_link && !isExternal) {
        uploadModal(() => {
          clearTimeout(modalTimer);
        });
      }
    }, MODAL_TIMER);

    return () => {
      clearTimeout(modalTimer);
    };
  }, []);

  const handleOnActive = () => {
    dispatch(setIdleStatus(false));
  };

  const handleOnIdle = () => {
    dispatch(setIdleStatus(true));
  };

  useIdleTimer({
    timeout: 1000 * 60,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 250,
  });

  return (
    <>
      {renderDropDocument()}
      <AudioStyle ref={refs.audio} controls>
        <>
          <source src={require("../assets/audio/appointed.ogg")} type="audio/ogg" />
          <source src={require("../assets/audio/appointed.mp3")} type="audio/mpeg" />
          <source src={require("../assets/audio/appointed.m4r")} type="audio/m4r" />
        </>
        {/* {notification_sound === "jingle-bells" ? (
          <>
            <source src={require("../assets/audio/jingle-bells.ogg")} type="audio/ogg" />
            <source src={require("../assets/audio/jingle-bells.mp3")} type="audio/mpeg" />
            <source src={require("../assets/audio/jingle-bells.m4r")} type="audio/m4r" />
          </>
        ) : (
          <>
            <source src={require("../assets/audio/appointed.ogg")} type="audio/ogg" />
            <source src={require("../assets/audio/appointed.mp3")} type="audio/mpeg" />
            <source src={require("../assets/audio/appointed.m4r")} type="audio/m4r" />
          </>
        )} */}
        Your browser does not support the audio element.
      </AudioStyle>
      {showNotificationBar && mounted && <PushNotificationBar onClickAskUserPermission={onClickAskUserPermission} onClickRemindLater={onClickRemindLater} />}

      {generalSettings.impersonationMode ? <ImpersonationTopBar /> : <NotificationTopBar />}
      {mounted && <MainHeaderPanel isExternal={isExternal} />}
      {mounted && (
        <MainContent id="main">
          <Route render={(props) => <MainNavigationPanel isExternal={isExternal} {...props} showNotificationBar={showNotificationBar} />} path={["/:page"]} />
          <Switch>
            <Route render={(props) => <WorkspaceContentPanel isExternal={isExternal} {...props} />} path={["/workspace"]} />
            <Route render={(props) => <MainContentPanel {...props} isExternal={isExternal} />} path={["/:page"]} />
          </Switch>
          <MainSnoozePanel />
        </MainContent>
      )}
      <JitsiContainer />
      {/* stripe code*/}
      {/* {mounted && (
        <MainContent id="main">
          <Route render={(props) => <MainNavigationPanel isExternal={isExternal} {...props} showNotificationBar={showNotificationBar} />} path={["/:page"]} />
          {(path === "/admin-settings" || (subscriptions && subscriptions.status !== "canceled")) && (
            <Switch>
              <Route render={(props) => <WorkspaceContentPanel isExternal={isExternal} {...props} />} path={["/workspace"]} />
              <Route render={(props) => <MainContentPanel {...props} isExternal={isExternal} />} path={["/:page"]} />
            </Switch>
          )}
          {subscriptions && subscriptions.status === "canceled" && path !== "/admin-settings" && <TrialEndedPanel />}
          {subscriptions && subscriptions.status === "active" && <MainSnoozePanel />}
        </MainContent>
      )} */}
      <MobileOverlay />
      {user.id !== undefined && window[slug] !== undefined && (
        <SocketListeners dictionary={dictionary} useDriff={uDriff} localizeDate={localizeDate} toaster={toaster} soundPlay={handleSoundPlay} workspaceActions={workspaceActions} notificationsOn={notifications_on} />
      )}
      {sharedWsLoaded &&
        Object.keys(sharedWs).length > 0 &&
        Object.keys(sharedWs).map((ws) => {
          if (window[ws]) {
            return (
              <SocketListeners
                slug={ws}
                userId={sharedWs[ws].user_auth.id}
                dictionary={dictionary}
                useDriff={uDriff}
                localizeDate={localizeDate}
                toaster={toaster}
                soundPlay={handleSoundPlay}
                workspaceActions={workspaceActions}
                notificationsOn={notifications_on}
              />
            );
          } else {
            return null;
          }
        })}
    </>
  );
};

export default React.memo(MainLayout);
