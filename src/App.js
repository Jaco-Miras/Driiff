import React, {useEffect} from "react";
import {Switch} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import {PreLoader} from "./components/panels";


import {translation} from "./helpers/stringFormatter";
import {AppRoute} from "./layout/routes";

function App() {

    useEffect(() => {

        translation.init();

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
