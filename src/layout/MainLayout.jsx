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
  useUsers,
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
import { acceptSharedUserInvite } from "../redux/actions/userAction";
import { getSharedWorkspaces } from "../redux/actions/workspaceActions";
import { sessionService } from "redux-react-session";
import { replaceChar } from "../helpers/stringFormatter";

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
    invalidCode: _t("INVALID_INVITE_CODE", "Invite code is invalid."),
    codeAlreadyAccepted: _t("CODE_ALREADY_ACCEPTED", "Invite code already used."),
    userNotFound: _t("USER_NOT_FOUND", "User not found"),
    userAlreadyExists: _t("USER_ALREADY_EXISTS", "User already exists"),
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

  const {
    loggedUser,
    actions: { fetchById },
  } = useUsers();

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
    let invite_slug = localStorage.getItem("inviteSlug");
    let state_code = localStorage.getItem("stateCode");
    const handleAcceptInvite = (payload) => {
      dispatch(
        acceptSharedUserInvite(payload, (err, res) => {
          localStorage.removeItem("inviteSlug");
          localStorage.removeItem("stateCode");
          history.replace({ state: {} });
          if (err) {
            if (err && err.response) {
              if (err.response.data.errors) {
                let errorMessage = err.response.data.errors.error_message.includes("INVALID_CODE")
                  ? dictionary.invalidCode
                  : err.response.data.errors.error_message.includes("INVITATION_ALREADY_ACCEPTED")
                  ? dictionary.codeAlreadyAccepted
                  : err.response.data.errors.error_message.includes("INVITATION_ALREADY_ACCEPTED")
                  ? dictionary.userNotFound
                  : err.response.data.errors.error_message.includes("USER_EXISTED")
                  ? dictionary.userAlreadyExists
                  : null;
                toaster.error(errorMessage);
              }
            }
          } else {
            let redirectLink = "/dashboard";
            if (res.data.data.current_workspace) {
              redirectLink = `/shared-hub/dashboard/${res.data.data.current_workspace.id}/${replaceChar(res.data.data.current_workspace.name)}/${res.data.data.current_topic.id}/${replaceChar(res.data.data.current_topic.name)}`;
            } else {
              redirectLink = `/shared-hub/dashboard/${res.data.data.current_topic.id}/${replaceChar(res.data.data.current_topic.name)}`;
            }
            history.push(redirectLink);
            dispatch(
              getSharedWorkspaces({}, (error, response) => {
                if (error) return;
                sessionService.loadSession().then((current) => {
                  sessionService.saveSession({ ...current, sharedWorkspaces: response.data });
                });
              })
            );
          }
        })
      );
    };
    if (invite_slug && state_code) {
      let payload = {
        url: `https://${invite_slug}.${process.env.REACT_APP_apiDNSName}/api/v2/shared-workspace-invite-accept`,
        state_code: state_code,
        slug: slug,
        as_guest: false,
        email: user.email,
      };
      handleAcceptInvite(payload);
    } else if (history.location.state && history.location.state.state_code && history.location.state.invite_slug) {
      let payload = {
        url: `https://${history.location.state.invite_slug}.${process.env.REACT_APP_apiDNSName}/api/v2/shared-workspace-invite-accept`,
        state_code: history.location.state.state_code,
        slug: slug,
        as_guest: false,
        email: user.email,
      };
      handleAcceptInvite(payload);
    }
    const modalTimer = setTimeout(() => {
      fetchById(loggedUser.id, (err, res) => {
        if (err) return;
        const currentUser = res.data;
        if (!userCanceledProfileUpload && first_login && (!currentUser.profile || !currentUser.user_image) && !isExternal) {
          uploadModal(() => {
            clearTimeout(modalTimer);
          });
        }
      });
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
            <Route render={(props) => <WorkspaceContentPanel isExternal={isExternal} {...props} />} path={["/hub", "/shared-hub"]} />
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
              <Route render={(props) => <WorkspaceContentPanel isExternal={isExternal} {...props} />} path={["/hub"]} />
              <Route render={(props) => <MainContentPanel {...props} isExternal={isExternal} />} path={["/:page"]} />
            </Switch>
          )}
          {subscriptions && subscriptions.status === "canceled" && path !== "/admin-settings" && <TrialEndedPanel />}
          {subscriptions && subscriptions.status === "active" && <MainSnoozePanel />}
        </MainContent>
      )} */}
      <MobileOverlay />
      {user.id !== undefined && window.Echo && window.Echo[slug] !== undefined && (
        <SocketListeners dictionary={dictionary} useDriff={uDriff} localizeDate={localizeDate} toaster={toaster} soundPlay={handleSoundPlay} workspaceActions={workspaceActions} notificationsOn={notifications_on} sharedSlug={false} />
      )}
      {sharedWsLoaded &&
        Object.keys(sharedWs).length > 0 &&
        Object.keys(sharedWs).map((ws) => {
          if (window.Echo && window.Echo[ws] && sharedWs[ws].user_auth) {
            return (
              <SocketListeners
                key={ws}
                slug={ws}
                userId={sharedWs[ws].user_auth.id}
                dictionary={dictionary}
                useDriff={uDriff}
                localizeDate={localizeDate}
                toaster={toaster}
                soundPlay={handleSoundPlay}
                workspaceActions={workspaceActions}
                notificationsOn={notifications_on}
                sharedSlug={true}
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
