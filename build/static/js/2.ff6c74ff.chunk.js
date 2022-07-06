(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[2],{917:function(n,e,t){"use strict";var i=t(6),a=t(0),r=t.n(a),o=t(4),c=t(5),l=t(23),s=t(203);function u(){var n=Object(i.a)(["\n  display: flex;\n  flex-flow: column;\n  .app-file-list {\n    max-width: 180px;\n  }\n  .app-file-icon,\n  .p-2.small {\n    width: 100%;\n  }\n"]);return u=function(){return n},n}function d(){var n=Object(i.a)(["\n  margin-bottom: 0.5rem;\n"]);return d=function(){return n},n}function m(){var n=Object(i.a)(["\n  position: relative;\n  z-index: 1;\n  border-radius: 8px;\n  color: #828282;\n  .chat-bubble {\n    img {\n      cursor: pointer;\n    }\n    a {\n      font-weight: bold;\n      cursor: pointer;\n    }\n    .reply-file-item {\n      display: block;\n      font-weight: bold;\n\n      &.file-only {\n        img {\n          width: 52.5px;\n          height: 52.5px;\n        }\n      }\n    }\n  }\n"]);return m=function(){return n},n}var h=c.b.div(m()),p=c.b.div(d()),f=c.b.div(u());e.a=r.a.memo((function(n){var e=n.className,t=void 0===e?"":e,i=n.files,a=n.type,c=void 0===a?"chat":a,u=n.topic_id,d=void 0===u?null:u,m=n.dictionary,b=Object(o.c)(),g=Object(o.d)((function(n){return n.chat.selectedChannel})),x=function(n,e){if(n.stopPropagation(),"chat"===c&&"trashed"!==e.file_type){var t={file_id:e.file_id,files:[e],topic_id:d,sharedSlug:!(!g||!g.slug),slug:g.slug};b(Object(l.fc)(t))}};return r.a.createElement(h,{className:"message-files ".concat(t),filesLength:i.length,type:c},r.a.createElement(f,null,i.map((function(n,e){return 1===i.length&&"chat"===c?r.a.createElement(s.a,{key:e,cbFilePreview:x,file:n,"data-file-type":n.type,dictionary:m,sharedSlug:g?g.slug:null}):r.a.createElement(p,{key:n.id},r.a.createElement(s.a,{cbFilePreview:x,file:n,"data-file-type":n.type,dictionary:m,sharedSlug:g?g.slug:null}))}))))}))},918:function(n,e,t){"use strict";var i=t(1),a=t(0),r=t(4);e.a=function(n){var e=n.message,t=n.isAuthor,o=n.translate,c=n.chat_language,l=n.actions,s=n.channel,u=Object(r.d)((function(n){return n.workspaces.sharedWorkspaces})),d=null;s&&s.sharedSlug&&(d={slug:s.slug,token:u[s.slug].access_token,is_shared:!0}),Object(a.useEffect)((function(){t||e.user.chat_language===c||!o||e.is_translated||e.translated_language===c||function(n){return fetch("https://api.deepl.com/v2/translate?auth_key=4fb7583d-a163-7abb-8e71-c882d1fd9408&text="+n.body+"&target_lang="+c).then((function(n){return n.json()})).then((function(n){return n})).catch(console.log)}(e).then((function(n){if("undefined"!==typeof n){var t=n.translations[0].text;l.setTranslationBody(Object(i.a)(Object(i.a)({},e),{},{translated_body:t,is_translated:o,translated_language:c,sharedSlug:s.sharedSlug,channelCode:s.code})),l.saveTranslation({message_id:e.id,body:t,language:c,sharedSlug:s.sharedSlug,channelCode:s.code,sharedPayload:d})}}))}),[o])}},919:function(n,e,t){"use strict";var i=t(1),a=t(7),r=t(0),o=t.n(r),c=t(12),l=t(34),s=t(40);e.a=function(n){var e=n.message,t=n.actions,u=Object(r.useRef)(!0);var d=Object(r.useState)(null),m=Object(a.a)(d,2),h=m[0],p=m[1],f=e.body;Object(r.useEffect)((function(){return function(){u.current=!1}}),[]),Object(r.useEffect)((function(){var n=f;if((f.match(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g)||[]).length>0&&!e.is_fancy&&(n=function(n){return Object(s.o)({content:n.body}).then((function(n){return n})).then((function(n){u.current&&p(n.data.body)})),null!==h?h:n.body}(e)),null!==h){var a=n.replace(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g,(function(n,e,t,i,a,r,s){var u=document.createElement("div");return u.innerHTML=n.trim(),u.getElementsByClassName("fancied").length>0?Object(l.renderToString)(o.a.createElement(c.h,{link:i,title:a})):n}));t.saveFancyContent(Object(i.a)(Object(i.a)({},e),{},{body:a,is_fancy:!0}))}}),[h])}},920:function(n,e,t){"use strict";var i=t(1),a=t(7),r=t(0),o=t.n(r),c=t(4),l=t(13),s=t(292),u=t(77);e.a=o.a.memo((function(n){var e=n.isAuthor,t=n.replyData,d=n.className,m=void 0===d?"":d,h=n.selectedChannel,p=n.dictionary,f=n.width,b=void 0===f?250:f,g=n.teamChannelId,x=void 0===g?null:g,v=n.isExternalUser,y=n.scrollComponent,j=n.chatMessageActions,_=n.showDownloadAll,w=void 0!==_&&_,O=n.downloadFiles,E=void 0===O?[]:O,k=Object(r.useState)(!1),A=Object(a.a)(k,2),C=A[0],S=A[1],N=Object(c.c)(),T=Object(s.a)(),M=T.selectUserChannel,P=T.loggedUser,R=T.users,L=T.channels,z=T.history,U=T.match;Object(r.useEffect)((function(){t.user&&"BOT"===t.user.type&&t.body.includes("<div><p>Your")&&!t.hasOwnProperty("huddle_log")&&j.channelActions.fetchUnpublishedAnswers({channel_id:t.channel_id})}),[]);var I=function(){j.remove(t.id)};var B=t.user&&R[t.user.id]&&"internal"===R[t.user.id].type,F=t.files.some((function(n){return"trashed"===n.file_type}));return o.a.createElement(u.c,{width:b,className:m,scrollRef:y},!t.hasOwnProperty("huddle_log")&&o.a.createElement("div",{onClick:function(){j.remind(t,h)}},p.remindMeAboutThis),e&&t.hasOwnProperty("is_transferred")&&!t.is_transferred&&!t.body.startsWith("ZOOM_MESSAGE::{")&&o.a.createElement("div",{onClick:function(){var n=t,e=n.body,i=document.createElement("div");i.innerHTML=e;for(var a=i.getElementsByClassName("fancied");a[0];)a[0].parentNode.removeChild(a[0]);var r=i.innerHTML;n.body=r.replace(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)((?:.(?!\<\/a\>))*.)(<\/a>)/g,(function(n,e,t,i,a,r,o){return i})),j.setEdit(n)}},p.edit),!t.hasOwnProperty("huddle_log")&&o.a.createElement("div",{onClick:function(){j.setQuote(t)}},p.quote),e&&o.a.createElement("div",{onClick:function(){var n={type:"confirmation",headerText:p.removeChat,submitText:p.remove,cancelText:p.cancel,bodyText:p.removeThisChat,actions:{onSubmit:I}};N(Object(l.a)(n))}},p.remove),!t.hasOwnProperty("huddle_log")&&o.a.createElement("div",{onClick:function(){j.clipboardLink(h,t)}},p.copyMessageLink),!t.hasOwnProperty("huddle_log")&&!F&&o.a.createElement("div",{onClick:function(){var n={type:"forward",channel:h,message:t};N(Object(l.a)(n))}},p.forward),e&&o.a.createElement("div",{onClick:function(){j.markImportant(t)}},t.is_important?p.unMarkImportant:p.markImportant),t.user&&t.user.code&&t.user.code.includes("huddle_bot")&&t.body.includes("<div><p>Your Unpublished")&&o.a.createElement("div",{onClick:function(){j.setHuddleAnswers({id:t.id,channel_id:t.channel_id,huddle_log:t.huddle_log})}},p.editHuddle),t.body.startsWith("HUDDLE_SKIP::")&&o.a.createElement("div",{onClick:function(){j.addSkip({channel_id:t.channel_id,id:t.id})}},"Unskip"),!h.sharedSlug&&t.user&&"BOT"!==t.user.type&&"internal"===P.type&&t.user.id!==P.id&&"DIRECT"!==h.type&&t.user.code&&"huddle_bot"!==t.user.code&&B&&o.a.createElement("div",{onClick:function(){if(!C){S(!0),M(t.user,(function(n){n&&n.id&&j.setQuote(Object(i.a)(Object(i.a)({},t),{},{channel_id:n.id})),S(!1)}))}}},p.replyInPrivate),x&&!v&&o.a.createElement("div",{onClick:function(){if(!C){var n=function(n){if(n&&n.id){j.setQuote(Object(i.a)(Object(i.a)({},t),{},{channel_id:x.id}));var e=U.url;"/chat/:code"===U.path?z.push("/chat/".concat(x.code)):U.path.startsWith("/hub/chat")&&z.push(e.replace("/hub/chat","/hub/team-chat"))}S(!1)};S(!0),L[x]?j.channelActions.select(L[x.id],n):j.channelActions.fetchByCode(x.code,(function(e,t){e||(n(t.data),j.channelActions.select(Object(i.a)(Object(i.a)({},t.data),{},{selected:!0,hasMore:!1,isFetching:!1,skip:0,replies:[]})))}))}}},p.discussOnTeamChat),w&&o.a.createElement("div",{onClick:function(n){var e;e=E,function n(t){if(!(t>=e.length)){var i=document.createElement("a");i.href=e[t].download_link,i.target="_blank","download"in i&&(i.download=e[t].filename),(document.body||document.documentElement).appendChild(i),i.click&&i.click(),i.parentNode.removeChild(i),setTimeout((function(){n(t+1)}),1200)}}(0)}},p.downloadAll))}))},921:function(n,e,t){"use strict";var i=t(6),a=t(0),r=t.n(a),o=t(5);function c(){var n=Object(i.a)(["\n  .sepline {\n    font-weight: 600;\n    font-size: 0.85em;\n    color: ",';\n    position: relative;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    max-width: 100%;\n    margin: 10px auto 8px;\n    &::before,\n    &::after {\n      content: "";\n      position: absolute;\n      background-color: ',";\n      width: 100%;\n      height: 1px;\n      display: block;\n      clear: both;\n\n      @media only screen and (min-width: 1800px) {\n        max-width: 44%;\n      }\n\n      @media only screen and (max-width: 1799px) {\n        max-width: 42%;\n      }\n\n      @media only screen and (max-width: 1650px) {\n        max-width: 40%;\n      }\n\n      @media only screen and (max-width: 1440px) {\n        max-width: 38%;\n      }\n\n      @media only screen and (max-width: 1360px) {\n        max-width: 36%;\n      }\n\n      @media only screen and (max-width: 1280px) {\n        max-width: 40%;\n      }\n\n      @media only screen and (max-width: 1136px) {\n        max-width: 32%;\n      }\n\n      @media only screen and (max-width: 1080px) {\n        max-width: 30%;\n      }\n\n      @media only screen and (max-width: 1024px) {\n        max-width: 26%;\n      }\n\n      @media only screen and (max-width: 1000px) {\n        max-width: 24%;\n      }\n\n      @media only screen and (max-width: 996px) {\n        max-width: 20%;\n      }\n\n      @media only screen and (max-width: 640px) {\n        max-width: 35%;\n      }\n    }\n    &::before {\n      left: 0;\n    }\n    &::after {\n      right: 0;\n    }\n  }\n"]);return c=function(){return n},n}function l(){var n=Object(i.a)(["\n  &.hide {\n    visibility: hidden;\n    opacity: 0;\n  }\n"]);return l=function(){return n},n}var s=o.b.div(l()),u=o.b.div(c(),(function(n){return n.theme.colors.primary}),(function(n){return n.theme.colors.primary}));e.a=function(n){return r.a.createElement(s,{className:"new-message-sepline"},r.a.createElement(u,null,r.a.createElement("span",{className:"sepline"},"New Message/s")))}},922:function(n,e,t){"use strict";var i=t(7),a=t(6),r=t(0),o=t.n(r),c=t(5),l=t(12),s=t(10);function u(){var n=Object(a.a)(["\n  border-radius: 50%;\n  width: 25px;\n  height: 25px;\n  padding: 0;\n  cursor: pointer;\n  position: relative;\n  @media (max-width: 620px) {\n    width: 20px;\n    height: 20px;\n  }\n  .feather-smile {\n    @media (max-width: 620px) {\n      //display: none;\n    }\n    ",";\n\n    &:hover {\n      color: ",";\n      // filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);\n    }\n  }\n  .chat-reaction-picker {\n    &.orientation-top {\n      bottom: 25px;\n    }\n    &.orientation-bottom {\n      top: calc(100% + 5px);\n    }\n    &.orientation-left {\n      right: calc(100% - 25px);\n      left: auto;\n    }\n    &.orientation-right {\n      left: calc(100% - 25px);\n      right: auto;\n    }\n\n    @media (max-width: 576px) {\n      position: fixed;\n      justify-content: center;\n      display: flex;\n\n      &.orientation-top {\n        bottom: 120px;\n      }\n      &.orientation-bottom {\n        top: auto;\n        bottom: 120px;\n      }\n      &.orientation-left {\n        right: 0;\n        left: 0;\n      }\n      &.orientation-right {\n        left: 0;\n        right: 0;\n      }\n    }\n    @media (max-width: 1280px) {\n      .emoji-mart {\n        max-height: 280px;\n        overflow: auto;\n      }\n    }\n  }\n"]);return u=function(){return n},n}var d=c.b.div(u(),(function(n){return n.active&&n.theme.colors.primary}),(function(n){return n.theme.colors.primary}));e.a=o.a.memo((function(n){var e=n.reply,t=n.scrollComponent,a=n.chatMessageActions,c=null,u={container:Object(r.useRef)(null),picker:Object(r.useRef)(null)},m=Object(r.useState)(null),h=Object(i.a)(m,2),p=h[0],f=h[1],b=function(){return f(!p)},g=Object(s.kb)(u.container,u.picker,t,p).orientation;return Object(s.J)(u.container,(function(){return f(!1)}),!0),o.a.createElement(d,{className:"emoji-button-div",ref:u.container,active:p},o.a.createElement(l.u,{icon:"smile",onClick:b}),p&&o.a.createElement(l.n,{ref:u.picker,onMouseEnter:function(){clearTimeout(c)},onMouseLeave:function(){c=setTimeout((function(){f(!1)}),1e3)},className:"chat-reaction-picker",orientation:g,onSelectEmoji:function(n){b(),a.react(e.id,n.id)},show:p,perLine:7}))}))},923:function(n,e,t){"use strict";var i=t(7),a=t(6),r=t(0),o=t.n(r),c=t(5),l=t(12);function s(){var n=Object(a.a)(["\n  position: absolute;\n  bottom: 100%;\n  max-width: 250px;\n  left: ",";\n  right: ",";\n  z-index: 999;\n  ul {\n    max-height: 250px;\n\n    li {\n      display: flex;\n      text-align: left;\n\n      > span {\n        margin-left: 10px;\n      }\n    }\n  }\n"]);return s=function(){return n},n}function u(){var n=Object(a.a)(["\n  text-align: ",";\n  color: #a7abc3;\n  z-index: 2;\n  font-size: 11px;\n  position: absolute;\n  bottom: -18px;\n  white-space: nowrap;\n  ",";\n  span {\n    cursor: pointer;\n    &:hover {\n      color: ",";\n      transition: color 0.3s;\n    }\n  }\n"]);return u=function(){return n},n}var d=c.b.div(u(),(function(n){return n.isAuthor?"right":"left"}),(function(n){return n.isAuthor?"right: 0px":"left: 0px"}),(function(n){return n.theme.colors.primary})),m=Object(c.b)(l.x)(s(),(function(n){return n.isAuthor?"unset":"5px"}),(function(n){return n.isAuthor?"5px":"unset"}));e.a=function(n){var e=n.isPersonal,t=n.seenMembers,a=n.isAuthor,c=n.channel,l=Object(r.useState)(!1),s=Object(i.a)(l,2),u=s[0],h=s[1],p=function(){return h(!u)};return o.a.createElement(d,n,e&&"seen",!e&&1===t.length&&"seen by ".concat(t.map((function(n){return n.first_name})).slice(0,1).toString()),!e&&t.length>1&&o.a.createElement(o.a.Fragment,null,"seen by"," ",t.map((function(n){return n.first_name})).slice(0,1).toString()," ","and",o.a.createElement("span",{onClick:p}," more")),!e&&t.length>1&&u&&o.a.createElement(m,{className:"chat-seen-list",users:t,isAuthor:a,onShowList:p,sharedUsers:!!c.slug}))}},932:function(n,e,t){"use strict";var i=t(7),a=t(6),r=t(0),o=t.n(r),c=t(5),l=t(37),s=t(207),u=t(12),d=t(288);function m(){var n=Object(a.a)(["\n  background: ",";\n  color: ",";\n  padding: 4px;\n  display: flex;\n  align-items: center;\n  border-radius: 8px;\n  margin: 0 2px;\n  cursor: pointer;\n  position: relative;\n  .chat-emoji-users-list {\n    position: absolute;\n    bottom: 100%;\n    max-width: 250px;\n    left: ",";\n    right: ",";\n    visibility: hidden;\n    ul {\n      max-height: 250px;\n    }\n    .avatar-md {\n      min-height: 2.7rem;\n      min-width: 2.7rem;\n    }\n  }\n  :hover {\n    .chat-emoji-users-list {\n      visibility: visible;\n    }\n  }\n"]);return m=function(){return n},n}var h=c.b.div(m(),(function(n){return n.isAuthor?n.theme.colors.secondary:"rgba(240, 240, 240, 0.8)"}),(function(n){return n.isAuthor?"#fff":"#505050"}),(function(n){return n.isAuthor?"unset":"5px"}),(function(n){return n.isAuthor?"5px":"unset"})),p=o.a.memo((function(n){var e=n.type,t=n.count,i=n.reactions,a=n.isAuthor,r=n.reply,c=Object(d.a)();return o.a.createElement(h,{onClick:function(){c.react(r.id,e)},isAuthor:a,className:"chat-emoji"},o.a.createElement(s.a,{emoji:e,size:20}),t>1?o.a.createElement("span",{className:"emoji-counter"}," ",t):null,o.a.createElement(u.x,{className:"chat-emoji-users-list",isAuthor:a,users:i.map((function(n){return{id:n.user_id,name:n.user_name,profile_image_link:n.profile_image_link,profile_image_thumbnail_link:n.profile_image_thumbnail_link?n.profile_image_thumbnail_link:n.profile_image_link,partial_name:null}}))}))})),f=t(10);function b(){var n=Object(a.a)(["\n  position: absolute;\n  bottom: 100%;\n  max-width: 250px;\n  left: ",";\n  right: ",";\n  top: 1px;\n  visibility: hidden;\n  ul {\n    max-height: 250px;\n    padding: 5px 10px;\n  }\n  .profile-slider {\n    display: none !important;\n  }\n"]);return b=function(){return n},n}function g(){var n=Object(a.a)(["\n  ul {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    position: relative;\n    z-index: 100;\n  }\n  li {\n    position: relative;\n    padding: 3px;\n    border-bottom: 1px solid;\n    display: inline-flex;\n    align-items: center;\n    justify-content: space-between;\n    width: 100%;\n    :hover {\n      .chat-emoji-users-list {\n        visibility: visible;\n      }\n    }\n  }\n  li:last-child {\n    border: none;\n  }\n"]);return g=function(){return n},n}var x=c.b.div(g()),v=Object(c.b)(u.x)(b(),(function(n){return n.isAuthor?"unset":"116%"}),(function(n){return n.isAuthor?"116%":"unset"})),y=function(n){var e=n.className,t=n.reactions,i=n.handleShowMoreEmojis,a=n.isAuthor,c=n.reply,l=n.chatReactionAction,u=Object(r.useRef)();Object(f.J)(u,i,!0);return o.a.createElement(x,{className:e,ref:u},o.a.createElement("ul",null,t.map((function(n){return o.a.createElement("li",{key:n.type,onClick:function(){return function(n){var e={message_id:c.id,react_type:n};l(e)}(n.type)}},o.a.createElement(s.a,{emoji:n.type,size:16}),o.a.createElement("span",null,n.reactions.length),o.a.createElement(v,{className:"chat-emoji-users-list",isAuthor:a,users:n.reactions.map((function(n){return{id:n.user_id,name:n.user_name,profile_image_link:n.profile_image_link,profile_image_thumbnail_link:n.profile_image_thumbnail_link?n.profile_image_thumbnail_link:n.profile_image_link,partial_name:null}}))}))}))))};function j(){var n=Object(a.a)(["\n  position: absolute;\n  background: #dedede;\n  border-radius: 8px;\n  max-width: 100px;\n  min-width: 60px;\n  padding: 5px;\n  top: 100%;\n  right: ",";\n  left: ",";\n  margin-top: 5px;\n  //visibility: hidden;\n"]);return j=function(){return n},n}function _(){var n=Object(a.a)(["\n  background: #dedede;\n  padding: 2px 5px;\n  display: flex;\n  align-items: center;\n  border-radius: 8px;\n  margin: 0 2px;\n  position: relative;\n  cursor: pointer;\n  // :hover {\n  //     .chat-reactions-list {\n  //         visibility: visible;\n  //     }\n  // }\n"]);return _=function(){return n},n}function w(){var n=Object(a.a)(["\n  // position: absolute;\n  //bottom: -20px;\n  margin-top: -8px;\n  display: inline-flex;\n  max-width: 90%;\n  z-index: 1;\n  flex-flow: ",";\n  align-self: ",";\n  .profile-slider {\n    left: 60px !important;\n    right: unset !important;\n    bottom: 0px !important;\n    top: unset !important;\n  }\n  .chat-right & {\n    .profile-slider {\n      left: unset !important;\n      right: 0 !important;\n      bottom: 100% !important;\n      top: unset !important;\n    }\n  }\n"]);return w=function(){return n},n}var O=c.b.div(w(),(function(n){return n.isAuthor?"row-reverse":"row"}),(function(n){return n.isAuthor?"flex-end":"flex-start"})),E=c.b.div(_()),k=Object(c.b)(y)(j(),(function(n){return n.isAuthor?"0":"unset"}),(function(n){return n.isAuthor?"unset":"0"}));e.a=o.a.memo((function(n){var e=n.reactions,t=n.isAuthor,a=n.chatReactionAction,c=n.reply,s=function(n){var e=Object(r.useRef)();return Object(r.useEffect)((function(){e.current=n})),e.current}(e.length),u=Object(r.useState)(!1),d=Object(i.a)(u,2),m=d[0],h=d[1],f=function(){return h(!m)},b=function(){return Object.entries(Object(l.b)(e,"react_type")).map((function(n){return{type:n[0],reactions:n[1]}}))},g=Object(r.useState)(b()),x=Object(i.a)(g,2),v=x[0],y=x[1];return Object(r.useEffect)((function(){y(b())}),[]),Object(r.useEffect)((function(){s!==e.length&&y(Object.entries(Object(l.b)(e,"react_type")).map((function(n){return{type:n[0],reactions:n[1]}})))}),[e,s]),o.a.createElement(O,{isAuthor:t},v.slice(0,7).map((function(n){return o.a.createElement(p,{userReacted:!1,key:n.type,type:n.type,count:n.reactions.length,reactions:n.reactions,isAuthor:t,chatReactionAction:a,reply:c})})),v.length>7&&o.a.createElement(E,null,o.a.createElement("span",{onClick:f},"..."),m&&o.a.createElement(k,{isAuthor:t,reactions:v.slice(7),className:"chat-reactions-list",handleShowMoreEmojis:f,chatReactionAction:a,reply:c})))}))}}]);