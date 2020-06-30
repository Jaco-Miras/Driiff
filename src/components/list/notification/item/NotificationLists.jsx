import React from "react";
import styled from "styled-components";
import {NotificationListItem} from "./index";

const Wrapper = styled.ul`
    overflow: auto;
    
    &.list-group {
        max-height: 390px !important;
    } 
`;

const NotificationLists = props => {

    const {notifications, actions, history} = props;

    if (Object.keys(notifications).length === 0)
        return null;

    return (
        <Wrapper className={`list-group list-group-flush`}>
            {
                Object.values(notifications).filter(n => n.is_read === 0).length > 0 &&
                <>
                    <li className="text-divider small pb-2 pl-3 pt-3">
                        <span>New</span>
                    </li>
                    {
                        Object.values(notifications).filter(n => n.is_read === 0).map(n => {
                            return <NotificationListItem key={n.id} notification={n} actions={actions} history={history}/>
                        })
                    }
                </>
                
            }
            {
                Object.values(notifications).filter(n => n.is_read === 1).length > 0 &&
                <>
                    <li className="text-divider small pb-2 pl-3 pt-3">
                        <span>Old notifications</span>
                    </li>
                    {
                        Object.values(notifications).filter(n => n.is_read === 1).map(n => {
                            return <NotificationListItem key={n.id} notification={n} actions={actions} history={history}/>
                        })
                    }
                </>
            }
        </Wrapper>
    )
};

export default NotificationLists;