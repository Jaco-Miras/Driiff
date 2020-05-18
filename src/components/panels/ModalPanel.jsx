import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {ConfirmationModal, ChatForwardModal, ChatReminderModal} from "../modals";

const ModalPanelContainer = styled.div`
    // z-index: 7;
    // height: 100%;
    // width: 100%;
    // position: fixed;
    // top: 0;
    // left: 0;
`;

const ModalPanel = props => {

    const modals = useSelector(state => state.global.modals);

    if (Object.keys(modals).length > 0) {
        return (
            <ModalPanelContainer>
                {
                    Object.values(modals).map(modal => {
                        switch (modal.type) {
                            case "confirmation":
                                return <ConfirmationModal key={modal.type} data={modal}/>;
                            case "forward":
                                return <ChatForwardModal key={modal.type} data={modal}/>;
                            case "reminder":
                                return <ChatReminderModal key={modal.type} data={modal}/>;
                            default:
                                return null;
                        }
                    })
                }

            </ModalPanelContainer>
        );
    } else {
        return null;
    }
};

export default React.memo(ModalPanel);