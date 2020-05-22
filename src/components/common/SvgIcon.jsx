import React from "react";
import styled from "styled-components";

const Svg = styled.svg`
    ${props => typeof props.rotate !== "undefined" && `transform: rotate(${props.rotate}deg);`};
`;

export const SvgIconFeather = React.memo(React.forwardRef((props, ref) => {
    const {
        className = "",
        width = 24,
        height = 24,
        viewBox = "0 0 24 24",
        fill = "none",
        stroke = "currentColor",
        strokeWidth = "1",
        strokeLinecap = "round",
        strokeLinejoin = "round",
        icon,
        ...rest
    } = props;

    let content = "";

    switch (icon) {
        case "user-plus":
            content = <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
            </>;
            break;
        case "user":
            content = <>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </>;
            break;
        case "users":
            content = <>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </>;
            break;
        case "eye":
            content = <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </>;
            break;
        case "eye-off":
            content = <>
                <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </>;
            break;
        case "star":
            content = <>
                <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </>;
            break;
        case "volume-x":
            content = <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            </>;
            break;
        case "volume-2":
            content = <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </>;
            break;
        case "volume":
            content = <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            </>;
            break;
        case "menu":
            content = <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </>;
            break;
        case "corner-up-right":
            content = <>
                <polyline points="15 14 20 9 15 4"></polyline>
                <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
            </>;
            break;
        case "arrow-left":
            content = <>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </>;
            break;
        case "download":
            content = <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </>;
            break;
        case "start":
            content = <>
                <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </>;
            break;
        case "mail":
            content = <>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </>;
            break;
        case "database":
            content = <>
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </>;
            break;
        case "refresh-ccw":
            content = <>
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </>;
            break;
        case "refresh-cw":
            content = <>
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </>;
            break;
        case "share":
            content = <>
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </>;
            break;
        case "link":
            content = <>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </>;
            break;
        case "play":
            content = <>
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </>;
            break;
        case "plus":
            content = <>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </>;
            break;
        case "x":
            content = <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </>;
            break;
        case "trash":
            content = <>
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </>;
            break;
        case "trash-2":
            content = <>
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </>;
            break;
        case "edit":
            content = <>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </>;
            break;
        case "edit-2":
            content = <>
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </>;
            break;
        case "edit-3":
            content = <>
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </>;
            break;
        case "search":
            content = <>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </>;

            break;
        case "image":
            content = <>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </>;
            break;
        case "video":
            content = <>
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </>;
            break;
        case "video-off":
            content = <>
                <path
                    d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </>;
            break;
        case "smile":
            content = <>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </>;
            break;
        case "paperclip":
            content = <>
                <path
                    d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </>;
            break;
        case "send":
            content = <>
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </>;
            break;
        case "file":
            content = <>
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </>;
            break;
        case "bell":
            content = <>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </>;
            break;
        case "bar-chart-2":
            content = <>
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </>;
            break;
        case "command":
            content = <>
                <path
                    d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </>;
            break;
        case "message-square":
            content = <>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </>;
            break;
        case "message-circle":
            content = <>
                <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </>;
            break;
        case "settings":
            content = <>
                <circle cx="12" cy="12" r="3"></circle>
                <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </>;
            break;
        case "log-out":
            content = <>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </>;
            break;
        case "more-horizontal":
            content = <>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
            </>;
            break;
        case "more-vertical":
            content = <>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
            </>;
            break;
        case "archive":
            content = <>
                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                <rect x="1" y="3" width="22" height="5"></rect>
                <line x1="10" y1="12" x2="14" y2="12"></line>
            </>;
            break;
        default:
            console.log(`${icon} not found`);
    }

    return (
        <Svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox} fill={fill}
             stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}
             className={`feather feather-${icon} ${className}`}
             {...rest}>
            {content}
        </Svg>
    );
}));

