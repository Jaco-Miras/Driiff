import React, {forwardRef} from "react";
import styled from "styled-components";

const iconArrow = require("../../assets/icon/arrow/back/r/white@2x.png");
const iconArrowDown = require("../../assets/icon/arrow/down/r/arrow_down_r_secundary.svg");
const iconTopic = require("../../assets/icon/topic_icon/people_group/l/active.svg");
const iconPeople = require("../../assets/icon/people/l/inactive.svg");
const iconDocuments = require("../../assets/icon/documents/l/active.svg");
const iconTags = require("../../assets/icon/tags/l/inactive.svg");
const iconTemplates = require("../../assets/icon/templates/inactive.svg");
const iconDepartments = require("../../assets/icon/departments/department.svg");
const iconRequest = require("../../assets/icon/requests/requests-active.svg");
const iconTasks = require("../../assets/icon/task/task-menu-secundary.svg");
const iconSettings = require("../../assets/icon/settings/l/inactive.svg");
const iconLogo = require("../../assets/icon/driff-logo.svg");
const iconLogoTransparent = require("../../assets/icon/login/logo.svg");
const iconLogoCommunications = require("../../assets/icon/conversations/l/active.svg");
const iconLogoFavorites = require("../../assets/icon/favourites/l/inactive.svg");
const iconLogoNotifications = require("../../assets/icon/no_notifications/l/inactive.svg");
const iconLogoActiveNotifications = require("../../assets/icon/no_notifications/l/active.svg");
const iconArrowTransparent = require("../../assets/icon/arrow/right/white-arrow-right.svg");
const iconSearch = require("../../assets/icon/search/l/inactive.svg");
const iconClose = require("../../assets/icon/close/l/active.svg");
const iconPoll = require("../../assets/icon/poll/l/poll_l_active.svg");
const iconRecent = require("../../assets/icon/recent/l/inactive.svg");
const iconMore = require("../../assets/icon/more/l/inactive.svg");
const iconMoreMenu = require("../../assets/icon/more-menu-icons/secundary.svg");
const iconOwner = require("../../assets/icon/admin/l/inactive.svg");
const iconEnlarge = require("../../assets/icon/enlarge/l/inactive.svg");
const iconClosedEye = require("../../assets/icon/login/closed-eye.svg");
const iconOpenedEye = require("../../assets/icon/login/open-eye.svg");
const iconEdit = require("../../assets/icon/icon/edit/edit-secundary.svg");
const iconCheck = require("../../assets/icon/favourites/secundary.svg");
const iconClap = require("../../assets/icon/clap/l/active.svg");
const iconMention = require("../../assets/icon/Icons_notification/Mention/active.svg");
const iconPost = require("../../assets/icon/post/l/active.svg");
const iconMultiPost = require("../../assets/icon/conversations/l/active.svg");
const iconTailSpin = require("../../assets/icon/loaders/tail-spin.svg");
const iconCircle = require("../../assets/icon/increase/r/quarternary.svg");
const iconGrippLogo = require("../../assets/icon/gripp-logo.svg");
const iconChat = require("../../assets/img/svgs/chat/chat-icon-active.svg");
const iconDock = require("../../assets/icon/chat-box-buttons/active@2x.png");
const iconExpand = require("../../assets/icon/chat-box-buttons/expand-min-2.png");
const iconClipboard = require("../../assets/icon/templates/secundary.svg");
const iconTrash = require("../../assets/icon/trash/r/secundary.svg");
const iconLogout = require("../../assets/icon/underline/r/secundary.svg");
const iconLock = require("../../assets/icon/private/r/secundary.svg");
const iconUnlock = require("../../assets/icon/not_private/r/secundary.svg");
const iconSend = require("../../assets/icon/send/r/send-secundary.svg");
const iconGoogleLogin = require("../../assets/icon/google-logo.svg");
const iconDownload = require("../../assets/icon/download/r/download_r_secundary.svg");
const iconPlus = require("../../assets/img/svgs/choose-members-plus/secundary.svg");
const iconComment = require("../../assets/icon/conversations/r/secundary.svg");
const iconQuote = require("../../assets/icon/conversations/r/secundary.svg");
const logoHeartDriff = require("../../assets/img/heart_driff_logo.png");
const iconPrioCritical = require("../../assets/icon/priority/critical/r/secundary.svg");
const iconPrioHigh = require("../../assets/icon/priority/high/r/secundary.svg");
const iconPrioMedium = require("../../assets/icon/priority/medium/r/inactive.svg");
const iconPrioLow = require("../../assets/icon/priority/low/r/quarternary.svg");
const iconCross = require("../../assets/icon/add_v2/r/secundary.svg");
const iconPersonalBot = require("../../assets/icon/person/l/active.svg");
const iconShared = require("../../assets/icon/share/r/inactive.svg");
const iconGrippBot = require("../../assets/img/gripp-bot.png");
const iconHeartWhite = require("../../assets/img/heart-white.svg");
const iconLink = require("../../assets/icon/link/l/active.svg");
const iconMenuFavorites = require("../../assets/icon/icon/menu-favourites/favourites-menu-inactive.svg");
const iconNewChat = require("../../assets/icon/new-chat/inactive.svg");

