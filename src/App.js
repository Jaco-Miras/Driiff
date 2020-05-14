import React from "react";
import {useSelector} from "react-redux";
import {Switch} from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import PreLoader from "./components/panels/Preloader";
import {AppRoute} from "./layout/routes";

function App() {

    const session = useSelector(state => state.session);

    return (
        <div className="App">
            {
                session.checked === true &&
                <>
                    <PreLoader/>
                    <Switch>
                        <ScrollToTop>
                            <AppRoute path="*" authenticated={session.authenticated}/>
                        </ScrollToTop>
                    </Switch>
                </>
            }
        </div>
    );
}

export default React.memo(App);
