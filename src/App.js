import React from "react";
import {Switch} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import {useSettings, useTranslation} from "./components/hooks";
import {PreLoader} from "./components/panels";
import {AppRoute} from "./layout/routes";

function App() {

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
