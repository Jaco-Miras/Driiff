import React, { useEffect } from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import styled from "styled-components";
import { useDriff, useSettings, useTranslation } from "./components/hooks";
import { DriffRegisterPanel, ModalPanel, PreLoader, RedirectPanel } from "./components/panels";
import { AppRoute } from "./layout/routes";
import GuestLayout from "./layout/GuestLayout";
import DriffSelectPanel from "./components/panels/DriffSelectPanel";
import { Slide, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { isIPAddress } from "./helpers/commonFunctions";
import ProfileSlider from "./components/common/ProfileSlider";
import { CSSTransition } from "react-transition-group";
import { setProfileSlider } from "./redux/actions/globalActions";

import "react-toastify/dist/ReactToastify.css";
import { imgAsLogin } from "./helpers/slugHelper";
import { sessionService } from "redux-react-session";

const Wrapper = styled.div`
  min-height: 100%;
  .Toastify__toast {
    border-radius: 8px;
  }
  /* slide enter */
  .mobile-slide-enter,
  .mobile-slide-appear {
    opacity: 0;
    transform: scale(0.97) translateY(200px);
    z-index: 1;
  }
  .mobile-slide-enter.mobile-slide-enter-active,
  .mobile-slide-appear.mobile-slide-appear-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: opacity 300ms linear 100ms, transform 300ms ease-in-out 100ms;
  }

  /* slide exit */
  .mobile-slide-exit {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .mobile-slide-exit.mobile-slide-exit-active {
    opacity: 0;
    transform: scale(0.97) translateY(5px);
    transition: opacity 150ms linear, transform 150ms ease-out;
  }
  .mobile-slide-exit-done {
    opacity: 0;
  }
`;

function App() {
  const { driffSettings } = useSettings();
  const { actions: driffActions, redirected, registeredDriff, setRegisteredDriff } = useDriff();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { profileSlider: userProfile } = useSelector((state) => state.users);

  //const session = useSelector((state) => state.session);
  // const [initUserSnap, setInitUserSnap] = useState(null);

  useTranslation();

  // const userSnap = () => {
  //   setInitUserSnap(session.authenticated);
  //   window.onUsersnapCXLoad = function (api) {
  //     if (session.authenticated) {
  //       api.init({
  //         user: {
  //           user_id: session.user.id,
  //           email: session.user.email,
  //         },
  //       });
  //     } else {
  //       api.init();
  //     }
  //     api.show("8f191889-6f0c-4879-ac3a-8760bc45e0f2");
  //   };
  // };

  // useEffect(() => {
  //   if (!(isIPAddress(window.location.hostname) || window.location.hostname === "localhost") && session.checked && initUserSnap !== session.authenticated) {
  //     //userSnap();
  //   }
  // }, [session]);

  useEffect(() => {
    if (location.pathname === "/force-logout") {
      sessionService.deleteSession().then(() => {
        sessionService.deleteUser();
        history.push("/login");
      });
    }
    if (!(isIPAddress(window.location.hostname) || window.location.hostname === "localhost")) {
      driffActions.checkUpdateVersion();
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

  const handleShowSlider = () => {
    dispatch(setProfileSlider({ id: null }));
  };

  //if there is no login possible. maintenance mode
  if (driffSettings.settings.maintenance_mode) {
    return (
      <Wrapper className="App">
        <GuestLayout setRegisteredDriff={setRegisteredDriff} />
      </Wrapper>
    );
  }

  return (
    <Wrapper className="App">
      {imgAsLogin()}
      <ToastContainer transition={Slide} position={"top-center"} autoClose={2000} pauseOnHover={false} draggable={false} pauseOnFocusLoss={false} />
      <PreLoader />
      {location.pathname === "/driff" ? (
        <DriffRegisterPanel setRegisteredDriff={setRegisteredDriff} />
      ) : location.pathname === "/driff-register" ? (
        <Route render={() => <GuestLayout setRegisteredDriff={setRegisteredDriff} />} path="/driff-register" exact />
      ) : (
        <>
          {redirected === true ? (
            <RedirectPanel redirectTo={driffActions.getBaseUrl} />
          ) : registeredDriff === null ? (
            <DriffSelectPanel />
          ) : (
            <>
              <Switch>
                <ScrollToTop>
                  <AppRoute path="*" />
                </ScrollToTop>
              </Switch>
            </>
          )}
        </>
      )}
      {userProfile && (
        <CSSTransition appear in={userProfile !== null || userProfile !== undefined} timeout={300} classNames="mobile-slide">
          <ProfileSlider profile={userProfile} onShowPopup={handleShowSlider} classNames={"mobile"} />
        </CSSTransition>
      )}
      <ModalPanel />
    </Wrapper>
  );
}

export default React.memo(App);
