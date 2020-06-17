import React, {useEffect} from "react";
import {Switch} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import {useDriff} from "./components/hooks";
import {DriffRegisterPanel, PreLoader, RedirectPanel} from "./components/panels";
import {AppRoute} from "./layout/routes";

function App() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    useTranslation();
    useSettings();

    return (
        <div className="App">
            <PreLoader/>
            <Switch>
                <ScrollToTop>
                    <AppRoute path="*"/>
                </ScrollToTop>
            </Switch>
        </div>
    );
}

export default React.memo(App);
