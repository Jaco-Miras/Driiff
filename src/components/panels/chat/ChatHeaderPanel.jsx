import React from "react";
//import {useSelector} from "react-redux";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const Typing = styled.div`
    opacity: ${props => props.isTyping ? "1" : 0};
`;

const ChatHeaderPanel = (props) => {

    const {className = ""} = props;

    //const chatChannel = useSelector(state => state.chat.selectedChannel);
    const chatChannel = {
        title: "Orelie Rockhall",
        typing: false,
        channel_image_link: `https://24.driff.online/user-profile/38?timestamp=1589155257`,
    };

    return (
        <Wrapper className={`chat-header border-bottom ${className}`}>
            <div className="d-flex align-items-center">
                <div className="pr-3">
                    <div className="avatar avatar-sm avatar-state-success">
                        <img src={chatChannel.channel_image_link} className="rounded-circle"
                             alt="fpo-placeholder"/>
                    </div>
                </div>
                <div>
                    <h6 className="mb-1">{chatChannel.title}</h6>
                    <Typing isTyping={chatChannel.typing} className="m-0 small text-success">typing...</Typing>
                </div>
                <div className="ml-auto">
                    <ul className="nav align-items-center">
                        <li className="mr-4 d-sm-inline d-none">
                            <a href="/" title="" data-toggle="tooltip"
                               data-original-title="Start Video Call">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                     className="feather feather-video width-18 height-18">
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </a>
                        </li>
                        <li className="mr-4 d-sm-inline d-none">
                            <a href="/" title="" data-toggle="tooltip"
                               data-original-title="Start Voice Call">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                     className="feather feather-phone-call width-18 height-18">
                                    <path
                                        d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </a>
                        </li>
                        <li className="d-sm-inline d-none">
                            <a href="/" title="" data-toggle="tooltip"
                               data-original-title="Add to Contact">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                     className="feather feather-user-plus width-18 height-18">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                            </a>
                        </li>
                        <li className="ml-4 mobile-chat-close-btn">
                            <a href="/" className="btn btn-sm btn-danger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                     className="feather feather-x width-18 height-18">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatHeaderPanel);