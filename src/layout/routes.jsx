import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import {useSettings} from "../components/hooks";
import {TestChat} from "../components/test";
import TestFiles from "../components/test/TestFiles";
import GuestLayout from "./GuestLayout";
import MainLayout from "./MainLayout";

export const AppRoute = ({children, ...props}) => {
  const {init: settingsInit, fetch, fetchUserSettings, userSettings, driffSettings} = useSettings();
  settingsInit();

  // const push = usePushNotification();
  const history = useHistory();
  const session = useSelector((state) => state.session);
  const i18nLoaded = useSelector((state) => state.global.i18nLoaded);

  useEffect(() => {
    if (session.checked) {
      if (session.authenticated) {
        fetch();
        fetchUserSettings();
      }
    }
  }, [session.checked, session.authenticated, fetchUserSettings, driffSettings.isSettingsLoaded]);

  // if (!session.checked || !i18nLoaded || push.loading)
  if (!session.checked || !i18nLoaded) return null;

  if (session.authenticated && !userSettings.isLoaded) return null;

  return session.authenticated ? (
    <>
      <Switch>
        <Route {...props} component={GuestLayout} path="/logged-out"
               exact={true}/>
        <Route {...props} component={TestFiles} path={["/test/files/workspace/:workspaceId"]}>
          {children}
        </Route>
        <Route {...props} component={TestChat} path={["/test/chat"]}>
          {children}
        </Route>
        <Route {...props} component={MainLayout}
               path={["/notifications", "/profile", "/dashboard", "/posts", "/chat", "/files", "/people", "/search", "/settings", "/system/people", "/todos"]}>
          {children}
        </Route>
        <Route {...props} component={MainLayout} path={["/workspace/chat", "/workspace/:page"]}>
          {children}
        </Route>
        <Redirect
          path="*"
          to={{
            pathname: "/chat",
            state: {from: history.location},
          }}
        />
      </Switch>
    </>
  ) : (
    <Switch>
      <Route {...props} component={GuestLayout}
             path={["/driff-register", "/register", "/magic-link", "/resetpassword/:token/:email",
               "/reset-password", "/login", "/authenticate/:token/:returnUrl?", "/request-form", "/magic-link/:token"]}
             exact>
        {children}
      </Route>
      <Redirect
        from="*"
        to={{
          pathname: "/login",
          state: {from: history.location},
        }}
      />
    </Switch>
  );
};
