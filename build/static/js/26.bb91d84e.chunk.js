(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[26],{999:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n(7),c=n(6),i=n(0),o=n.n(i),l=n(5),s=n(4),u=n(293);function m(){var e=Object(c.a)(["\n  .list-group-item:last-child {\n    border-bottom-width: thin !important;\n  }\n  li {\n    cursor: pointer;\n  }\n  &.list-group .list-group-item.active {\n    border-color: #eeebee;\n    background-color: #fafafa !important;\n    .dark & {\n      background-color: #111417 !important;\n    }\n  }\n  .text-external {\n    color: ",";\n  }\n"]);return m=function(){return e},e}var d=l.b.ul(m(),(function(e){return e.theme.colors.fourth})),p=function(e){var t=e.actions,n=e.counters,a=e.dictionary,r=e.filterBy,c="external"===Object(s.d)((function(e){return e.session.user})).type,i=Object(s.d)((function(e){return e.workspaces.workspaces})),l=Object(u.a)().removeParam,m=function(e){e.persist(),l("user-id"),r!==e.target.dataset.value&&(t.updateSearch({filterBy:e.target.dataset.value,filterByFolder:null}),document.body.classList.remove("mobile-modal-open"))};return o.a.createElement(d,{className:"list-group list-group-flush"},o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"all"===r?"active":""),"data-value":"all",onClick:m},o.a.createElement("span",{className:"text-primary fa fa-circle mr-2"}),a.all,o.a.createElement("span",{className:"small ml-auto"},n.nonMember+n.member>0&&n.nonMember+n.member)),o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"shared"===r?"active":""),"data-value":"shared",onClick:m},o.a.createElement("span",{className:"text-external fa fa-circle mr-2"}),a.sharedClient,o.a.createElement("span",{className:"small ml-auto"},Object.values(i).filter((function(e){return e.sharedSlug})).length)),o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"member"===r?"active":""),"data-value":"member",onClick:m},o.a.createElement("span",{className:"text-success fa fa-circle mr-2"}),a.labelJoined,o.a.createElement("span",{className:"small ml-auto"},n.member>0&&n.member)),o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"favourites"===r?"active":""),"data-value":"favourites",onClick:m},o.a.createElement("span",{className:"text-warning fa fa-circle mr-2"}),a.favourites,o.a.createElement("span",{className:"small ml-auto"},n.favourites>0&&n.favourites)),o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"new"===r?"active":""),"data-value":"new",onClick:m},o.a.createElement("span",{className:"text-info fa fa-circle mr-2"}),a.new,o.a.createElement("span",{className:"small ml-auto"},n.new>0&&n.new)),!c&&o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"nonMember"===r?"active":""),"data-value":"nonMember",onClick:m},o.a.createElement("span",{className:"text-secondary fa fa-circle mr-2"}),a.notJoined,o.a.createElement("span",{className:"small ml-auto"},n.nonMember>0&&n.nonMember)),!c&&o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"external"===r?"active":""),"data-value":"external",onClick:m},o.a.createElement("span",{className:"text-external fa fa-circle mr-2"}),a.withClient,o.a.createElement("span",{className:"small ml-auto"},n.external>0&&n.external)),o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"private"===r?"active":""),"data-value":"private",onClick:m},o.a.createElement("span",{className:"text-danger fa fa-circle mr-2"}),a.private,o.a.createElement("span",{className:"small ml-auto"},n.private>0&&n.private)),o.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"archived"===r?"active":""),"data-value":"archived",onClick:m},o.a.createElement("span",{className:"text-light fa fa-circle mr-2"}),a.archived,o.a.createElement("span",{className:"small ml-auto"},n.archived>0&&n.archived)))},b=n(12),f=n(893),E=n(61),h=n.n(E),v=n(13);function g(){var e=Object(c.a)([""]);return g=function(){return e},e}function O(){var e=Object(c.a)(["\n  width: 1em;\n  vertical-align: bottom;\n  margin-right: 40px;\n  cursor: pointer;\n\n  &:hover {\n    color: #000000;\n  }\n"]);return O=function(){return e},e}function w(){var e=Object(c.a)(["\n  margin-right: 4px;\n"]);return w=function(){return e},e}function k(){var e=Object(c.a)(["\n  display: inline-flex;\n  align-items: center;\n"]);return k=function(){return e},e}function N(){var e=Object(c.a)(["\n  .app-sidebar-menu {\n    overflow: hidden;\n    outline: currentcolor none medium;\n    @media (max-width: 991.99px) {\n      border-bottom-left-radius: 0 !important;\n      border-bottom-right-radius: 0 !important;\n      display: flex;\n      flex-direction: column;\n      .card-body {\n        display: none;\n      }\n      .create-new-post-wrapper {\n        border-top: 1px solid #ebebeb;\n        display: block;\n        order: 9;\n      }\n      .list-group-flush {\n        border-top: 1px solid #ebebeb;\n      }\n    }\n  }\n  @media (max-width: 991.99px) {\n    margin-bottom: 0 !important;\n  }\n"]);return N=function(){return e},e}var A=l.b.div(N()),S=l.b.button(k()),y=Object(l.b)(b.u)(w()),C=Object(l.b)(b.u)(O()),x=l.b.div(g()),_=function(e){var t=e.actions,n=e.counters,a=e.dictionary,r=e.filterBy,c=Object(s.c)(),i=Object(s.d)((function(e){return e.session.user})),l=Object(s.d)((function(e){return e.admin.security}));return o.a.createElement(A,{className:"col-md-3 app-sidebar bottom-modal-mobile"},o.a.createElement(x,{className:"mobile-overlay",onClick:function(){document.body.classList.remove("mobile-modal-open")}}),o.a.createElement("div",{className:"bottom-modal-mobile_inner"},o.a.createElement("div",{className:"app-sidebar-menu",tabIndex:"2"},"internal"===i.type&&i.role&&i.role.id<=l.add_workspace&&o.a.createElement("div",{className:"card-body create-new-post-wrapper"},o.a.createElement(S,{className:"btn btn-primary btn-block",onClick:t.showWorkspaceModal},o.a.createElement(y,{icon:"circle-plus"}),a.addNewWorkspace)),o.a.createElement("div",{className:"post-filter-item list-group list-group-flush"},o.a.createElement("span",{className:"list-group-item d-flex align-items-center pr-3","data-value":"inbox"},a.filters)),o.a.createElement(p,{actions:t,counters:n,dictionary:a,filterBy:r}),o.a.createElement("div",{className:"post-filter-item list-group list-group-flush"},o.a.createElement("span",{className:"list-group-item d-flex align-items-center pr-3","data-value":"inbox"},a.folders,o.a.createElement("span",{className:"ml-auto"},o.a.createElement(h.a,{onToggle:function(){document.querySelectorAll("span.react-tooltip-lite").forEach((function(e){e.parentElement.classList.toggle("tooltip-active")}))},content:a.newFolder},o.a.createElement(C,{className:"mr-0",icon:"plus",onClick:function(){c(Object(v.a)({type:"workspace_folder",mode:"create"}))}}))))),o.a.createElement(f.a,null))))},j=n(84),L=n.n(j);function R(){var e=Object(c.a)(["\n  overflow: inherit !important;\n  .action-right {\n    margin: 0 !important;\n  }\n  .action-left {\n    ul {\n      margin-bottom: 0;\n      display: inherit;\n\n      li {\n        position: relative;\n\n        .button-dropdown {\n        }\n      }\n    }\n    .app-sidebar-menu-button {\n      margin-left: 8px;\n    }\n  }\n  .btn-cross {\n    position: absolute;\n    top: 0;\n    right: 45px;\n    border: 0;\n    background: transparent;\n    padding: 0;\n    height: 100%;\n    width: 36px;\n    border-radius: 4px;\n    z-index: 9;\n    svg {\n      width: 16px;\n      color: #495057;\n    }\n  }\n  .loading {\n    width: 1rem;\n    height: 1rem;\n  }\n"]);return R=function(){return e},e}var W=l.b.div(R()),P=o.a.memo((function(e){var t=e.actions,n=e.dictionary,c=e.search,l=c.value,s=c.searching,u=c.filterBy,m=c.query,d=Object(i.useState)(""),p=Object(r.a)(d,2),f=p[0],E=p[1],h=Object(i.useRef)(null),v=function(e){if(e.trim()!==m.value.trim()){h.current&&(h.current.cancel("Operation canceled due to new request."),h.current=null),h.current=L.a.CancelToken.source();var n={value:e,filterBy:u,searching:!0};t.updateSearch(n),t.search({search:n.value,skip:0,limit:25,filter_by:n.filterBy,cancelToken:h.current.token},(function(e,r){e&&t.updateSearch({searching:!1}),t.updateSearch({searching:!1,query:Object(a.a)(Object(a.a)({},m),{},{value:n.value,hasMore:r.data.has_more,skip:m.skip+r.data.workspaces.length})})}))}},g=function(){t.updateSearch({value:"",query:{hasMore:!1,limit:25,skip:0,filterBy:u,value:""}}),E("")};Object(i.useEffect)((function(){var e=setTimeout((function(){v(f)}),500);return function(){return clearTimeout(e)}}),[f]);return o.a.createElement(W,{className:"files-header app-action"},o.a.createElement("div",{className:"action-left mt-2"},o.a.createElement("span",{className:"app-sidebar-menu-button btn btn-outline-light",onClick:function(){document.body.classList.toggle("mobile-modal-open")}},o.a.createElement(b.u,{icon:"menu"}))),o.a.createElement("div",{className:"action-right"},o.a.createElement("div",{className:"input-group"},o.a.createElement("input",{type:"text",onChange:function(e){""===e.target.value.trim()&&""!==l?g():E(e.target.value)},value:f,onKeyDown:function(e){"Enter"!==e.key||s||v(f)},className:"form-control",placeholder:n.searchWorkspacePlaceholder,"aria-describedby":"button-addon1"}),s&&o.a.createElement("button",{className:"btn-cross",type:"button"},o.a.createElement(b.k,null)),!s&&""!==f.trim()&&o.a.createElement("button",{onClick:g,className:"btn-cross",type:"button"},o.a.createElement(b.u,{icon:"x"})),o.a.createElement("div",{className:"input-group-append"},o.a.createElement("button",{className:"btn btn-outline-light",type:"button",id:"button-addon1",onClick:v},o.a.createElement(b.u,{icon:"search"}))))))})),T=n(11),D=n(9),I=n(10);function K(){var e=Object(c.a)(["\n  width: 0.8rem;\n  height: 0.8rem;\n  margin-right: 3px;\n"]);return K=function(){return e},e}function B(){var e=Object(c.a)(["\n  background: #00c851;\n  border-radius: 50%;\n  margin-right: 3px;\n"]);return B=function(){return e},e}function F(){var e=Object(c.a)(["\n  width: 0.8rem;\n  height: 0.8rem;\n  color: #fff;\n  stroke-width: 3;\n  padding: 2px;\n"]);return F=function(){return e},e}function M(){var e=Object(c.a)(["\n  span.text-success {\n    margin-right: 0;\n  }\n"]);return M=function(){return e},e}function H(){var e=Object(c.a)(["\n  width: 1rem;\n  height: 1rem;\n  margin-right: 3px;\n"]);return H=function(){return e},e}function J(){var e=Object(c.a)(["\n  .workspace-title {\n    cursor: pointer;\n  }\n  .labels span {\n    display: flex;\n    align-items: center;\n  }\n  .mobile-icon {\n    display: none;\n  }\n  @media (max-width: 414px) {\n    .badge {\n      display: none;\n    }\n    .mobile-icon {\n      display: block;\n    }\n  }\n"]);return J=function(){return e},e}var V=l.b.div(J()),U=Object(l.b)(b.u)(H()),q=l.b.span(M()),Y=Object(l.b)(b.u)(F()),z=l.b.span(B()),G=Object(l.b)(b.u)(K()),X=function(e){var t=e.dictionary,n=e.isExternal,a=e.isMember,r=e.item,c=e.onRedirect,i=e.members;return o.a.createElement(V,{className:"workspace-details"},o.a.createElement("div",{className:"title-labels"},o.a.createElement("span",{className:"workspace-title",onClick:function(e){return c(e,r)}},r.topic.name),r.topic.is_locked&&o.a.createElement(U,{icon:"lock"}),r.topic.is_shared&&!n&&!r.slug&&o.a.createElement(o.a.Fragment,null,o.a.createElement("span",{className:"badge badge-external ml-1 align-items-center"},o.a.createElement(U,{icon:"eye"})," ",t.withClient),o.a.createElement(U,{icon:"eye",className:"mobile-icon"})),r.slug&&o.a.createElement(o.a.Fragment,null,o.a.createElement("span",{className:"badge badge-external ml-1 align-items-center"},o.a.createElement(G,{icon:"repeat"})," ",t.sharedClient),o.a.createElement(U,{icon:"eye",className:"mobile-icon"}))),o.a.createElement("div",{className:"labels"},a&&o.a.createElement(q,{className:"mr-2"},o.a.createElement(z,null,o.a.createElement(Y,{icon:"check"})),o.a.createElement("span",{className:"text-success"},t.labelJoined)),o.a.createElement("span",{className:"mr-2"},o.a.createElement(U,{icon:"user"}),i.length),r.workspace&&o.a.createElement("span",{className:"mr-2"},o.a.createElement(U,{icon:"folder"}),r.workspace.name)))};function Z(){var e=Object(c.a)(["\n  padding: 5px 10px;\n  font-size: 12px;\n  font-weight: 500;\n"]);return Z=function(){return e},e}function Q(){var e=Object(c.a)(["\n  width: 1rem;\n  height: 1rem;\n  margin-right: 10px;\n  &.favorite {\n    color: rgb(255, 193, 7);\n    fill: rgb(255, 193, 7);\n  }\n  :hover {\n    color: ",";\n    cursor: pointer;\n    &.favorite {\n      color: rgb(255, 193, 7);\n      fill: rgb(255, 193, 7);\n    }\n  }\n"]);return Q=function(){return e},e}function $(){var e=Object(c.a)(["\n  margin-left: 10px;\n"]);return $=function(){return e},e}var ee=l.b.div($()),te=Object(l.b)(b.u)(Q(),(function(e){return e.theme.colors.primary})),ne=l.b.button(Z()),ae=function(e){var t=e.actions,n=e.dictionary,a=e.isExternal,r=e.isMember,c=e.item;return o.a.createElement(ee,{className:"workspace-list-buttons"},r&&!a&&o.a.createElement(te,{icon:"pencil",onClick:function(){return t.edit(c)}}),o.a.createElement(te,{icon:"star",className:"".concat(c.topic.is_favourite&&"favorite"),onClick:function(){return t.favourite(c)}}),r&&o.a.createElement(te,{icon:c.topic.is_active?"bell":"bell-off",onClick:function(){t.toggleWorkspaceNotification(c)}}),r&&!a&&o.a.createElement(te,{icon:"trash",onClick:function(){return t.showArchiveConfirmation(c)}}),o.a.createElement(ne,{className:"btn ".concat(r?"btn-danger":"btn-primary"),onClick:function(){r?t.leave(c):t.join(c)}},r?n.buttonLeave:n.buttonJoin))};function re(){var e=Object(c.a)(["\n  position: absolute;\n  z-index: 2;\n  width: 1rem;\n  height: 1rem;\n  top: 0;\n  right: 0;\n  color: rgb(255, 193, 7);\n  fill: rgb(255, 193, 7);\n"]);return re=function(){return e},e}function ce(){var e=Object(c.a)(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  list-style: none;\n  border-right: none;\n  border-left: none;\n\n  .workspace-icon {\n    position: relative;\n  }\n  .workspace-list-buttons {\n    display: none;\n  }\n  .workspace-title {\n    font-size: 1rem;\n  }\n  .title-labels,\n  .labels {\n    display: flex;\n  }\n  .title-labels {\n    align-items: center;\n    .feather-lock {\n      margin: 0 5px;\n    }\n    .feather-eye {\n      width: 0.8rem;\n      height: 0.8rem;\n    }\n  }\n  :hover {\n    button {\n      display: inline-flex;\n    }\n    .workspace-list-buttons {\n      display: block;\n    }\n  }\n"]);return ce=function(){return e},e}var ie=l.b.li(ce()),oe=Object(l.b)(b.u)(re()),le=function(e){var t=e.actions,n=e.dictionary,a=e.item,r=Object.values(a.members).map((function(e){return e.member_ids?e.member_ids:e.id})).flat(),c=Object(D.a)(new Set(r)),i=Object(I.E)(c),l="external"===Object(s.d)((function(e){return e.session.user})).type,u=function(e,n){var a={id:n.topic.id,name:n.topic.name,folder_id:n.workspace?n.workspace.id:null,folder_name:n.workspace?n.workspace.name:null,slug:n.slug?n.slug:null};t.toWorkspace(a)};return o.a.createElement(ie,{className:"list-group-item"},o.a.createElement("div",{className:"workspace-icon mr-3"},a.topic.is_favourite&&o.a.createElement(oe,{icon:"star"}),o.a.createElement(b.a,{forceThumbnail:!1,type:"TOPIC",imageLink:a.topic.icon_link,id:a.topic.id,name:a.topic.name,onClick:function(e){return u(0,a)},showSlider:!1})),o.a.createElement(X,{dictionary:n,isExternal:l,isMember:i,members:c,item:a,onRedirect:u}),!a.slug&&o.a.createElement(ae,{actions:t,dictionary:n,isExternal:l,isMember:i,item:a}))};function se(){var e=Object(c.a)(["\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  li {\n    padding: 15px;\n  }\n  li:nth-child(2) {\n    border-top: none;\n  }\n  &.active-workspaces {\n    border-radius 6px 6px 0 0;\n  }\n  &.archived-workspaces {\n    .dark & {\n      border: 1px solid;\n      border-top: 0;\n      border-color: hsla(0,0%,60.8%,.1);\n      border-radius: 0 0 6px 6px;\n      background: #252a2d;\n    }\n  }\n  &.archived-workspaces li {\n    background-color: #fafafa;\n    opacity: .7;\n    .dark & {\n      background-color: #252a2d;\n    }\n  }\n  &.archived-workspaces li:last-child {\n    border-radius 0 0 6px 6px;\n    border-bottom: none;\n  }\n"]);return se=function(){return e},e}function ue(){var e=Object(c.a)(["\n  border: none;\n  cursor: pointer;\n  .badge.badge-light {\n    background: #f1f2f7;\n  }\n"]);return ue=function(){return e},e}function me(){var e=Object(c.a)(["\n  overflow: visible !important;\n"]);return me=function(){return e},e}var de=l.b.div(me()),pe=l.b.li(ue()),be=l.b.ul(se()),fe=function(e){var t=e.actions,n=e.dictionary,c=e.filterBy,l=e.results,s=Object(i.useState)({showActive:!0,showArchived:!0}),u=Object(r.a)(s,2),m=u[0],d=u[1],p=Object(i.useState)({activeDate:!0,archivedDate:!0}),f=Object(r.a)(p,2),E=f[0],h=f[1],v=function(e){d(Object(a.a)(Object(a.a)({},m),{},Object(T.a)({},e,!m[e])))},g=function(e){h(Object(a.a)(Object(a.a)({},E),{},Object(T.a)({},e,!E[e])))};return o.a.createElement(de,{className:"card"},o.a.createElement(be,{className:"active-workspaces"},o.a.createElement(pe,{className:"list-group-item"},o.a.createElement("span",{className:"badge badge-light",onClick:function(){return v("showActive")}},o.a.createElement(b.u,{icon:m.showActive?"arrow-up":"arrow-down",width:16,height:16,className:"mr-1"}),n.active),o.a.createElement("div",{style:{float:"right"}},o.a.createElement(b.v,{content:E.activeDate?n.workspaceSortOptionsDate:n.workspaceSortOptionsAlpha},o.a.createElement("span",{className:"badge badge-light",onClick:function(){return g("activeDate")}},o.a.createElement(b.u,{icon:E.activeDate?"arrow-down":"arrow-up",width:16,height:16,className:"mr-1"}))))),m.showActive&&l.filter((function(e){return"favourites"===c?!e.topic.is_archive&&e.topic.is_favourite:!e.topic.is_archive})).sort((function(e,t){return E.activeDate?new Date(t.topic.created_at.date_time)-new Date(e.topic.created_at.date_time):e.topic.name.toLowerCase()<t.topic.name.toLowerCase()?-1:e.topic.name.toLowerCase()>t.topic.name.toLowerCase()?1:0})).map((function(e){return o.a.createElement(le,{actions:t,key:e.topic.id,dictionary:n,item:e})}))),o.a.createElement(be,{className:"archived-workspaces"},o.a.createElement(pe,{className:"list-group-item"},o.a.createElement("span",{className:"badge badge-light",onClick:function(){return v("showArchived")}},o.a.createElement(b.u,{icon:m.showArchived?"arrow-up":"arrow-down",width:16,height:16,className:"mr-1"}),n.archived),o.a.createElement("div",{style:{float:"right"}},o.a.createElement(b.v,{content:E.archivedDate?n.workspaceSortOptionsDate:n.workspaceSortOptionsAlpha},o.a.createElement("span",{className:"badge badge-light",onClick:function(){return g("archivedDate")}},o.a.createElement(b.u,{icon:E.archivedDate?"arrow-down":"arrow-up",width:16,height:16,className:"mr-1"}))))),m.showArchived&&l.filter((function(e){return"favourites"===c?e.topic.is_archive&&e.topic.is_favourite:e.topic.is_archive})).sort((function(e,t){return E.archivedDate?new Date(t.topic.created_at.date_time)-new Date(e.topic.created_at.date_time):e.topic.name.toLowerCase()<t.topic.name.toLowerCase()?-1:e.topic.name.toLowerCase()>t.topic.name.toLowerCase()?1:0})).map((function(e){return o.a.createElement(le,{actions:t,key:e.topic.id,dictionary:n,item:e})}))))},Ee=n(57);function he(){var e=Object(c.a)(["\n  display: flex;\n  justify-content: center;\n"]);return he=function(){return e},e}function ve(){var e=Object(c.a)(["\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  li {\n    padding: 15px;\n  }\n  li:nth-child(2) {\n    border-top: none;\n  }\n  &.active-workspaces {\n    border-radius 6px 6px 0 0;\n  }\n  &.archived-workspaces {\n    .dark & {\n      border: 1px solid;\n      border-top: 0;\n      border-color: hsla(0,0%,60.8%,.1);\n      border-radius: 0 0 6px 6px;\n      background: #252a2d;\n    }\n  }\n  &.archived-workspaces li {\n    background-color: #fafafa;\n    opacity: .7;\n    .dark & {\n      background-color: #252a2d;\n    }\n  }\n  &.archived-workspaces li:last-child {\n    border-radius 0 0 6px 6px;\n    border-bottom: none;\n  }\n"]);return ve=function(){return e},e}function ge(){var e=Object(c.a)(["\n  overflow: visible !important;\n"]);return ge=function(){return e},e}var Oe=l.b.div(ge()),we=l.b.ul(ve()),ke=l.b.div(he()),Ne=function(e){var t=e.userId,n=Object(I.Hb)(),a=Object(I.mb)()._t,r=Object(I.hb)(),c=Object(I.V)(t),l=c.renderConnectedUserLabel,s=c.renderLoadMoreButton,u=c.loading,m=c.error,d=c.hasMore,p=c.relatedWorkspaces,f=c.clearWorkspace,E={notJoined:a("ALL_WORKSPACE.NOT_JOINED","Not joined"),withClient:a("ALL_WORKSPACE.WITH_CLIENT","With client"),searchWorkspacePlaceholder:a("PLACEHOLDER.SEARCH_WORKSPACE_TITLE","Search workspace"),filters:a("PLACEHOLDER.SEARCH_WORKSPACE_FILTER","Filters","Filters"),private:a("WORKSPACE.PRIVATE","Private"),archived:a("WORKSPACE.ARCHIVED","Archived"),new:a("WORKSPACE.NEW","New"),active:a("ALL_WORKSPACE.ACTIVE","Active"),labelOpen:a("LABEL.OPEN","Open"),labelJoined:a("LABEL.JOINED","Joined"),buttonJoin:a("BUTTON.JOIN","Join"),buttonLeave:a("BUTTON.LEAVE","Leave"),externalAccess:a("WORKSPACE_SEARCH.EXTERNAL_ACCESS","External access"),addNewWorkspace:a("SIDEBAR.ADD_NEW_WORKSPACES","Add new workspace"),favourites:a("WORKSPACE.FAVOURITES","Favourites"),all:a("ALL_WORKSPACE.ALL","All"),workspaceSortOptionsAlpha:a("WORKSPACE_SORT_OPTIONS.ALPHA","Sort by Alphabetical Order (A-Z)"),workspaceSortOptionsDate:a("WORKSPACE_SORT_OPTIONS.DATE","Sort by Date (New to Old)"),folders:a("ALL_WORKSPACE.FOLDERS","Folders"),newFolder:a("TOOLTIP.NEW_FOLDER","New folder"),errorMessage:a("WORKSPACE_BODY.ERROR_MESSAGE","Error fetching related workspaces")};return Object(i.useEffect)((function(){m&&r.error(E.errorMessage)}),[m]),Object(i.useEffect)((function(){return f}),[]),o.a.createElement(o.a.Fragment,null,o.a.createElement(Oe,{className:"card"},!u&&!m&&l(),o.a.createElement(we,{className:"active-workspaces"},p.map((function(e){return o.a.createElement(le,{actions:n,key:e.topic.id,dictionary:E,item:e})})))),u&&o.a.createElement(ke,null,o.a.createElement(b.k,null)),d&&o.a.createElement(ke,null,s()))};function Ae(){var e=Object(c.a)(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n"]);return Ae=function(){return e},e}function Se(){var e=Object(c.a)(["\n  overflow: hidden auto;\n  .app-block {\n    overflow: inherit;\n    .app-content {\n      height: auto;\n    }\n  }\n"]);return Se=function(){return e},e}var ye=l.b.div(Se()),Ce=l.b.div(Ae());t.default=function(e){var t=Object(I.w)(),n=t.search,c=t.filteredResults,l=n.loaded,s=n.filterBy,u=n.hasMore,m=n.limit,d=n.skip,p=n.searching,f=n.value,E=n.query,h=Object(I.mb)()._t,v=Object(I.Hb)(),g=Object(i.useState)(!1),O=Object(r.a)(g,2),w=O[0],k=O[1],N=Object(i.useState)(null),A=Object(r.a)(N,2),S=A[0],y=A[1],C=Object(i.useRef)(!0),x=Object(I.R)().params,j=x?x["user-id"]:null;Object(i.useEffect)((function(){return document.body.classList.add("stretch-layout"),v.getFilterCount(),l||(y(!0),v.search({skip:d,limit:m,filter_by:"all"},(function(e,t){C.current&&y(!1),e?v.updateSearch({searching:!1}):v.updateSearch({filterBy:s,searching:!1,count:t.data.total_count,hasMore:t.data.has_more,loaded:!0,skip:t.data.workspaces.length})}))),function(){C.current=!1,v.updateSearch({filterBy:"all",filterByFolder:null})}}),[]);var L=Object(i.useMemo)((function(){var e=Object(Ee.throttle)((function(e){e.target.scrollHeight-e.target.scrollTop<1500&&k(!0)}),300);return function(t){return t.persist(),e(t)}}),[]);Object(i.useEffect)((function(){w&&function(){if(l&&!p)if(""===f&&u)v.updateSearch({searching:!0}),v.search({search:"",skip:d,limit:m,filter_by:"all"},(function(e,t){C.current&&k(!1),e?v.updateSearch({searching:!1}):v.updateSearch({filterBy:s,searching:!1,count:t.data.total_count,hasMore:t.data.has_more,skip:d+t.data.workspaces.length})}));else if(""!==f&&E.hasMore){v.updateSearch({searching:!0});var e={search:E.value,skip:E.skip,limit:E.limit,filter_by:s};v.search(e,(function(e,t){C.current&&k(!1),e?v.updateSearch({searching:!1}):v.updateSearch({filterBy:s,searching:!1,query:Object(a.a)(Object(a.a)({},E),{},{hasMore:t.data.has_more,skip:E.skip+t.data.workspaces.length})})}))}}()}),[w]);var R={notJoined:h("ALL_WORKSPACE.NOT_JOINED","Not joined"),withClient:h("ALL_WORKSPACE.WITH_CLIENT","With client"),searchWorkspacePlaceholder:h("PLACEHOLDER.SEARCH_WORKSPACE_TITLE","Search workspace"),filters:h("PLACEHOLDER.SEARCH_WORKSPACE_FILTER","Filters","Filters"),private:h("WORKSPACE.PRIVATE","Private"),archived:h("WORKSPACE.ARCHIVED","Archived"),new:h("WORKSPACE.NEW","New"),active:h("ALL_WORKSPACE.ACTIVE","Active"),labelOpen:h("LABEL.OPEN","Open"),labelJoined:h("LABEL.JOINED","Joined"),buttonJoin:h("BUTTON.JOIN","Join"),buttonLeave:h("BUTTON.LEAVE","Leave"),externalAccess:h("WORKSPACE_SEARCH.EXTERNAL_ACCESS","External access"),addNewWorkspace:h("SIDEBAR.ADD_NEW_WORKSPACES","Add new workspace"),favourites:h("WORKSPACE.FAVOURITES","Favourites"),all:h("ALL_WORKSPACE.ALL","All"),workspaceSortOptionsAlpha:h("WORKSPACE_SORT_OPTIONS.ALPHA","Sort by Alphabetical Order (A-Z)"),workspaceSortOptionsDate:h("WORKSPACE_SORT_OPTIONS.DATE","Sort by Date (New to Old)"),folders:h("ALL_WORKSPACE.FOLDERS","Folders"),newFolder:h("TOOLTIP.NEW_FOLDER","New folder"),workspaceYouShareWith:h("WORKSPACE_BODY.WORKSPACE_YOUR_SHARE_WITH","Workspaces you share with"),noSharedWorkspace:h("WORKSPACE_BODY.NO_SHARED_WORKSPACE","You have no shared workspace with"),loadingWorkspaces:h("LABEL.LOADING_WORKSPACES","Loading workspaces"),sharedClient:h("PAGE.SHARED_CLIENT","Shared")};return o.a.createElement(ye,{className:"container-fluid h-100 fadeIn",onScroll:L},o.a.createElement("div",{className:"row app-block"},o.a.createElement(_,{actions:v,dictionary:R,filterBy:s,counters:n.counters}),o.a.createElement("div",{className:"col-lg-9 app-content mb-4"},o.a.createElement("div",{className:"app-content-overlay"}),o.a.createElement(P,{actions:v,dictionary:R,search:n}),j?o.a.createElement(Ne,{userId:j}):l&&o.a.createElement(fe,{actions:v,dictionary:R,filterBy:s,results:c}),S&&o.a.createElement(Ce,{className:"card initial-load"},o.a.createElement(b.k,null)),p&&o.a.createElement(b.l,{text:R.loadingWorkspaces}))))}}}]);