export const SvgIcon = React.memo(React.forwardRef((props, ref) => {
    const {
        className = "",
        width = 24,
        height = 24,
        fill = "none",
        stroke = "currentColor",
        strokeWidth = "1",
        strokeLinecap = "round",
        strokeLinejoin = "round",
        icon,
        ...rest
    } = props;

    let content = "";
    let viewBox = "";

    switch (icon) {
        case "archive":
            viewBox = "0 0 48 48";
            content = <>
                <defs>
                    <linearGradient x1="0%" y1="7.77940102%" x2="100%" y2="92.220599%" id="linearGradient-1">
                        <stop stop-color="#972C86" offset="0%"></stop>
                        <stop stop-color="#794997" offset="40%"></stop>
                        <stop stop-color="#007180" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <g id="_icon/archive/l/active" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <path
                        d="M39,20.5 C39.7796961,20.5 40.4204487,21.0948881 40.4931334,21.85554 L40.5,22 L40.5,37.4285714 C40.5,39.5999931 38.8250623,41.3885867 36.7004613,41.4949924 L36.5,41.5 L11.5,41.5 C9.3484916,41.5 7.6083567,39.777207 7.50486965,37.630981 L7.5,37.4285714 L7.5,22 C7.5,21.1715729 8.17157288,20.5 9,20.5 C9.77969612,20.5 10.4204487,21.0948881 10.4931334,21.85554 L10.5,22 L10.5,37.4285714 C10.5,37.9895449 10.8983759,38.4367012 11.3927122,38.4938289 L11.5,38.5 L36.5,38.5 C37.006502,38.5 37.4386447,38.0902419 37.4940126,37.5469373 L37.5,37.4285714 L37.5,22 C37.5,21.1715729 38.1715729,20.5 39,20.5 Z M29.5,22 C30.8807119,22 32,23.1192881 32,24.5 C32,25.8807119 30.8807119,27 29.5,27 L18.5,27 C17.1192881,27 16,25.8807119 16,24.5 C16,23.1192881 17.1192881,22 18.5,22 L29.5,22 Z M38.6,7.5 C40.7539105,7.5 42.5,9.24608948 42.5,11.4 L42.5,11.4 L42.5,14.6 C42.5,16.7539105 40.7539105,18.5 38.6,18.5 L38.6,18.5 L9.4,18.5 C7.24608948,18.5 5.5,16.7539105 5.5,14.6 L5.5,14.6 L5.5,11.4 C5.5,9.24608948 7.24608948,7.5 9.4,7.5 L9.4,7.5 Z M38.6,10.5 L9.4,10.5 C8.90294373,10.5 8.5,10.9029437 8.5,11.4 L8.5,11.4 L8.5,14.6 C8.5,15.0970563 8.90294373,15.5 9.4,15.5 L9.4,15.5 L38.6,15.5 C39.0970563,15.5 39.5,15.0970563 39.5,14.6 L39.5,14.6 L39.5,11.4 C39.5,10.9029437 39.0970563,10.5 38.6,10.5 L38.6,10.5 Z"
                        id="Combined-Shape" fill="url(#linearGradient-1)" fill-rule="nonzero"></path>
                </g>
            </>;
            break;
        case "reply":
            viewBox = "0 0 41 31";
            content = <>
                <defs>
                    <linearGradient x1="-1.11022302e-14%" y1="1.72254642e-14%" x2="100%" y2="100%"
                                    id="linearGradient-1">
                        <stop stop-color="#972C86" offset="0%"></stop>
                        <stop stop-color="#794997" offset="40%"></stop>
                        <stop stop-color="#007180" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <g id="E---Notifications" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="E1---01a-Notifications---Overview" transform="translate(-42.000000, -1381.000000)"
                       fill="url(#linearGradient-1)" fill-rule="nonzero">
                        <g id="Group-13" transform="translate(20.000000, 1364.000000)">
                            <g id="Group-24-Copy-3" transform="translate(11.000000, 0.000000)">
                                <g id="_icon/reply/l/active" transform="translate(8.000000, 9.000000)">
                                    <path
                                        d="M20.5,37 C20.5,38.309747 18.9390974,38.990409 17.9793234,38.0991902 L3.97932335,25.0991902 C3.35630446,24.5206727 3.3381597,23.54052 3.93933983,22.9393398 L17.9393398,8.93933983 C18.8842871,7.99439254 20.5,8.66364272 20.5,10 L20.5,19.3691406 C20.5,20.1975677 19.8284271,20.8691406 19,20.8691406 C18.1715729,20.8691406 17.5,20.1975677 17.5,19.3691406 L17.5,13.6213203 L7.16133128,23.9599891 L17.5,33.5601814 L17.5,24.5 C17.5,23.6715729 18.1715729,23 19,23 L34.2221177,23 C39.3466003,23 43.5008143,27.154214 43.5008143,32.2786967 C43.5008143,32.6274968 43.4811465,32.9760194 43.4419044,33.322605 C43.3487014,34.1457725 42.6058364,34.7375257 41.7826689,34.6443227 C40.9595014,34.5511198 40.3677483,33.8082547 40.4609512,32.9850873 C40.4875055,32.7505601 40.5008143,32.5147223 40.5008143,32.2786967 C40.5008143,28.8110682 37.6897461,26 34.2221177,26 L20.5,26 L20.5,37 Z"
                                        id="Path"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </>;
            break;
        case "image-video":
            viewBox = "0 0 24 24";
            content = <>
                <g id="_icon/image/r/secundary" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <polyline id="Rectangle" stroke="#972C86" stroke-width="2" strokeLinecap="round"
                              stroke-linejoin="round"
                              points="22 20 2 20 2 5 22 5 22 16 16.0291414 10 11.0499567 15 8.05828278 13 5 15.0710678"></polyline>
                    <circle id="Oval-2" fill="#972C86" cx="7" cy="9" r="1.5"></circle>
                </g>
            </>;
            break;
        case "pin":
            viewBox = "0 0 24 24";
            content = <>
                <g id="_icon/pin/r/secundary" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                   strokeLinecap="round"
                   stroke-linejoin="round">
                    <path
                        d="M15.7692308,8.70635677 C18.2871227,9.7169252 20,11.7084386 20,14 L4,14 C4,11.7084386 5.71287732,9.7169252 8.23076923,8.70635677 L8.23076923,2 L15.7692308,2 L15.7692308,8.70635677 Z"
                        id="Combined-Shape" stroke="#972C86" stroke-width="2"></path>
                    <path d="M10.5,17.4019238 L13.5,22.5980762" id="Line-2" stroke="#972C86" stroke-width="2"
                          transform="translate(12.000000, 20.000000) rotate(30.000000) translate(-12.000000, -20.000000) "></path>
                </g>
            </>;
            break;
        case "mute":
            viewBox = "0 0 24 24";
            content = <>
                <path
                    d="M6.092 15H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4l5.293-5.293A1 1 0 0 1 16 4.414V6.5m0 5.5v7.558a1 1 0 0 1-1.713.701l-4.04-4.104"/>
                <path d="M6 19.818L21 7"/>
            </>;
            break;
        case "driff-logo":
            viewBox = "0 0 465 355";
            content = <>
                <defs>
                    <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="linearGradient-1">
                        <stop stop-color="#972C86" offset="0%"/>
                        <stop stop-color="#794997" offset="40%"/>
                        <stop stop-color="#007180" offset="100%"/>
                    </linearGradient>
                </defs>
                <g id="Symbols,-Styles-&amp;-Typography" stroke="none" stroke-width="1" fill="none"
                   fill-rule="evenodd">
                    <g id="logo/gradient" fill="url(#linearGradient-1)">
                        <path
                            d="M444.876694,189.762858 C444.876694,184.355858 449.260694,179.972858 454.666694,179.972858 C460.073694,179.972858 464.456694,184.355858 464.456694,189.762858 C464.456694,195.169858 460.073694,199.552858 454.666694,199.552858 C449.260694,199.552858 444.876694,195.169858 444.876694,189.762858 Z M153.753094,95.3067584 C175.403094,118.181758 181.133094,149.458758 172.867094,179.417758 C162.355094,217.514758 130.210094,243.101758 94.2370945,256.022758 C81.8950945,260.454758 68.7470945,263.670758 55.6180945,264.438758 C51.9980945,264.651758 48.0080945,264.726758 44.5210945,263.619758 C38.5750945,261.731758 37.1550945,256.791758 37.3080945,251.188758 C38.6900945,200.786758 39.9310945,150.357758 39.2580945,99.9347584 C39.1110945,88.9087584 56.2120945,88.9397584 56.3580945,99.9347584 C56.4540945,107.041758 56.5080945,114.149758 56.5260945,121.256758 C56.5970945,149.275758 56.1930945,177.294758 55.5860945,205.306758 C55.3590945,215.758758 55.1000945,226.208758 54.8160945,236.659758 C54.7190945,240.186758 54.7800945,243.789758 54.6920945,247.366758 C55.0770945,247.351758 55.4610945,247.349758 55.8460945,247.325758 C56.9890945,247.254758 58.1310945,247.153758 59.2700945,247.033758 C59.8690945,246.970758 60.4650945,246.892758 61.0640945,246.826758 C61.0780945,246.824758 61.0870945,246.822758 61.1010945,246.820758 C67.0860945,245.854758 72.9920945,244.635758 78.8330945,242.998758 C82.2310945,242.046758 85.5960945,240.981758 88.9230945,239.806758 C92.5540945,238.524758 95.8140945,237.227758 98.1920945,236.172758 C129.822094,222.134758 155.397094,196.918758 159.092094,160.933758 C159.473094,157.220758 159.705094,153.475758 159.607094,149.741758 C159.573094,148.469758 159.502094,147.199758 159.396094,145.931758 C159.352094,145.409758 159.121094,143.665758 159.076094,143.216758 C158.206094,138.036758 156.832094,133.068758 155.028094,128.124758 C154.464094,126.577758 154.802094,127.518758 154.783094,127.474758 C154.475094,126.772758 154.162094,126.074758 153.836094,125.381758 C153.217094,124.070758 152.560094,122.778758 151.866094,121.506758 C150.370094,118.763758 148.702094,116.114758 146.875094,113.578758 C146.704094,113.341758 146.048094,112.473758 145.807094,112.148758 C145.547094,111.835758 144.858094,110.989758 144.647094,110.738758 C143.602094,109.499758 142.518094,108.294758 141.399094,107.123758 C138.961094,104.572758 136.350094,102.198758 133.608094,99.9767584 C132.620094,99.1757584 133.820094,100.088758 132.413094,99.0617584 C131.623094,98.4847584 130.829094,97.9137584 130.022094,97.3607584 C128.481094,96.3017584 126.905094,95.2937584 125.301094,94.3317584 C121.761094,92.2077584 118.082094,90.3107584 114.305094,88.6447584 C106.927094,85.3897584 96.8400945,82.5727584 88.0410945,80.9087584 C62.7140945,76.1177584 36.1160945,77.7367584 10.7810945,81.5557584 C6.19809447,82.2467584 1.60809447,80.4727584 0.26409447,75.5837584 C-0.85490553,71.5117584 1.66609447,65.7547584 6.23509447,65.0657584 C14.6450945,63.7987584 23.0840945,62.7127584 31.5590945,61.9977584 C73.4210945,58.4627584 123.117094,62.9357584 153.753094,95.3067584 Z M333.321994,31.2604584 C333.606994,31.4904584 334.527994,32.0314584 333.321994,31.2604584 Z M334.095994,27.7654584 C334.627994,27.2394584 334.361994,27.4264584 334.095994,27.7654584 Z M249.691994,203.864458 C249.443994,203.615458 249.509994,203.683458 249.691994,203.864458 Z M436.655994,129.367458 C437.285994,128.286458 437.764994,127.117458 438.367994,126.027458 C442.031994,115.884458 458.325994,120.367458 454.787994,130.746458 C452.063994,138.737458 446.559994,146.098458 440.028994,151.345458 C430.246994,159.202458 418.730994,162.384458 406.891994,162.450458 C424.394994,193.161458 428.839994,231.853458 425.059994,266.436458 C423.288994,282.647458 419.952994,298.578458 413.287994,313.520458 C409.426994,322.175458 403.979994,331.211458 395.923994,336.574458 C388.955994,341.213458 378.923994,341.649458 375.738994,332.433458 C373.563994,326.142458 373.676994,318.677458 373.412994,312.093458 C372.350994,285.709458 373.186994,259.211458 373.805994,232.826458 C374.225994,214.956458 374.736994,197.089458 375.218994,179.221458 C367.471994,181.876458 359.245994,182.902458 350.967994,182.712458 C357.273994,196.084458 359.724994,211.191458 361.287994,225.745458 C362.961994,241.332458 363.400994,257.319458 361.845994,272.935458 C359.969994,291.775458 355.275994,310.275458 346.877994,327.295458 C342.381994,336.404458 336.004994,347.965458 326.451994,352.659458 C303.822994,363.778458 308.115994,317.102458 308.192994,306.912458 C308.442994,274.095458 309.858994,241.293458 310.746994,208.489458 C308.053994,209.346458 305.195994,209.757458 302.165994,209.566458 C291.027994,208.866458 284.320994,199.906458 280.508994,190.346458 C278.996994,195.094458 277.265994,199.765458 275.230994,204.311458 C269.782994,216.478458 260.200994,226.809458 245.809994,221.313458 C228.482994,214.696458 230.620994,194.017458 233.734994,179.302458 C235.047994,173.095458 236.726994,166.977458 238.406994,160.861458 C234.410994,163.548458 230.113994,165.784458 225.586994,167.445458 C224.622994,167.798458 223.619994,168.134458 222.588994,168.450458 C220.597994,179.747458 216.214994,190.878458 210.729994,200.440458 C201.734994,216.124458 187.267994,230.038458 168.803994,232.928458 C164.223994,233.644458 159.624994,231.825458 158.285994,226.956458 C157.161994,222.866458 159.691994,217.153458 164.257994,216.439458 C179.022994,214.128458 189.164994,204.002458 196.441994,190.965458 C199.862994,184.837458 202.660994,177.722458 204.455994,170.708458 C198.452994,170.186458 192.829994,168.103458 188.802994,163.517458 C179.845994,153.314458 182.949994,136.882458 195.312994,131.090458 C202.736994,127.612458 211.388994,127.373458 217.316994,133.682458 C221.362994,137.989458 222.913994,144.000458 223.475994,149.798458 C225.670994,148.780458 227.801994,147.585458 229.843994,146.162458 C232.128994,144.571458 234.750994,142.140458 236.909994,139.799458 C237.804994,138.828458 238.668994,137.824458 239.490994,136.791458 C239.433994,136.826458 240.850994,134.900458 241.059994,134.591458 C242.228994,132.864458 243.316994,131.076458 244.570994,128.877458 C248.140994,120.314458 261.033994,120.908458 261.365994,131.149458 C261.924994,148.399458 254.269994,165.623458 250.577994,182.225458 C249.812994,185.666458 249.044994,189.649458 248.799994,192.360458 C248.646994,194.059458 248.544994,195.765458 248.567994,197.471458 C248.577994,198.124458 248.881994,200.836458 248.777994,200.553458 C248.953994,201.285458 249.328994,202.640458 249.489994,203.238458 C249.616994,203.531458 249.911994,204.058458 250.760994,204.834458 C250.958994,204.966458 251.487994,205.219458 251.672994,205.320458 C252.312994,205.528458 253.216994,205.794458 254.222994,205.741458 C254.807994,205.189458 255.364994,204.620458 255.915994,204.002458 C256.287994,203.450458 256.662994,202.904458 257.014994,202.339458 C260.348994,197.002458 261.339994,193.911458 263.308994,187.944458 C267.601994,174.939458 270.355994,161.411458 272.677994,147.932458 C273.440994,143.508458 274.131994,139.071458 274.768994,134.626458 C275.010994,131.769458 275.364994,128.932458 275.907994,126.148458 C277.745994,116.723458 293.812994,118.898458 292.702994,128.421458 C292.512994,130.043458 292.294994,131.661458 292.085994,133.281458 C291.971994,134.548458 291.860994,135.813458 291.783994,137.083458 C291.199994,146.751458 291.374994,156.527458 292.413994,166.157458 C292.841994,170.123458 293.661994,175.049458 295.002994,179.862458 C296.324994,184.603458 296.767994,186.311458 299.517994,190.154458 C298.822994,189.152458 300.582994,191.252458 301.108994,191.765458 C301.352994,191.929458 301.629994,192.093458 301.941994,192.344458 C302.087994,192.364458 302.293994,192.394458 303.467994,192.532458 C303.576994,192.531458 303.985994,192.498458 305.065994,192.323458 C305.536994,192.222458 305.991994,192.061458 306.504994,191.892458 C308.553994,190.898458 309.724994,189.982458 311.193994,188.624458 C311.863994,150.579458 311.556994,112.518458 312.813994,74.4844584 C313.316994,59.2584584 313.647994,43.7244584 316.314994,28.6854584 C317.046994,24.5594584 318.077994,19.9304584 321.057994,16.7904584 C324.931994,12.7104584 331.755994,12.4964584 336.827994,14.0924584 C349.853994,18.1894584 355.887994,33.4004584 358.826994,45.4454584 C363.165994,63.2274584 363.393994,82.2544584 361.170994,100.353458 C359.156994,116.744458 355.617994,132.948458 350.629994,148.691458 C348.874994,154.227458 346.964994,159.826458 344.789994,165.334458 C345.292994,165.384458 345.915994,165.437458 346.821994,165.512458 C356.378994,166.310458 362.627994,165.766458 371.248994,162.586458 C372.674994,162.060458 374.179994,161.334458 375.704994,160.468458 C375.835994,155.176458 375.968994,149.885458 376.084994,144.592458 C376.909994,106.512458 376.835994,68.1944584 379.932994,30.2094584 C380.568994,22.4124584 380.114994,9.87645843 386.019994,3.70245843 C392.629994,-3.20754157 403.239994,0.625458433 408.973994,6.47345843 C417.126994,14.7894584 421.047994,27.1224584 423.278994,38.2564584 C427.015994,56.9064584 426.812994,76.2114584 424.729994,95.0474584 C422.865994,111.895458 419.328994,129.871458 411.568994,145.336458 C412.771994,145.204458 413.964994,145.021458 415.140994,144.767458 C418.362994,144.072458 421.380994,143.057458 423.407994,141.954458 C425.981994,140.554458 428.009994,139.257458 429.128994,138.276458 C430.896994,136.723458 432.519994,135.064458 434.038994,133.272458 C434.136994,133.136458 434.777994,132.316458 435.272994,131.578458 C435.756994,130.856458 436.218994,130.118458 436.655994,129.367458 Z M286.000694,108.552958 C280.593694,108.552958 276.210694,104.169958 276.210694,98.7629584 C276.210694,93.3559584 280.593694,88.9729584 286.000694,88.9729584 C291.406694,88.9729584 295.790694,93.3559584 295.790694,98.7629584 C295.790694,104.169958 291.406694,108.552958 286.000694,108.552958 Z M403.610994,117.324458 C407.748994,101.065458 409.287994,84.0154584 409.082994,67.2664584 C408.922994,54.2534584 407.281994,39.0804584 402.513994,27.8884584 C401.619994,25.7874584 400.550994,23.7344584 399.342994,21.7974584 C398.951994,21.1684584 398.535994,20.5494584 398.102994,19.9444584 C398.082994,20.0814584 398.060994,20.2194584 398.040994,20.3564584 C398.121994,19.8454584 397.865994,21.6784584 397.812994,22.1344584 C397.673994,23.3284584 397.548994,24.5234584 397.431994,25.7204584 C396.126994,39.0824584 395.641994,52.5344584 395.164994,65.9474584 C394.242994,91.8624584 393.488994,117.797458 392.829994,143.737458 C392.858994,143.743458 392.886994,143.750458 392.915994,143.757458 C397.993994,135.681458 401.267994,126.533458 403.610994,117.324458 Z M409.164994,237.372458 C408.530994,221.198458 405.442994,205.057458 400.261994,189.727458 C398.131994,183.419458 395.578994,176.862458 392.173994,170.877458 C391.565994,197.384458 391.035994,223.891458 390.529994,250.383458 C390.104994,272.657458 389.414994,295.100458 390.772994,317.356458 C390.789994,317.621458 390.809994,317.886458 390.826994,318.152458 C390.970994,317.980458 391.121994,317.813458 391.262994,317.639458 C391.443994,317.385458 392.063994,316.560458 392.249994,316.284458 C407.054994,294.325458 410.184994,263.408458 409.164994,237.372458 Z M325.581994,330.019458 C341.569994,307.133458 345.937994,277.182458 345.595994,249.932458 C345.420994,235.871458 344.354994,221.711458 341.277994,207.965458 C339.927994,201.933458 338.308994,195.765458 335.632994,190.170458 C335.134994,189.129458 334.593994,188.089458 334.022994,187.076458 C333.247994,188.308458 332.453994,189.527458 331.624994,190.718458 C330.515994,192.309458 329.324994,193.906458 328.052994,195.460458 C327.844994,206.883458 327.591994,218.305458 327.249994,229.730458 C326.364994,259.176458 325.033994,288.662458 325.289994,318.127458 C325.324994,322.091458 325.398994,326.058458 325.581994,330.019458 Z M330.316994,63.9294584 C329.493994,82.5774584 329.219994,101.249458 329.007994,119.913458 C328.857994,133.195458 328.728994,146.473458 328.573994,159.749458 C339.359994,133.114458 346.020994,103.494458 345.305994,74.6894584 C344.971994,61.2674584 343.545994,46.1514584 336.233994,34.5804584 C335.061994,32.7254584 335.820994,33.8184584 334.409994,32.3014584 C334.067994,31.9324584 333.681994,31.5784584 333.278994,31.2324584 C333.251994,31.2154584 333.216994,31.1924584 333.181994,31.1684584 C332.219994,35.3394584 332.128994,37.5334584 331.682994,42.3754584 C331.022994,49.5444584 330.633994,56.7374584 330.316994,63.9294584 Z M204,152.583252 C206.04248,152.69458 207.356934,150.950665 207.356934,149.293811 C207.356934,147.636957 206.340576,145.364502 204,145.364502 C201.659424,145.364502 200.484619,147.343146 200.484619,149 C200.484619,150.656854 201.95752,152.471924 204,152.583252 Z"
                            id="Combined-Shape"/>
                    </g>
                </g>
            </>;
            break;
        default:
            console.log(`${icon} not found`);
    }

    return (
        <Svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox} fill={fill}
             stroke={stroke} strokeWidth={strokeWidth} stroke-linecap={strokeLinecap} strokeLinejoin={strokeLinejoin}
             className={`icon-${icon} ${className}`}
             {...rest}>
            {content}
        </Svg>
    );
}));