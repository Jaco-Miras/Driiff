import React, {useEffect} from "react";
import {Route, Switch, useLocation} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import styled from "styled-components";
import {useDriff} from "./components/hooks";
import {DriffRegisterPanel, ModalPanel, PreLoader, RedirectPanel} from "./components/panels";
import {AppRoute} from "./layout/routes";
import GuestLayout from "./layout/GuestLayout";

const Wrapper = styled.div`
  min-height: 100%;
`;

function App() {
  const {actions: driffActions, redirected, registeredDriff, setRegisteredDriff} = useDriff();
  const location = useLocation();

  useEffect(() => {
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

  return (
    <Wrapper className="App">
      <PreLoader/>
      {
        location.pathname === "/driff-register" ?
          <Route component={GuestLayout} path="/driff-register" exact/>
          :
          <>
            {
              redirected === true ? (
                  <RedirectPanel redirectTo={driffActions.getBaseUrl}/>
                )
                : registeredDriff === null ? (
                  <DriffRegisterPanel setRegisteredDriff={setRegisteredDriff}/>
                )
                : (
                  <>
                    <Switch>
                      <ScrollToTop>
                        <AppRoute path="*"/>
                      </ScrollToTop>
                    </Switch>
                  </>
                )}
          </>
      }
      <ModalPanel/>
    </Wrapper>
  );
}

export default React.memo(App);
