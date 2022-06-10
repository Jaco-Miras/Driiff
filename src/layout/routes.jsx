import React, { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useSettings } from "../components/hooks";
// import { TestChat } from "../components/test";
// import TestFiles from "../components/test/TestFiles";
//import GuestLayout from "./GuestLayout";
//import MainLayout from "./MainLayout";
import { addUserToReducers } from "../redux/actions/globalActions";
import { $_GET } from "../helpers/commonFunctions";

const MainLayout = lazy(() => import("./MainLayout"));
const GuestLayout = lazy(() => import("./GuestLayout"));

export const AppRoute = ({ children, ...props }) => {
  const { init: settingsInit, fetch, fetchUserSettings, userSettings, driffSettings } = useSettings();
  settingsInit();

  const dispatch = useDispatch();
  // const push = usePushNotification();
  const history = useHistory();
  const session = useSelector((state) => state.session);
  //const i18nLoaded = useSelector((state) => state.global.i18nLoaded);

  useEffect(() => {
    if ($_GET("state_code") && $_GET("invite_slug")) {
      const state_code = $_GET("state_code");
      const invite_slug = $_GET("invite_slug");
      localStorage.setItem("stateCode", state_code);
      localStorage.setItem("inviteSlug", invite_slug);
      history.replace({ state: { state_code: $_GET("state_code"), invite_slug: $_GET("invite_slug") } });
    }
  }, []);

  useEffect(() => {
    if (session.checked) {
      if (session.authenticated) {
        fetch();
        fetchUserSettings();
      }
    }
  }, [session.checked, session.authenticated, fetchUserSettings, driffSettings.isSettingsLoaded]);

  useEffect(() => {
    if (session.user.id) {
      dispatch(
        addUserToReducers({
          id: session.user.id,
          name: session.user.name,
          partial_name: session.user.partial_name,
          profile_image_link: session.user.profile_image_thumbnail_link ? session.user.profile_image_thumbnail_link : session.user.profile_image_link,
          type: session.user.type,
        })
      );
    }
  }, [session.user]);

  // if (!session.checked || !i18nLoaded || push.loading)
  //if (!session.checked || !i18nLoaded) return null;
  if (!session.checked) return null;
  if (session.authenticated && !userSettings.isLoaded) return null;

  return session.authenticated ? (
    <>
      <Suspense fallback={<div></div>}>
        <Switch>
          <Route {...props} component={GuestLayout} path={["/logged-out", "/force-logout"]} exact={true} />
          {/* <Route {...props} component={TestFiles} path={["/test/files/workspace/:workspaceId"]}>
            {children}
          </Route>
          <Route {...props} component={TestChat} path={["/test/chat"]}>
            {children}
          </Route> */}
          <Route {...props} component={MainLayout} path={["/notifications", "/profile", "/dashboard", "/posts", "/chat", "/files", "/people", "/search", "/settings", "/system/people", "/todos", "/releases", "/admin-settings"]}>
            {children}
          </Route>
          <Route {...props} component={MainLayout} path={["/workspace/chat", "/workspace/:page", "/magic-link/:token", "/shared-workspace/chat", "/shared-workspace/:page"]}>
            {children}
          </Route>
          <Redirect
            path="*"
            to={{
              pathname: session.user.type === "external" ? "/workspace/search" : "/dashboard",
              state: {
                from: history.location,
                state_code: history.location.state && history.location.state.state_code ? history.location.state.state_code : null,
                invite_slug: history.location.state && history.location.state.invite_slug ? history.location.state.invite_slug : null,
              },
            }}
          />
        </Switch>
      </Suspense>
    </>
  ) : (
    <Suspense fallback={<div></div>}>
      <Switch>
        <Route
          {...props}
          component={GuestLayout}
          path={[
            "/driff-register",
            "/register",
            "/magic-link",
            "/resetpassword/:token/:email",
            "/reset-password",
            "/login",
            "/authenticate/:token/:returnUrl?",
            "/request-form",
            "/magic-link/:token",
            "/authenticate-ios/:tokens",
            "/shared-workspace-invite",
          ]}
          exact
        >
          {children}
        </Route>
        <Redirect
          from="*"
          to={{
            pathname: "/login",
            state: { from: history.location },
          }}
        />
      </Switch>
    </Suspense>
  );
};
