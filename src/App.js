import React from "react";
import {Switch} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import {useTranslation} from "./components/hooks";
import {PreLoader} from "./components/panels";
import {AppRoute} from "./layout/routes";

function App() {

    useTranslation();

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
