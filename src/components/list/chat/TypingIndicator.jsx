import React from 'react';
import styled from 'styled-components'
import Avatar from '../icons/Avatar'

const TypingDiv = styled.div`
    margin-left: 25px;
`;
const TypingContainer = styled.div`
    display: inline-flex;
    align-items: center;
    width: 100%;
    padding-left: 20px;

    >div:nth-child(2){
        margin-left: ${props => props.users === 2 ? '0px' : props.users > 2 ? '-8px' : '15px'};
    }
`;
const PlusUsersDiv = styled.div`
    border-radius: 50%;
    min-width: 30px;
    min-height: 30px;
    width: 30px;
    height: 30px;
    background: #fff;
    color: #972c86;
    box-shadow: 0 2px 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    z-index: -3;
    text-align: center;
`;
const TypingIndicator = props => {

    const {usersTyping} = props;

    return (
        <TypingContainer users={usersTyping.length} className='component-chat-indicator'>
            {
                usersTyping.length > 2 ?
                    <PlusUsersDiv>{`${usersTyping.length - 2}+`}</PlusUsersDiv>
                    : null
            }
            {
                usersTyping.map((u, k) => {
                    if (k <= 1) {
                        return (
                            <Avatar
                                key={u.id}
                                size={'xs'}
                                marginRight={-10}
                                underZindex={(0 - k)}
                                profileImageLink={u.profile_image_link}
                                id={u.id}
                                //push={push}
                                noClick={true}
                                name={u.name}
                                partialName={u.partial_name}
                                //className={borderColor}
                            />
                        )
                    } else return null

                })
            }
            <TypingDiv className={'typing-indicator'}>
                <span></span>
                <span></span>
                <span></span>
            </TypingDiv>
        </TypingContainer>
    )
};
export default React.memo(TypingIndicator);