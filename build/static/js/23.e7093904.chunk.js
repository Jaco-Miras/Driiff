(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[23],{723:function(t,e,n){"use strict";n.r(e);var i,a,o,s=n(11),c=n(9),r=n(1),p=n.n(r),l=n(36),d=n(10),b=n(626),h=n(12),f=n(17),u=d.a.span(i||(i=Object(c.a)(['\n  display: block;\n  width: 100%;\n\n  .chat-file-notification {\n    b:hover {\n      text-decoration: underline;\n      cursor: pointer;\n    }\n  }\n\n  .push-link {\n    display: inline-block;\n    position: relative;\n    padding-bottom: 25px;\n    margin-bottom: -25px;\n    width: 100%;\n\n    &:before {\n      position: absolute;\n      left: -14px;\n      top: -7px;\n      bottom: 0;\n      width: 6px;\n      height: calc(100% - 12px);\n      background: linear-gradient(180deg, rgba(106, 36, 126, 1) 0%, rgba(216, 64, 113, 1) 100%);\n      content: "";\n      border-radius: 6px 0 0 6px;\n    }\n\n    .card-body {\n      margin-top: 0.5rem;\n      margin-bottom: 0.5rem;\n      padding: 1rem;\n      max-width: 95%;\n      display: block;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      font-size: 12px;\n    }\n\n    .open-post {\n      display: flex;\n      position: absolute;\n      right: -20px;\n      bottom: -10px;\n      justify-content: center;\n      align-items: center;\n      font-size: 12px;\n\n      svg {\n        margin-left: 0;\n        height: 12px;\n      }\n    }\n  }\n']))),m=d.a.span(a||(a=Object(c.a)(["\n  display: block;\n  width: 100%;\n  cursor: ",";\n"])),(function(t){return t.isPostNotification?"pointer":"auto"})),g=d.a.div(o||(o=Object(c.a)(["\n  color: #a7abc3;\n  font-style: italic;\n  font-size: 11px;\n  position: absolute;\n  top: 0;\n  left: calc(100% + 10px);\n  display: flex;\n  height: 100%;\n  align-items: center;\n  white-space: nowrap;\n"]))),y=[.1,.2,.3,.4,.5,.6,.7,.8,.9],w=Object(r.forwardRef)((function(t,e){var n=t.reply,i=t.selectedChannel,a=t.isLastChat,o=t.chatMessageActions,c=t.user,d=t.timeFormat,w=t.isLastChatVisible,O=t.dictionary,x=t.users,k=Object(l.g)(),j=Object(l.i)(),E=Object(h.V)({dictionary:O,reply:n,selectedChannel:i,user:c,users:x}).parseBody,v=Object(b.b)({threshold:y,skip:!a}),C=Object(s.a)(v,3),T=C[0],L=C[1],N=C[2];Object(r.useEffect)((function(){a&&N&&(N.boundingClientRect.height-N.intersectionRect.height>=16?w&&o.setLastMessageVisiblility({status:!1}):w||o.setLastMessageVisiblility({status:!0}))}),[a,N,w,L]);return p.a.createElement(u,{ref:a?T:null},p.a.createElement(m,{ref:e,id:"bot-".concat(n.id),onClick:function(){if(n.body.startsWith("UPLOAD_BULK::")){var t=JSON.parse(n.body.replace("UPLOAD_BULK::",""));t.files&&o.viewFiles(t.files)}else if(n.body.startsWith("POST_CREATE::")){if(""!==n.body.replace("POST_CREATE::","").trim()){var e=JSON.parse(n.body.replace("POST_CREATE::",""));j&&j.workspaceId?j.folderId?k.push("/workspace/posts/".concat(j.folderId,"/").concat(j.folderName,"/").concat(j.workspaceId,"/").concat(Object(f.h)(j.workspaceName),"/post/").concat(e.post.id,"/").concat(Object(f.h)(e.post.title))):k.push("/workspace/posts/".concat(j.workspaceId,"/").concat(j.workspaceName,"/post/").concat(e.post.id,"/").concat(Object(f.h)(e.post.title))):k.push("/posts/".concat(e.post.id,"/").concat(Object(f.h)(e.post.title)))}}},dangerouslySetInnerHTML:{__html:E},isPostNotification:n.body.includes("POST_CREATE::")}),p.a.createElement(g,{className:"chat-timestamp",isAuthor:!1},p.a.createElement("span",{className:"reply-date created"},d.localizeTime(n.created_at.timestamp))))}));e.default=w}}]);