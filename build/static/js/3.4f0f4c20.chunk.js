(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[3],{1001:function(e,t,n){"use strict";n.r(t);var a=n(6),r=n(0),o=n.n(r),i=n(5),c=n(4),s=n(10),l=n(49),d=n(13);function m(){var e=Object(a.a)(["\n  cursor: pointer;\n  font-size: 13px;\n  .dark & {\n    background: #191c20 !important;\n    border-color: #ffffff14 !important;\n  }\n\n  ","\n\n  &.folder-list {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n    > ul {\n      list-style: none;\n      padding: 0.75rem 1.5rem;\n      width: 100%;\n      margin: 0;\n\n      li {\n        margin-bottom: 5px;\n      }\n    }\n  }\n"]);return m=function(){return e},e}function u(){var e=Object(a.a)([""]);return u=function(){return e},e}var p=i.b.div(u()),E=i.b.span(m(),(function(e){return e.active&&"\n        background: 0 0;\n        color: ".concat(e.theme.colors.secondary,';\n        &:after {\n          content: "";\n          width: 3px;\n          height: 100%;\n          background-color: ').concat(e.theme.colors.secondary,";\n          display: block;\n          position: absolute;\n          top: 0;\n          animation: fadeIn 0.15s linear;\n          left: 0;\n        }\n        .dark & {\n          color: ").concat(e.theme.colors.third,";\n        }\n    ")})),f=o.a.memo((function(e){var t=e.className,n=Object(l.i)(),a=Object(s.mb)()._t,r=Object(s.hb)(),i=Object(c.c)(),m=Object(c.d)((function(e){return e.global.meetings.filter})),u={statusToday:a("REMINDER.STATUS_TODAY","Today"),statusAll:a("REMINDER.STATUS_ALL","ALL"),statusExpired:a("REMINDER.STATUS_EXPIRED","Expired"),statusUpcoming:a("REMINDER.STATUS_UPCOMING","Upcoming"),statusOverdue:a("REMINDER.STATUS_OVERDUE","Overdue"),addedByMe:a("REMINDER.ADDED_BY_ME","Added by me"),addedByOthers:a("REMINDER.ADDED_BY_OTHERS","Added by others"),toasterGeneraError:a("TOASTER.GENERAL_ERROR","An error has occurred try again!"),toasterCreateMeeting:a("TOASTER.MEETING_CREATE_SUCCESS","You will be reminded about this comment under <b>Meetings</b>."),createMeeting:a("BUTTON.CREATE_MEETING","Create meeting")},f=function(e){document.body.classList.remove("mobile-modal-open"),i(Object(d.Y)(e.target.dataset.filter))};return o.a.createElement(p,{className:"todo-sidebar bottom-modal-mobile ".concat(t)},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("button",{className:"btn btn-primary btn-block",onClick:function(){var e=function(e,t){i(Object(d.M)(e,t))};!function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},a=function(n){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};e(n,(function(e,n){e&&r.error(u.toasterGeneraError),n&&r.success(o.a.createElement("span",{dangerouslySetInnerHTML:{__html:u.toasterCreateMeeting}})),a(e,n),t(e,n)}))},c={type:"video_reminder",actions:{onSubmit:a},videoMeeting:!0,params:n};i(Object(d.a)(c))}()}},u.createMeeting)),o.a.createElement("div",{className:"app-sidebar-menu",tabIndex:"1"},o.a.createElement("div",{className:"list-group list-group-flush"},o.a.createElement(E,{onClick:f,"data-filter":"ALL",active:"ALL"===m,className:"list-group-item d-flex align-items-center"},o.a.createElement("span",{className:"text-primary fa fa-circle mr-2"}),u.statusAll),o.a.createElement(E,{onClick:f,"data-filter":"TODAY",active:"TODAY"===m,className:"list-group-item d-flex align-items-center"},o.a.createElement("span",{"data-filter":"TODAY"},o.a.createElement("span",{className:"text-success fa fa-circle mr-2"}),u.statusToday)),o.a.createElement(E,{onClick:f,"data-filter":"NEW",active:"NEW"===m,className:"list-group-item d-flex align-items-center"},o.a.createElement("span",{"data-filter":"NEW"},o.a.createElement("span",{className:"text-default fa fa-circle mr-2"}),u.statusUpcoming)),o.a.createElement(E,{onClick:f,"data-filter":"ASSIGNED_TO_OTHERS",active:"ASSIGNED_TO_OTHERS"===m,className:"list-group-item d-flex align-items-center"},o.a.createElement("span",{"data-filter":"ASSIGNED_TO_OTHERS"},o.a.createElement("span",{className:"text-info fa fa-circle mr-2"}),u.addedByMe)),o.a.createElement(E,{onClick:f,"data-filter":"ADDED_BY_OTHERS",active:"ADDED_BY_OTHERS"===m,className:"list-group-item d-flex align-items-center"},o.a.createElement("span",{"data-filter":"ADDED_BY_OTHERS"},o.a.createElement("span",{className:"text-info fa fa-circle mr-2"}),u.addedByOthers))))))})),b=n(7),g=n(12);function h(){var e=Object(a.a)(["\n  overflow: inherit !important;\n  .action-left {\n    ul {\n      margin-bottom: 0;\n      display: inherit;\n\n      li {\n        position: relative;\n\n        .button-dropdown {\n        }\n      }\n    }\n    .app-sidebar-menu-button {\n      margin-left: 8px;\n    }\n  }\n  .btn-cross {\n    position: absolute;\n    top: 0;\n    right: 45px;\n    border: 0;\n    background: transparent;\n    padding: 0;\n    height: 100%;\n    width: 36px;\n    border-radius: 4px;\n    z-index: 9;\n    svg {\n      width: 16px;\n      color: #495057;\n    }\n  }\n"]);return h=function(){return e},e}var _=i.b.div(h()),N=o.a.memo((function(e){var t=e.className,n=void 0===t?"":t,a=Object(c.c)(),i=Object(r.useState)(""),l=Object(b.a)(i,2),m=l[0],u=l[1],p={searchMeetingPlaceholder:(0,Object(s.mb)()._t)("SEARCH_MEETING_PLACEHOLDER","Seach meetings")};Object(r.useEffect)((function(){var e=setTimeout((function(){""!==m&&a(Object(d.Z)(m))}),1e3);return function(){clearTimeout(e),a(Object(d.Z)(""))}}),[m]);return o.a.createElement(_,{className:"todos-header app-action ".concat(n)},o.a.createElement("div",{className:"action-left"},o.a.createElement("span",{className:"app-sidebar-menu-button btn btn-outline-light",onClick:function(){document.body.classList.toggle("mobile-modal-open")}},o.a.createElement(g.u,{icon:"menu"}))),o.a.createElement("div",{className:"action-right"},o.a.createElement("div",{className:"input-group"},o.a.createElement("input",{type:"text",onChange:function(e){u(e.target.value)},value:m,className:"form-control",placeholder:p.searchMeetingPlaceholder,"aria-describedby":"button-addon1"}),""!==m.trim()&&o.a.createElement("button",{onClick:function(){u(""),a(Object(d.Z)(""))},className:"btn-cross",type:"button"},o.a.createElement(g.u,{icon:"x"})),o.a.createElement("div",{className:"input-group-append"},o.a.createElement("button",{className:"btn btn-outline-light",type:"button",id:"button-addon1"},o.a.createElement(g.u,{icon:"search"}))))))})),O=n(890),T=n(23),R=n(45);function v(){var e=Object(a.a)(["\n  @media all and (max-width: 480px) {\n    flex-flow: row wrap;\n  }\n"]);return v=function(){return e},e}function D(){var e=Object(a.a)(["\n  min-width: 142px;\n  text-align: right;\n  @media all and (max-width: 480px) {\n    min-width: 70px;\n  }\n"]);return D=function(){return e},e}function A(){var e=Object(a.a)(["\n  display: flex;\n  align-items: center;\n  min-width: 130px;\n"]);return A=function(){return e},e}function x(){var e=Object(a.a)(["\n  max-height: 50px;\n  > * {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n"]);return x=function(){return e},e}function k(){var e=Object(a.a)(["\n  &.reminder-list {\n    background: transparent;\n    font-size: 13px;\n    padding: 5px 20px;\n    margin-top: 0;\n    border-radius: 0;\n    border-left: none;\n    border-right: none;\n    border-top: none;\n    border-bottom: 1px solid #ebebeb;\n    .dark & {\n      border-color: rgba(155, 155, 155, 0.1);\n    }\n  }\n  .avatars-container {\n    display: flex;\n    align-items: center;\n    min-width: 105px;\n    justify-content: flex-end;\n  }\n  .workspace-label {\n    text-align: right;\n    cursor: pointer;\n  }\n  .driff-talk-label {\n    text-align: left;\n    span {\n      display: inline-flex;\n      align-items: center;\n    }\n    svg {\n      margin-left: 5px;\n      width: 1rem;\n      height: 1rem;\n    }\n  }\n  .todo-title {\n    cursor: pointer;\n  }\n  .badge.badge-light {\n    background: #efefef;\n    color: #828282;\n    .dark & {\n      background: rgb(175, 184, 189, 0.2) !important;\n      color: #fff;\n    }\n  }\n  .hover-btns {\n    display: none;\n    margin-right: 0.5rem;\n  }\n  &:hover {\n    .hover-btns {\n      display: flex;\n    }\n    .more-options {\n      display: inline-block;\n    }\n  }\n  .reminder-date,\n  .todo-type-badge,\n  .todo-title-description {\n    cursor: pointer;\n  }\n  .todo-title-description i {\n    margin-right: 5px;\n  }\n  @media all and (max-width: 480px) {\n    .reminder-content {\n      flex-wrap: wrap;\n    }\n    .avatars-container {\n      min-width: 40px;\n    }\n  }\n"]);return k=function(){return e},e}function M(){var e=Object(a.a)(["\n  display: flex;\n  > svg {\n    width: 1rem;\n    height: 1rem;\n  }\n  .feather-pencil {\n    margin-right: 5px;\n  }\n"]);return M=function(){return e},e}function y(){var e=Object(a.a)(["\n  width: 16px;\n  cursor: pointer;\n"]);return y=function(){return e},e}var S=Object(i.b)(g.u)(y()),I=i.b.div(M()),w=i.b.li(k()),C=i.b.div(x()),j=i.b.div(A()),U=(i.b.div(D()),i.b.div(v())),L=function(e){var t=e.todo,n=e.todoActions,a=e.dictionary,i=e.todoFormat,s=e.todoFormatShortCode,l=e.showWsBadge,d=e.handleRedirectToWorkspace,m=Object(c.c)(),u=Object(c.d)((function(e){return e.session.user})),p=Object(c.d)((function(e){return e.files.fileBlobs})),E=Object(r.useRef)(null);Object(r.useEffect)((function(){E.current&&E.current.querySelectorAll("img").forEach((function(e){var n=e.getAttribute("src");if(e.classList.contains("has-listener")){var a=t.files.find((function(e){return n.includes(e.code)}));a&&p[a.id]&&(e.setAttribute("src",p[a.id]),e.setAttribute("data-id",a.id))}else{e.classList.add("has-listener");var r=t.files.find((function(e){return n.includes(e.code)}));r&&p[r.id]&&(e.setAttribute("src",p[r.id]),e.setAttribute("data-id",r.id))}}));var e=t.files.filter((function(e){return e.type&&e.type.includes("image")}));e.length&&e.forEach((function(e){p[e.id]||R.sessionService.loadSession().then((function(t){var n=t.token;fetch(e.view_link,{method:"GET",keepalive:!0,headers:{Authorization:n,"Access-Control-Allow-Origin":"*",Connection:"keep-alive",crossorigin:!0}}).then((function(e){return e.blob()})).then((function(t){var n=URL.createObjectURL(t);!function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};m(Object(T.qb)(e,t))}({id:e.id,src:n})})).catch((function(e){console.log(e,"error fetching image")}))}))}))}),[t.files,t.description,E]);var f=function(e){e.stopPropagation(),e.preventDefault(),n.updateFromModal(t)},b=t.assigned_to&&t.assigned_to.id!==t.user||null!==t.workspace&&null===t.assigned_to||null===t.workspace&&null!==t.assigned_to&&t.assigned_to.id!==t.user||t.assigned_to&&t.author&&t.assigned_to.id!==t.author.id;return o.a.createElement(o.a.Fragment,null,o.a.createElement(w,{className:"reminder-list"},t.workspace&&l&&o.a.createElement("div",{className:"text-truncate false mt-2 workspace-label",onClick:function(e){return d(e,t)}},o.a.createElement("span",{className:"badge ml-4 badge-light border-0"},t.workspace.name)),o.a.createElement("div",{className:"d-flex align-items-center reminder-content"},o.a.createElement("span",{className:"align-items-center todo-title-description text-truncate mr-3",onClick:function(e){e.preventDefault(),t.author&&t.author.id!==u.id||n.updateFromModal(t)}},o.a.createElement("span",{className:"todo-title"},t.title),t.description&&o.a.createElement(C,{ref:E,className:"text-truncate",dangerouslySetInnerHTML:{__html:t.description}})),t.author&&t.author.id===u.id&&o.a.createElement(I,{className:"hover-btns ml-1"},o.a.createElement(S,{icon:"pencil",onClick:f}),o.a.createElement(S,{icon:"trash",onClick:function(e){e.stopPropagation(),e.preventDefault(),n.removeConfirmation(t)}})),o.a.createElement(U,{className:"d-flex align-items-center ml-auto"},o.a.createElement(j,null,o.a.createElement(S,{icon:"calendar"}),o.a.createElement(g.v,{content:t.remind_at?i(t.remind_at.timestamp):a.addDate},o.a.createElement("span",{className:"badge mr-3 reminder-date ".concat(function(e){return"OVERDUE"===e.status?"text-danger":"TODAY"===e.status?null===e.remind_at?"text-default":"text-success":"NEW"===e.status?"text-default":void 0}(t)),onClick:f},t.remind_at?s(t.remind_at.timestamp,"MM/DD/YYYY"):a.addDate))),o.a.createElement("div",{className:"avatars-container"},null!==t.author&&o.a.createElement(g.a,{name:t.author.name,tooltipName:a.reminderAuthor,imageLink:t.author.profile_image_link,id:t.author.id}),b&&o.a.createElement(o.a.Fragment,null,o.a.createElement(S,{icon:"chevron-right"}),o.a.createElement(g.a,{name:t.assigned_to?t.assigned_to.name:t.workspace.name,tooltipName:a.reminderAssignedTo,imageLink:t.assigned_to?t.assigned_to.profile_image_link:t.workspace&&t.workspace.team_channel?t.workspace.team_channel.icon_link:null,id:t.assigned_to?t.assigned_to.id:t.workspace.id,type:t.assigned_to?"USER":"TOPIC",noDefaultClick:!t.assigned_to})))))))};function P(){var e=Object(a.a)(["\n  padding-top: 15px;\n  padding-bottom: 15px;\n  :first-of-type {\n    padding-bottom: 10px;\n  }\n  :nth-child(even) {\n    background: #f8f9fa;\n  }\n  :nth-child(odd) {\n    background: transparent;\n  }\n  border-bottom: 1px solid #ebebeb;\n  :last-of-type {\n    border: none;\n  }\n  .dark & {\n    :first-of-type {\n      border-bottom: none;\n    }\n    :last-of-type {\n      background: #2b2d31;\n      border-color: rgba(155, 155, 155, 0.1);\n    }\n    :last-of-type .list-group-item {\n      background: transparent !important;\n    }\n  }\n\n  .custom-checkbox .ccl span:first-child {\n    border-radius: 10px;\n  }\n\n  .list-group-done .custom-checkbox .cci.cci-active + .ccl span:first-child {\n    background: #efefef;\n    border: 1px solid #9098a9;\n    color: #8b8b8b;\n  }\n  .list-group-done .custom-checkbox .cci.cci-active + .ccl span:first-child svg {\n    color: #8b8b8b;\n    stroke: #8b8b8b;\n  }\n"]);return P=function(){return e},e}function H(){var e=Object(a.a)(["\n  flex: unset !important;\n  height: 100% !important;\n  overflow: unset !important;\n  ",'\n  .list-group {\n    .list-group-item {\n      padding: 0rem 1.5rem 0 0.75rem;\n\n      > a {\n        display: block;\n        width: 100%;\n\n        .badge-todo-type {\n          border: 1px solid #000;\n        }\n      }\n    }\n  }\n\n  .custom-checkbox {\n    position: relative;\n    top: 1.5px;\n    padding: 0;\n    input[type="checkbox"] {\n      cursor: pointer;\n    }\n\n    .cci.cci-active + .ccl {\n      span:first-child {\n        background: #00c851;\n        border-color: #00c851;\n      }\n    }\n  }\n\n  .todo-title {\n    // color: #343a40;\n\n    &.description {\n      color: #b8b8b8;\n    }\n\n    svg {\n      height: 16px;\n    }\n  }\n\n  .card-body {\n    padding: 0;\n    overflow: unset;\n    height: 100%;\n    display: flex;\n    flex-flow: column;\n  }\n']);return H=function(){return e},e}var F=i.b.div(H(),(function(e){return e.active&&"\n  height: 100% !important;\n  "})),Y=Object(i.b)(O.a)(P()),B=o.a.memo((function(e){var t=e.className,n=void 0===t?"":t,a=e.workspaceName,i=void 0===a?null:a,d=e.isWorkspace,m=Object(s.mb)()._t,u=Object(c.d)((function(e){return e.global.meetings})),p=[m("REMINDER.NO_ITEMS_FOUND_HEADER_2","WOO!"),m("REMINDER.NO_ITEMS_FOUND_HEADER_4","Queue\u2019s empty, time to dance!"),m("REMINDER.NO_ITEMS_FOUND_HEADER_5","No reminders.")],E=[m("REMINDER.NO_ITEMS_FOUND_TEXT_2","Nothing here but me\u2026 \ud83d\udc7b"),m("REMINDER.NO_ITEMS_FOUND_TEXT_4","Job well done!\ud83d\udc83\ud83d\udd7a"),m("REMINDER.NO_ITEMS_FOUND_TEXT_5","You run a tight ship captain! \ud83d\ude80")];""!==u.search&&(p=[m("REMINDER.NO_ITEMS_FOUND_HEADER_1","Couldn\u2019t find what you\u2019re looking for.")],E=[m("REMINDER.NO_ITEMS_FOUND_TEXT_1","Try something else, Sherlock. \ud83d\udd75")]);var f=Object(r.useState)(Math.floor(Math.random()*p.length)),g=Object(b.a)(f,2),h=g[0],_=g[1],N={searchInputPlaceholder:m("REMINDER.SEARCH_INPUT_PLACEHOLDER","Search your reminders on title and description."),createNewTodoItem:m("REMINDER.CREATE_NEW_TODO_ITEM","Add new"),typePost:m("REMINDER.TYPE_POST","Post"),typeChat:m("REMINDER.TYPE_CHAT","Chat"),typePostComment:m("REMINDER.TYPE_POST_COMMENT","Post comment"),statusToday:m("REMINDER.STATUS_TODAY","Today"),statusAll:m("REMINDER.STATUS_ALL","ALL"),statusExpired:m("REMINDER.STATUS_EXPIRED","Expired"),statusUpcoming:m("REMINDER.STATUS_UPCOMING","Upcoming"),statusOverdue:m("REMINDER.STATUS_OVERDUE","Overdue"),statusUpcomingToday:m("REMINDER.STATUS_UPCOMING","Upcoming Today"),statusDone:m("REMINDER.STATUS_DONE","Done"),emptyText:m("REMINDER.EMPTY_STATE_TEXT","Use your reminder list to keep track of all your tasks and activities."),emptyButtonText:m("REMINDER.EMPTY_STATE_BUTTON_TEXT","New reminder"),noItemsFoundHeader:p[h],noItemsFoundText:E[h],actionReschedule:m("REMINDER.ACTION_RESCHEDULE","Reschedule"),actionEdit:m("REMINDER.ACTION_EDIT","Edit"),actionMarkAsDone:m("REMINDER.ACTION_MARK_AS_DONE","Mark as done"),actionMarkAsUndone:m("REMINDER.ACTION_MARK_AS_UNDONE","Mark as not done"),actionRemove:m("REMINDER.ACTION_REMOVE","Remove"),actionFilter:m("REMINDER.ACTION_FILTER","Filter"),reminderAuthor:m("REMINDER.AUTHOR","Author"),reminderAssignedTo:m("REMINDER.ASSIGNED_TO","Assigned to"),todo:m("REMINDER.TO_DO","To do"),done:m("REMINDER.DONE","Done"),addDate:m("REMINDER.ADD_DATE","Add date"),addedByMe:m("REMINDER.ADDED_BY_ME","Added by me"),addedByOthers:m("REMINDER.ADDED_BY_OTHERS","Added by others"),sortAlpha:m("TODO_SORT_OPTIONS.ALPHA","Sort by alphabetical order"),sortDate:m("TODO_SORT_OPTIONS.DATE","Sort by due date")},O=Object(s.jb)(!0),T=O.getVideoReminders,R=O.action,v=O.isLoaded,D=Object(s.gb)(),A=D.todoFormat,x=D.todoFormatShortCode,k=T({filter:{status:u.filter,search:u.search,isWorkspace:d}}),M=Math.floor(Date.now()/1e3),y=k.filter((function(e){return null===e.remind_at||e.remind_at&&e.remind_at.timestamp>M})),S=k.filter((function(e){return!(null===e.remind_at||e.remind_at&&e.remind_at.timestamp>M)})),I=Object(s.U)(),w=Object(l.i)(),C=Object(r.useState)({todo:!0,done:!1}),j=Object(b.a)(C,2),U=j[0],P=j[1],H=Object(r.useState)(!0),B=Object(b.a)(H,2),W=B[0],G=B[1];Object(r.useEffect)((function(){_(Math.floor(Math.random()*p.length))}),[u.filter]);var X=function(e,t){e.preventDefault(),e.stopPropagation(),I.toWorkspace(t.workspace,"reminders")},V=function(){G(!W)},z=function(e){return Object.values(e).sort((function(e,t){return W?e.remind_at&&t.remind_at?t.remind_at.timestamp-e.remind_at.timestamp:null===e.remind_at&&null===t.remind_at?e.title.localeCompare(t.title):void 0:e.title.localeCompare(t.title)}))};return o.a.createElement(F,{className:"todos-body card app-content-body mb-4 ".concat(n),active:!y.length},!v&&o.a.createElement("div",{className:"card-body d-flex justify-content-center align-items-center",style:{minHeight:"400px"}},o.a.createElement("span",{className:"spinner-border spinner-border-sm mr-2",role:"status","aria-hidden":"true"})),v&&o.a.createElement("div",{className:"card-body"},o.a.createElement(Y,{active:U.todo,dictionary:N,handleHeaderClick:function(){P({todo:!U.todo,done:U.done})},headerText:"Meetings",items:z(y),params:w,workspaceName:i,sortByDate:W,handleSort:V,ItemList:function(e){return o.a.createElement(L,{key:e.id,todo:e,todoActions:R,dictionary:N,todoFormat:A,todoFormatShortCode:x,showWsBadge:!w.hasOwnProperty("workspaceId"),handleRedirectToWorkspace:X})}}),o.a.createElement(Y,{active:U.done,dictionary:N,showEmptyState:!1,listGroupClassname:"list-group-done",handleHeaderClick:function(){P({todo:U.todo,done:!U.done})},headerText:"Past meetings",items:z(S),params:w,workspaceName:null,sortByDate:W,handleSort:V,ItemList:function(e){return o.a.createElement(L,{key:e.id,todo:e,todoActions:R,dictionary:N,todoFormat:A,todoFormatShortCode:x,showWsBadge:!w.hasOwnProperty("workspaceId"),handleRedirectToWorkspace:X})}})))}));function W(){var e=Object(a.a)(["\n  overflow: auto;\n  text-align: left;\n  min-height: 100px;\n  .app-sidebar-menu {\n    overflow: hidden;\n    outline: currentcolor none medium;\n  }\n  .app-block {\n    overflow: unset !important;\n    height: auto;\n    .app-content .app-action .action-right {\n      margin-left: 0;\n    }\n    .app-content .app-action {\n      padding: 20px;\n    }\n  }\n"]);return W=function(){return e},e}var G=i.b.div(W());t.default=o.a.memo((function(e){var t=e.isWorkspace,n=void 0!==t&&t;return o.a.createElement(G,{className:"container-fluid h-100 fadeIn"},o.a.createElement("div",{className:"row app-block"},o.a.createElement(f,{className:"col-lg-3"}),o.a.createElement("div",{className:"col-lg-9 app-content mb-4"},o.a.createElement("div",{className:"app-content-overlay"}),o.a.createElement(N,null),o.a.createElement(B,{isWorkspace:n}))))}))}}]);