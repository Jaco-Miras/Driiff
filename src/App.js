import React, {useEffect} from "react";
import {Switch} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import {useDriff} from "./components/hooks";
import {DriffRegisterPanel, PreLoader, RedirectPanel} from "./components/panels";
import {AppRoute} from "./layout/routes";

function App() {

    const {setDriff, checkDriffName, redirected, registeredDriff, getRedirect} = useDriff();

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

    if (redirected === null) {
        return <></>;
    }

    return (
        <div className="App">
            {
                redirected === true ?
                <RedirectPanel redirect={getRedirect}/>
                                    :
                registeredDriff === null ?
                <DriffRegisterPanel setDriff={setDriff} checkDriffName={checkDriffName}/>
                                         :
                <>
                    <PreLoader/>
                    <Switch>
                        <ScrollToTop>
                            <AppRoute path="*"/>
                        </ScrollToTop>
                    </Switch>
                </>
            }
        </div>
    );
}

export default React.memo(App);
