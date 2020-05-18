import React, {useRef} from "react";
import styled from "styled-components";
import {Avatar} from "../common";
import {useOutsideClick} from "../hooks";

const UserListPopUpContainer = styled.div`
    ul {
        margin: 0;
        list-style: none;
        padding: 10px;
        background-color: #FAFAFA;
        color: #4d4d4d;
        box-shadow: 0 0 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        z-index:5;
        overflow: auto;
    }
    li{
        white-space: nowrap;
        font-size: 1rem;
        margin-bottom: 10px;
        border-bottom: 1px solid #dedede;
        display: inline-flex;
        align-items:center;
        width: 100%;
        cursor: pointer;
        padding-bottom: 5px;
        
        span {
            font-weight: 400;
        }
        
        &:hover {            
            span {            
                color: #972c86;
                text-decoration: underline;
            }
        }
        &:last-child {
            border: none;
            padding: 0;
            margin: 0;
        }
    }
    .ico-avatar {
        margin-right: 10px;
    }
    div.ico-avatar img{
        width: 100%;
        height: 100%;
    }
    span{
        font-weight: 600;
        color: #676767;
    }
`;

const UserListPopUp = props => {
    const {users, className, onShowList} = props;
    const listRef = useRef();
    const handleShowList = () => {
        if (onShowList) onShowList();
    };
    useOutsideClick(listRef, handleShowList, true);
    return (
        <UserListPopUpContainer className={className} ref={listRef}>
            <ul>
                {
                    users.map((u, k) => {
                        return (
                            <li key={k}>
                                <Avatar
                                    size={"xs"}
                                    profileImageLink={u.profile_image_link}
                                    id={u.id}
                                    name={u.name}
                                    partialName={u.partial_name}
                                    noClick={true}
                                />
                                <span>{u.name}</span>
                            </li>
                        );
                    })
                }
            </ul>
        </UserListPopUpContainer>
    );
};

export default UserListPopUp;