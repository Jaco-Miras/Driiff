import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {useUserLogout} from "../components/hooks";
import {ModalPanel} from "../components/panels";
import {MainContentPanel, MainHeaderPanel, MainNavigationPanel} from "../components/panels/main";
import Socket from "../components/socket/socket";
import {getAllRecipients} from "../redux/actions/globalActions";
import {getUserSettings} from "../redux/actions/settingsActions";
import {getMentions} from "../redux/actions/userAction";

const MainContent = styled.div`
`;

const MainLayout = (props) => {

    useUserLogout(props);

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        document.body.classList.remove("form-membership");
        dispatch(getUserSettings());
        dispatch(getAllRecipients());
        dispatch(getMentions());
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MainHeaderPanel/>
            <MainContent id="main">
                <MainNavigationPanel/>
                <MainContentPanel/>
            </MainContent>
            <ModalPanel/>
            {
                user.id !== undefined && <Socket/>
            }
        </>
    );
};

export default React.memo(MainLayout);