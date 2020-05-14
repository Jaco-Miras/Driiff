import React from "react";
import {useSelector} from "react-redux";
import {Switch} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import PreLoader from "./components/panels/Preloader";
import {AppRoute} from "./layout/routes";

function App() {

    const authenticated = useSelector(state => state.session.authenticated);

    return (
        <div className="App">
            {
                <>
                    <PreLoader/>
                    <Switch>
                        <ScrollToTop>
                            <AppRoute path="*" authenticated={authenticated}/>
                        </ScrollToTop>
                    </Switch>
                </>
            }
        </div>
    );
}

export default React.memo(App);
