import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import useUserLogout from "../components/hooks/useUserLogout";
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


    useEffect(() => {
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
            <Socket/>
        </>
    );
};

export default React.memo(MainLayout);