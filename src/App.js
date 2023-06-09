import React, { useEffect, lazy, Suspense } from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import styled from "styled-components";
import { useDriff, useSettings, useTranslation } from "./components/hooks";
import { DriffRegisterPanel, PreLoader, RedirectPanel } from "./components/panels";
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
import { DriffUpdateModal } from "./components/modals";
import { ThemeProvider } from "styled-components";
import AppWrapper from "./AppWrapper";
import { clearApiError } from "./redux/actions/settingsActions";
const FileViewer = lazy(() => import("./components/common/FileViewer"));
const ModalPanel = lazy(() => import("./components/panels/ModalPanel"));

const ModalPanelContainer = styled.div`
  z-index: 7;
`;

function App() {
  const { driffSettings } = useSettings();
  const { actions: driffActions, redirected, registeredDriff, setRegisteredDriff } = useDriff();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector((state) => state.users.profileSlider);
  const modals = useSelector((state) => state.global.modals);
  const viewFiles = useSelector((state) => state.files.viewFiles);
  const showNewDriffBar = useSelector((state) => state.global.newDriffData.showNewDriffBar);
  const theme = useSelector((state) => state.settings.driff.theme);
  const faviconImg = useSelector((state) => state.settings.driff.favicon);
  const driffErrors = useSelector((state) => state.settings.driffErrors);
  // const primarycolor = "#29323F"; //primary blue //#a903fc to check if  color changes
  // const secondarycolor = "#4E5D72";
  // const thirdcolor = "#4E5D72"; //lighter blue
  // const fourthcolor = "#192536"; //dark top header blue
  // const fifthcolor = "#FFC856"; //yellow

  // const theme = {
  //   colors: {
  //     primary: primarycolor,
  //     secondary: secondarycolor,
  //     third: thirdcolor,
  //     fourth: fourthcolor,
  //     fifth: fifthcolor,
  //   },
  // };

  //useHuddleNotification();

  useTranslation();
  useEffect(() => {
    if (driffErrors) {
      if (Object.values(driffErrors).length >= 2) {
        const lastIndex = Object.values(driffErrors).length;
        if (Object.values(driffErrors)[lastIndex - 1] - Object.values(driffErrors)[0] < 10) {
          // if errors is within 10 seconds
          //window.location.href = "https://offline.getdriff.com/";
        } else {
          //clear driff error
          dispatch(clearApiError());
        }
      }
    }
  }, [driffErrors]);

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

  useEffect(() => {
    if (faviconImg) {
      const favicon = document.getElementById("favicon");
      favicon.href = faviconImg;
    }
  }, [faviconImg]);

  const handleShowSlider = () => {
    dispatch(setProfileSlider({ id: null }));
  };

  //if there is no login possible. maintenance mode
  if (driffSettings.settings.maintenance_mode) {
    return (
      <AppWrapper className="App">
        <GuestLayout setRegisteredDriff={setRegisteredDriff} />
      </AppWrapper>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper className="App">
        {imgAsLogin()}
        <ToastContainer className="top-toaster" enableMultiContainer containerId={"toastA"} transition={Slide} position={"top-center"} autoClose={3000} pauseOnHover={false} draggable={false} pauseOnFocusLoss={false} />
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
        {Object.keys(modals).length > 0 && (
          <Suspense fallback={<div></div>}>
            <ModalPanel />
          </Suspense>
        )}
        {viewFiles !== null && (
          <Suspense fallback={<div></div>}>
            <ModalPanelContainer>
              <FileViewer />
            </ModalPanelContainer>
          </Suspense>
        )}
        {showNewDriffBar && <DriffUpdateModal />}
        <div id="meetingSDKElement"></div>
      </AppWrapper>
    </ThemeProvider>
  );
}

export default React.memo(App);
