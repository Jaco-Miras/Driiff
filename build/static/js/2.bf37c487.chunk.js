(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[2],{802:function(n,e,t){"use strict";var i,a,r,o=t(5),c=t(0),l=t.n(c),s=t(6),u=t(4),d=t(22),m=t(186),p=u.a.div(i||(i=Object(o.a)(["\n  position: relative;\n  z-index: 1;\n  border-radius: 8px;\n  color: #828282;\n  .chat-bubble {\n    img {\n      cursor: pointer;\n    }\n    a {\n      font-weight: bold;\n      cursor: pointer;\n    }\n    .reply-file-item {\n      display: block;\n      font-weight: bold;\n\n      &.file-only {\n        img {\n          width: 52.5px;\n          height: 52.5px;\n        }\n      }\n    }\n  }\n"]))),h=u.a.div(a||(a=Object(o.a)(["\n  margin-bottom: 0.5rem;\n"]))),f=u.a.div(r||(r=Object(o.a)(["\n  display: flex;\n  flex-flow: column;\n"])));e.a=l.a.memo((function(n){var e=n.className,t=void 0===e?"":e,i=n.files,a=n.type,r=void 0===a?"chat":a,o=n.topic_id,c=void 0===o?null:o,u=n.dictionary,b=Object(s.c)(),g=function(n,e){if(n.stopPropagation(),"chat"===r&&"trashed"!==e.file_type){var t={file_id:e.file_id,files:[e],topic_id:c};b(Object(d.cc)(t))}};return l.a.createElement(p,{className:"message-files ".concat(t),filesLength:i.length,type:r},l.a.createElement(f,null,i.map((function(n,e){return 1===i.length&&"chat"===r?l.a.createElement(m.a,{key:e,cbFilePreview:g,file:n,"data-file-type":n.type,dictionary:u}):l.a.createElement(h,{key:n.id},l.a.createElement(m.a,{cbFilePreview:g,file:n,"data-file-type":n.type,dictionary:u}))}))))}))},803:function(n,e,t){"use strict";var i=t(1),a=t(0);e.a=function(n){var e=n.message,t=n.isAuthor,r=n.translate,o=n.chat_language,c=n.actions;Object(a.useEffect)((function(){t||e.user.chat_language===o||!r||e.is_translated||e.translated_language===o||function(n){return fetch("https://api.deepl.com/v2/translate?auth_key=4fb7583d-a163-7abb-8e71-c882d1fd9408&text="+n.body+"&target_lang="+o).then((function(n){return n.json()})).then((function(n){return n})).catch(console.log)}(e).then((function(n){if("undefined"!==typeof n){var t=n.translations[0].text;c.setTranslationBody(Object(i.a)(Object(i.a)({},e),{},{translated_body:t,is_translated:r,translated_language:o})),c.saveTranslation({message_id:e.id,body:t,language:o})}}))}),[r])}},804:function(n,e,t){"use strict";var i=t(1),a=t(7),r=t(0),o=t(31);e.a=function(n){var e=n.message,t=n.actions,c=Object(r.useRef)(!0),l=Object(r.useState)(null),s=Object(a.a)(l,2),u=s[0],d=s[1];Object(r.useEffect)((function(){return function(){c.current=!1}}),[]),Object(r.useEffect)((function(){!e.flagged&&(e.body.match(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/g)||[]).length>0&&null===u&&function(n){Object(o.m)({content:n.body}).then((function(n){return n})).then((function(n){c.current&&d(n.data.body)}))}(e),!e.flagged&&null!==u&&t.saveFancyContent(Object(i.a)(Object(i.a)({},e),{},{body:u,flagged:!0}))}),[u])}},805:function(n,e,t){"use strict";var i=t(1),a=t(7),r=t(0),o=t.n(r),c=t(6),l=t(13),s=t(256),u=t(75);e.a=o.a.memo((function(n){var e=n.isAuthor,t=n.replyData,d=n.className,m=void 0===d?"":d,p=n.selectedChannel,h=n.dictionary,f=n.width,b=void 0===f?250:f,g=n.teamChannelId,x=void 0===g?null:g,v=n.isExternalUser,y=n.scrollComponent,w=n.chatMessageActions,j=n.showDownloadAll,_=void 0!==j&&j,O=n.downloadFiles,E=void 0===O?[]:O,k=Object(r.useState)(!1),A=Object(a.a)(k,2),C=A[0],N=A[1],S=Object(c.c)(),T=Object(s.a)(),M=T.selectUserChannel,P=T.loggedUser,R=T.users,z=T.channels,L=T.history,B=T.match;Object(r.useEffect)((function(){t.user&&"BOT"===t.user.type&&t.body.includes("<div><p>Your")&&!t.hasOwnProperty("huddle_log")&&w.channelActions.fetchUnpublishedAnswers({channel_id:t.channel_id})}),[]);var I=function(){w.remove(t.id)};var U=t.user&&R[t.user.id]&&"internal"===R[t.user.id].type,D=t.files.some((function(n){return"trashed"===n.file_type}));return o.a.createElement(u.c,{width:b,className:m,scrollRef:y},!t.hasOwnProperty("huddle_log")&&o.a.createElement("div",{onClick:function(){w.remind(t,p)}},h.remindMeAboutThis),e&&t.hasOwnProperty("is_transferred")&&!t.is_transferred&&!t.body.startsWith("ZOOM_MESSAGE::{")&&o.a.createElement("div",{onClick:function(){var n=t,e=n.body,i=document.createElement("div");i.innerHTML=e;for(var a=i.getElementsByClassName("fancied");a[0];)a[0].parentNode.removeChild(a[0]);var r=i.innerHTML;n.body=r.replace(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)((?:.(?!\<\/a\>))*.)(<\/a>)/g,(function(n,e,t,i,a,r,o){return i})),w.setEdit(n)}},h.edit),!t.hasOwnProperty("huddle_log")&&o.a.createElement("div",{onClick:function(){w.setQuote(t)}},h.quote),e&&o.a.createElement("div",{onClick:function(){var n={type:"confirmation",headerText:h.removeChat,submitText:h.remove,cancelText:h.cancel,bodyText:h.removeThisChat,actions:{onSubmit:I}};S(Object(l.a)(n))}},h.remove),!t.hasOwnProperty("huddle_log")&&o.a.createElement("div",{onClick:function(){w.clipboardLink(p,t)}},h.copyMessageLink),!t.hasOwnProperty("huddle_log")&&!D&&o.a.createElement("div",{onClick:function(){var n={type:"forward",channel:p,message:t};S(Object(l.a)(n))}},h.forward),e&&o.a.createElement("div",{onClick:function(){w.markImportant(t)}},t.is_important?h.unMarkImportant:h.markImportant),t.user&&t.user.code&&t.user.code.includes("huddle_bot")&&t.body.includes("<div><p>Your Unpublished")&&o.a.createElement("div",{onClick:function(){w.setHuddleAnswers({id:t.id,channel_id:t.channel_id,huddle_log:t.huddle_log})}},h.editHuddle),t.body.startsWith("HUDDLE_SKIP::")&&o.a.createElement("div",{onClick:function(){w.addSkip({channel_id:t.channel_id,id:t.id})}},"Unskip"),t.user&&"BOT"!==t.user.type&&"internal"===P.type&&t.user.id!==P.id&&"DIRECT"!==p.type&&t.user.code&&"huddle_bot"!==t.user.code&&U&&o.a.createElement("div",{onClick:function(){if(!C){N(!0),M(t.user,(function(n){n&&n.id&&w.setQuote(Object(i.a)(Object(i.a)({},t),{},{channel_id:n.id})),N(!1)}))}}},h.replyInPrivate),x&&!v&&o.a.createElement("div",{onClick:function(){if(!C){var n=function(n){if(n&&n.id){w.setQuote(Object(i.a)(Object(i.a)({},t),{},{channel_id:n.id}));var e=B.url;"/chat/:code"===B.path?L.push("/chat/".concat(x.code)):B.path.startsWith("/workspace/chat")&&L.push(e.replace("/workspace/chat","/workspace/team-chat"))}N(!1)};N(!0),z[x]?w.channelActions.select(z[x.id],n):w.channelActions.fetchByCode(x.code,(function(e,t){e||(n(t.data),w.channelActions.select(Object(i.a)(Object(i.a)({},t.data),{},{selected:!0,hasMore:!1,isFetching:!1,skip:0,replies:[]})))}))}}},h.discussOnTeamChat),_&&o.a.createElement("div",{onClick:function(n){var e;e=E,function n(t){if(!(t>=e.length)){var i=document.createElement("a");i.href=e[t].download_link,i.target="_parent","download"in i&&(i.download=e[t].filename),(document.body||document.documentElement).appendChild(i),i.click&&(i.click(),console.log("trigger",e[t].filename)),i.parentNode.removeChild(i),setTimeout((function(){n(t+1)}),1200)}}(0)}},"Download all"))}))},806:function(n,e,t){"use strict";var i,a,r=t(5),o=t(0),c=t.n(o),l=t(4),s=l.a.div(i||(i=Object(r.a)(["\n  &.hide {\n    visibility: hidden;\n    opacity: 0;\n  }\n"]))),u=l.a.div(a||(a=Object(r.a)(['\n  .sepline {\n    font-weight: 600;\n    font-size: 0.85em;\n    color: #972c86;\n    position: relative;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    max-width: 100%;\n    margin: 10px auto 8px;\n    &::before,\n    &::after {\n      content: "";\n      position: absolute;\n      background-color: #972c86;\n      width: 100%;\n      height: 1px;\n      display: block;\n      clear: both;\n\n      @media only screen and (min-width: 1800px) {\n        max-width: 44%;\n      }\n\n      @media only screen and (max-width: 1799px) {\n        max-width: 42%;\n      }\n\n      @media only screen and (max-width: 1650px) {\n        max-width: 40%;\n      }\n\n      @media only screen and (max-width: 1440px) {\n        max-width: 38%;\n      }\n\n      @media only screen and (max-width: 1360px) {\n        max-width: 36%;\n      }\n\n      @media only screen and (max-width: 1280px) {\n        max-width: 40%;\n      }\n\n      @media only screen and (max-width: 1136px) {\n        max-width: 32%;\n      }\n\n      @media only screen and (max-width: 1080px) {\n        max-width: 30%;\n      }\n\n      @media only screen and (max-width: 1024px) {\n        max-width: 26%;\n      }\n\n      @media only screen and (max-width: 1000px) {\n        max-width: 24%;\n      }\n\n      @media only screen and (max-width: 996px) {\n        max-width: 20%;\n      }\n\n      @media only screen and (max-width: 640px) {\n        max-width: 35%;\n      }\n    }\n    &::before {\n      left: 0;\n    }\n    &::after {\n      right: 0;\n    }\n  }\n'])));e.a=function(n){return c.a.createElement(s,{className:"new-message-sepline"},c.a.createElement(u,null,c.a.createElement("span",{className:"sepline"},"New Message/s")))}},807:function(n,e,t){"use strict";var i,a=t(7),r=t(5),o=t(0),c=t.n(o),l=t(4),s=t(12),u=t(10),d=l.a.div(i||(i=Object(r.a)(["\n  border-radius: 50%;\n  width: 25px;\n  height: 25px;\n  padding: 0;\n  cursor: pointer;\n  position: relative;\n  @media (max-width: 620px) {\n    width: 20px;\n    height: 20px;\n  }\n  .feather-smile {\n    @media (max-width: 620px) {\n      //display: none;\n    }\n    ",";\n\n    &:hover {\n      filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);\n    }\n  }\n  .chat-reaction-picker {\n    &.orientation-top {\n      bottom: 25px;\n    }\n    &.orientation-bottom {\n      top: calc(100% + 5px);\n    }\n    &.orientation-left {\n      right: calc(100% - 25px);\n      left: auto;\n    }\n    &.orientation-right {\n      left: calc(100% - 25px);\n      right: auto;\n    }\n\n    @media (max-width: 576px) {\n      position: fixed;\n      justify-content: center;\n      display: flex;\n\n      &.orientation-top {\n        bottom: 120px;\n      }\n      &.orientation-bottom {\n        top: auto;\n        bottom: 120px;\n      }\n      &.orientation-left {\n        right: 0;\n        left: 0;\n      }\n      &.orientation-right {\n        left: 0;\n        right: 0;\n      }\n    }\n    @media (max-width: 1280px) {\n      .emoji-mart {\n        max-height: 280px;\n        overflow: auto;\n      }\n    }\n  }\n"])),(function(n){return n.active&&"filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);"}));e.a=c.a.memo((function(n){var e=n.reply,t=n.scrollComponent,i=n.chatMessageActions,r=null,l={container:Object(o.useRef)(null),picker:Object(o.useRef)(null)},m=Object(o.useState)(null),p=Object(a.a)(m,2),h=p[0],f=p[1],b=function(){return f(!h)},g=Object(u.eb)(l.container,l.picker,t,h).orientation;return Object(u.G)(l.container,(function(){return f(!1)}),!0),c.a.createElement(d,{className:"emoji-button-div",ref:l.container,active:h},c.a.createElement(s.s,{icon:"smile",onClick:b}),h&&c.a.createElement(s.l,{ref:l.picker,onMouseEnter:function(){clearTimeout(r)},onMouseLeave:function(){r=setTimeout((function(){f(!1)}),1e3)},className:"chat-reaction-picker",orientation:g,onSelectEmoji:function(n){b(),i.react(e.id,n.id)},show:h,perLine:7}))}))},808:function(n,e,t){"use strict";var i,a,r=t(7),o=t(5),c=t(0),l=t.n(c),s=t(4),u=t(12),d=s.a.div(i||(i=Object(o.a)(["\n    // position: absolute;\n    // right: ",";\n    // left: ",";\n    //top: 100%;\n    text-align: ",";\n    color: #a7abc3;\n    z-index: 2;\n    font-size: 11px;\n    position: absolute;\n    bottom: -18px;\n    white-space: nowrap;\n    ",";\n    span {\n        cursor: pointer;\n        &:hover {\n            color: #7A1B8B;\n            transition: color 0.3s;\n        }\n    }\n"])),(function(n){return n.isAuthor?"0":"unset"}),(function(n){return n.isAuthor?"unset":"5px"}),(function(n){return n.isAuthor?"right":"left"}),(function(n){return n.isAuthor?"right: 0px":"left: 0px"})),m=Object(s.a)(u.v)(a||(a=Object(o.a)(["\n  position: absolute;\n  bottom: 100%;\n  max-width: 250px;\n  left: ",";\n  right: ",";\n  z-index: 999;\n  ul {\n    max-height: 250px;\n\n    li {\n      display: flex;\n      text-align: left;\n\n      > span {\n        margin-left: 10px;\n      }\n    }\n  }\n"])),(function(n){return n.isAuthor?"unset":"5px"}),(function(n){return n.isAuthor?"5px":"unset"}));e.a=function(n){var e=n.isPersonal,t=n.seenMembers,i=n.isAuthor,a=Object(c.useState)(!1),o=Object(r.a)(a,2),s=o[0],u=o[1],p=function(){return u(!s)};return l.a.createElement(d,n,e&&"seen",!e&&1===t.length&&"seen by ".concat(t.map((function(n){return n.first_name})).slice(0,1).toString()),!e&&t.length>1&&l.a.createElement(l.a.Fragment,null,"seen by"," ",t.map((function(n){return n.first_name})).slice(0,1).toString()," ","and",l.a.createElement("span",{onClick:p}," more")),!e&&t.length>1&&s&&l.a.createElement(m,{className:"chat-seen-list",users:t,isAuthor:i,onShowList:p}))}},818:function(n,e,t){"use strict";var i,a,r,o,c,l,s=t(7),u=t(5),d=t(0),m=t.n(d),p=t(4),h=t(34),f=t(191),b=t(12),g=t(253),x=p.a.div(i||(i=Object(u.a)(["\n  background: ",";\n  color: ",";\n  padding: 4px;\n  display: flex;\n  align-items: center;\n  border-radius: 8px;\n  margin: 0 2px;\n  cursor: pointer;\n  position: relative;\n  .chat-emoji-users-list {\n    position: absolute;\n    bottom: 100%;\n    max-width: 250px;\n    left: ",";\n    right: ",";\n    visibility: hidden;\n    ul {\n      max-height: 250px;\n    }\n    .avatar-md {\n      min-height: 2.7rem;\n      min-width: 2.7rem;\n    }\n  }\n  :hover {\n    .chat-emoji-users-list {\n      visibility: visible;\n    }\n  }\n"])),(function(n){return n.isAuthor?"rgb(157 57 173 / 93%)":"rgba(240, 240, 240, 0.8)"}),(function(n){return n.isAuthor?"#fff":"#505050"}),(function(n){return n.isAuthor?"unset":"5px"}),(function(n){return n.isAuthor?"5px":"unset"})),v=m.a.memo((function(n){var e=n.type,t=n.count,i=n.reactions,a=n.isAuthor,r=n.reply,o=Object(g.a)();return m.a.createElement(x,{onClick:function(){o.react(r.id,e)},isAuthor:a,className:"chat-emoji"},m.a.createElement(f.a,{emoji:e,size:20}),t>1?m.a.createElement("span",{className:"emoji-counter"}," ",t):null,m.a.createElement(b.v,{className:"chat-emoji-users-list",isAuthor:a,users:i.map((function(n){return{id:n.user_id,name:n.user_name,profile_image_link:n.profile_image_link,profile_image_thumbnail_link:n.profile_image_thumbnail_link?n.profile_image_thumbnail_link:n.profile_image_link,partial_name:null}}))}))})),y=t(10),w=p.a.div(a||(a=Object(u.a)(["\n  ul {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    position: relative;\n    z-index: 100;\n  }\n  li {\n    position: relative;\n    padding: 3px;\n    border-bottom: 1px solid;\n    display: inline-flex;\n    align-items: center;\n    justify-content: space-between;\n    width: 100%;\n    :hover {\n      .chat-emoji-users-list {\n        visibility: visible;\n      }\n    }\n  }\n  li:last-child {\n    border: none;\n  }\n"]))),j=Object(p.a)(b.v)(r||(r=Object(u.a)(["\n  position: absolute;\n  bottom: 100%;\n  max-width: 250px;\n  left: ",";\n  right: ",";\n  top: 1px;\n  visibility: hidden;\n  ul {\n    max-height: 250px;\n    padding: 5px 10px;\n  }\n  .profile-slider {\n    display: none !important;\n  }\n"])),(function(n){return n.isAuthor?"unset":"116%"}),(function(n){return n.isAuthor?"116%":"unset"})),_=function(n){var e=n.className,t=n.reactions,i=n.handleShowMoreEmojis,a=n.isAuthor,r=n.reply,o=n.chatReactionAction,c=Object(d.useRef)();Object(y.G)(c,i,!0);return m.a.createElement(w,{className:e,ref:c},m.a.createElement("ul",null,t.map((function(n){return m.a.createElement("li",{key:n.type,onClick:function(){return function(n){var e={message_id:r.id,react_type:n};o(e)}(n.type)}},m.a.createElement(f.a,{emoji:n.type,size:16}),m.a.createElement("span",null,n.reactions.length),m.a.createElement(j,{className:"chat-emoji-users-list",isAuthor:a,users:n.reactions.map((function(n){return{id:n.user_id,name:n.user_name,profile_image_link:n.profile_image_link,profile_image_thumbnail_link:n.profile_image_thumbnail_link?n.profile_image_thumbnail_link:n.profile_image_link,partial_name:null}}))}))}))))},O=p.a.div(o||(o=Object(u.a)(["\n  // position: absolute;\n  //bottom: -20px;\n  margin-top: -8px;\n  display: inline-flex;\n  max-width: 90%;\n  z-index: 1;\n  flex-flow: ",";\n  align-self: ",";\n  .profile-slider {\n    left: 60px !important;\n    right: unset !important;\n    bottom: 0px !important;\n    top: unset !important;\n  }\n  .chat-right & {\n    .profile-slider {\n      left: unset !important;\n      right: 0 !important;\n      bottom: 100% !important;\n      top: unset !important;\n    }\n  }\n"])),(function(n){return n.isAuthor?"row-reverse":"row"}),(function(n){return n.isAuthor?"flex-end":"flex-start"})),E=p.a.div(c||(c=Object(u.a)(["\n  background: #dedede;\n  padding: 2px 5px;\n  display: flex;\n  align-items: center;\n  border-radius: 8px;\n  margin: 0 2px;\n  position: relative;\n  cursor: pointer;\n  // :hover {\n  //     .chat-reactions-list {\n  //         visibility: visible;\n  //     }\n  // }\n"]))),k=Object(p.a)(_)(l||(l=Object(u.a)(["\n  position: absolute;\n  background: #dedede;\n  border-radius: 8px;\n  max-width: 100px;\n  min-width: 60px;\n  padding: 5px;\n  top: 100%;\n  right: ",";\n  left: ",";\n  margin-top: 5px;\n  //visibility: hidden;\n"])),(function(n){return n.isAuthor?"0":"unset"}),(function(n){return n.isAuthor?"unset":"0"}));e.a=m.a.memo((function(n){var e=n.reactions,t=n.isAuthor,i=n.chatReactionAction,a=n.reply,r=function(n){var e=Object(d.useRef)();return Object(d.useEffect)((function(){e.current=n})),e.current}(e.length),o=Object(d.useState)(!1),c=Object(s.a)(o,2),l=c[0],u=c[1],p=function(){return u(!l)},f=function(){return Object.entries(Object(h.b)(e,"react_type")).map((function(n){return{type:n[0],reactions:n[1]}}))},b=Object(d.useState)(f()),g=Object(s.a)(b,2),x=g[0],y=g[1];return Object(d.useEffect)((function(){y(f())}),[]),Object(d.useEffect)((function(){r!==e.length&&y(Object.entries(Object(h.b)(e,"react_type")).map((function(n){return{type:n[0],reactions:n[1]}})))}),[e,r]),m.a.createElement(O,{isAuthor:t},x.slice(0,7).map((function(n){return m.a.createElement(v,{userReacted:!1,key:n.type,type:n.type,count:n.reactions.length,reactions:n.reactions,isAuthor:t,chatReactionAction:i,reply:a})})),x.length>7&&m.a.createElement(E,null,m.a.createElement("span",{onClick:p},"..."),l&&m.a.createElement(k,{isAuthor:t,reactions:x.slice(7),className:"chat-reactions-list",handleShowMoreEmojis:p,chatReactionAction:i,reply:a})))}))}}]);