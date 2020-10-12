import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import styled from "styled-components";
import { useDriff, useSettings, useTranslation, useUserActions } from "./components/hooks";
import { DriffRegisterPanel, ModalPanel, PreLoader, RedirectPanel } from "./components/panels";
import { AppRoute } from "./layout/routes";
import GuestLayout from "./layout/GuestLayout";
import DriffSelectPanel from "./components/panels/DriffSelectPanel";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { isIPAddress } from "./helpers/commonFunctions";
import { checkUpdate } from "./helpers/slugHelper";

const Wrapper = styled.div`
  min-height: 100%;
  .Toastify__toast {
    border-radius: 8px;
  }
`;

function App() {

  const { logout, processBackendLogout } = useUserActions();
  const { driffSettings } = useSettings();
  const { actions: driffActions, redirected, registeredDriff, setRegisteredDriff } = useDriff();
  const location = useLocation();

  const session = useSelector((state) => state.session);

  useTranslation(session);

  useEffect(() => {
    if (!(isIPAddress(window.location.hostname) || window.location.hostname === "localhost")) {
      checkUpdate();
    }

    const handleResize = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //if there is no login possible. maintenance mode
  if (driffSettings.settings.maintenance_mode) {
    return (
      <Wrapper className="App">
        <GuestLayout setRegisteredDriff={setRegisteredDriff}/>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="App">
      <ToastContainer transition={Slide} position={"top-center"} autoClose={2000} pauseOnHover={false}/>
      <PreLoader/>
      {location.pathname === "/driff" ? (
        <DriffRegisterPanel setRegisteredDriff={setRegisteredDriff}/>
      ) : location.pathname === "/driff-register" ? (
        <Route render={() => <GuestLayout setRegisteredDriff={setRegisteredDriff}/>} path="/driff-register" exact/>
      ) : (
        <>
          {redirected === true ? (
            <RedirectPanel redirectTo={driffActions.getBaseUrl}/>
          ) : registeredDriff === null ? (
            <DriffSelectPanel/>
          ) : (
            <>
              <Switch>
                <ScrollToTop>
                  <AppRoute path="*"/>
                </ScrollToTop>
              </Switch>
            </>
          )}
        </>
      )}
      <ModalPanel/>
    </Wrapper>
  );
}

export default React.memo(App);