const Wrapper = styled.img`
    transform: ${props => props.rotate ? `rotate(${props.rotate}deg)` : "rotate(0deg)"};
`;

const SvgImage = forwardRef((props, ref) => {

    const {className = "", dataTip = "", rotate, icon, onClick, dataSet, ...rest} = props;

    const handleOnClick = (e) => {
        if (onClick) {
            if (dataSet) {
                onClick(e, dataSet);
            } else {
                onClick(e);
            }
        }
    };

    const getIconImageSource = (icon) => {
        switch (icon) {
            case "arrow":
                return iconArrow;
            case "arrow-down":
                return iconArrowDown;
            case "topics":
            case "topic":
                return iconTopic;
            case "person":
            case "people":
                return iconPeople;
            case "documents":
                return iconDocuments;
            case "tags":
                return iconTags;
            case "templates":
                return iconTemplates;
            case "requests":
                return iconRequest;
            case "tasks":
                return iconTasks;
            case "settings":
                return iconSettings;
            case "team":
            case "departments":
                return iconDepartments;
            case "logo":
                return iconLogo;
            case "logo-transparent":
                return iconLogoTransparent;
            case "communications":
                return iconLogoCommunications;
            case "favorites":
                return iconLogoFavorites;
            case "notifications":
                return iconLogoNotifications;
            case "active-notification":
                return iconLogoActiveNotifications;
            case "arrow-transparent":
                return iconArrowTransparent;
            case "search":
                return iconSearch;
            case "close":
                return iconClose;
            case "poll":
                return iconPoll;
            case "recent":
                return iconRecent;
            case "more":
                return iconMore;
            case "owner":
                return iconOwner;
            case "enlarge":
                return iconEnlarge;
            case "closed-eye":
                return iconClosedEye;
            case "opened-eye":
                return iconOpenedEye;
            case "edit":
                return iconEdit;
            case "check":
                return iconCheck;
            case "clap":
                return iconClap;
            case "mention":
                return iconMention;
            case "post":
                return iconPost;
            case "multi-post":
            case "multi_post":
                return iconMultiPost;
            case "tail-spin":
                return iconTailSpin;
            case "circle":
                return iconCircle;
            case "gripp-logo":
                return iconGrippLogo;
            case "chat":
                return iconChat;
            case "dock":
                return iconDock;
            case "expand":
                return iconExpand;
            case "clipboard":
                return iconClipboard;
            case "trash":
                return iconTrash;
            case "logout":
                return iconLogout;
            case "lock":
                return iconLock;
            case "unlock":
                return iconUnlock;
            case "more-menu":
                return iconMoreMenu;
            case "send":
                return iconSend;
            case "google-login":
                return iconGoogleLogin;
            case "download":
                return iconDownload;
            case "plus":
                return iconPlus;
            case "comment":
                return iconComment;
            case "quote":
                return iconQuote;
            case "heart-driff":
                return logoHeartDriff;
            case "prio-critical":
                return iconPrioCritical;
            case "prio-high":
                return iconPrioHigh;
            case "prio-medium":
                return iconPrioMedium;
            case "prio-low":
                return iconPrioLow;
            case "cross":
                return iconCross;
            case "personal-bot":
                return iconPersonalBot;
            case "share":
                return iconShared;
            case "gripp-bot":
                return iconGrippBot;
            case "heart-white":
                return iconHeartWhite;
            case "link":
                return iconLink;
            case "menu-favourites":
                return iconMenuFavorites;
            case "new-chat":
                return iconNewChat;
            default:
                return icon;
        }
    };

    return (
        <Wrapper
            ref={ref}
            alt={`${icon} icon`}
            className={`icon-${icon} ${className}`}
            src={getIconImageSource(icon)}
            rotate={rotate}
            onClick={e => handleOnClick(e)}
            data-event="touchstart focus mouseover"
            data-event-off="mouseout"
            data-tip={dataTip}
            {...rest}
        />
    );
});

export default React.memo(SvgImage);