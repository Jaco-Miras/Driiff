(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[24],{716:function(e,t,a){"use strict";a.r(t);var n=a(6),r=a(9),i=a(0),c=a.n(i),o=a(10),l=a(5);function s(){var e=Object(r.a)(["\n  .list-group-item:last-child {\n    border-bottom-width: thin !important;\n  }\n  li {\n    cursor: pointer;\n  }\n  &.list-group .list-group-item.active {\n    border-color: #eeebee;\n    background-color: #fafafa !important;\n    .dark & {\n      background-color: #111417 !important;\n    }\n  }\n"]);return s=function(){return e},e}var m=o.a.ul(s()),u=function(e){var t=e.actions,a=e.counters,n=e.dictionary,r=e.filterBy,i="external"===Object(l.d)((function(e){return e.session.user})).type,o=function(e){e.persist(),r!==e.target.dataset.value&&(t.updateSearch({filterBy:e.target.dataset.value}),document.body.classList.remove("mobile-modal-open"))};return c.a.createElement(m,{className:"list-group list-group-flush"},c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"all"===r?"active":""),"data-value":"all",onClick:o},c.a.createElement("span",{className:"text-primary fa fa-circle mr-2"}),n.all,c.a.createElement("span",{className:"small ml-auto"},a.nonMember+a.member>0&&a.nonMember+a.member)),c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"member"===r?"active":""),"data-value":"member",onClick:o},c.a.createElement("span",{className:"text-success fa fa-circle mr-2"}),n.labelJoined,c.a.createElement("span",{className:"small ml-auto"},a.member>0&&a.member)),c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"favourites"===r?"active":""),"data-value":"favourites",onClick:o},c.a.createElement("span",{className:"text-warning fa fa-circle mr-2"}),n.favourites,c.a.createElement("span",{className:"small ml-auto"},a.favourites>0&&a.favourites)),c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"new"===r?"active":""),"data-value":"new",onClick:o},c.a.createElement("span",{className:"text-info fa fa-circle mr-2"}),n.new,c.a.createElement("span",{className:"small ml-auto"},a.new>0&&a.new)),!i&&c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"nonMember"===r?"active":""),"data-value":"nonMember",onClick:o},c.a.createElement("span",{className:"text-secondary fa fa-circle mr-2"}),n.notJoined,c.a.createElement("span",{className:"small ml-auto"},a.nonMember>0&&a.nonMember)),!i&&c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"external"===r?"active":""),"data-value":"external",onClick:o},c.a.createElement("span",{className:"text-external fa fa-circle mr-2"}),n.withClient,c.a.createElement("span",{className:"small ml-auto"},a.external>0&&a.external)),c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"private"===r?"active":""),"data-value":"private",onClick:o},c.a.createElement("span",{className:"text-danger fa fa-circle mr-2"}),n.private,c.a.createElement("span",{className:"small ml-auto"},a.private>0&&a.private)),c.a.createElement("li",{className:"list-group-item d-flex align-items-center ".concat(r&&"archived"===r?"active":""),"data-value":"archived",onClick:o},c.a.createElement("span",{className:"text-light fa fa-circle mr-2"}),n.archived,c.a.createElement("span",{className:"small ml-auto"},a.archived>0&&a.archived)))},d=a(15);function p(){var e=Object(r.a)([""]);return p=function(){return e},e}function b(){var e=Object(r.a)(["\n  margin-right: 4px;\n"]);return b=function(){return e},e}function f(){var e=Object(r.a)(["\n  display: inline-flex;\n  align-items: center;\n"]);return f=function(){return e},e}function v(){var e=Object(r.a)(["\n  .app-sidebar-menu {\n    overflow: hidden;\n    outline: currentcolor none medium;\n    @media (max-width: 991.99px) {\n      border-bottom-left-radius: 0 !important;\n      border-bottom-right-radius: 0 !important;\n      display: flex;\n      flex-direction: column;\n      .card-body {\n        display: none;\n      }\n      .create-new-post-wrapper {\n        border-top: 1px solid #ebebeb;\n        display: block;\n        order: 9;\n      }\n      .list-group-flush {\n        border-top: 1px solid #ebebeb;\n      }\n    }\n  }\n  @media (max-width: 991.99px) {\n    margin-bottom: 0 !important;\n  }\n"]);return v=function(){return e},e}var h,E=o.a.div(v()),g=o.a.button(f()),w=Object(o.a)(d.s)(b()),N=o.a.div(p()),O=function(e){var t=e.actions,a=e.counters,n=e.dictionary,r=e.filterBy,i=Object(l.d)((function(e){return e.session.user}));return c.a.createElement(E,{className:"col-md-3 app-sidebar bottom-modal-mobile"},c.a.createElement(N,{className:"mobile-overlay",onClick:function(){document.body.classList.remove("mobile-modal-open")}}),c.a.createElement("div",{className:"bottom-modal-mobile_inner"},c.a.createElement("div",{className:"app-sidebar-menu",tabIndex:"2"},"internal"===i.type&&c.a.createElement("div",{className:"card-body create-new-post-wrapper"},c.a.createElement(g,{className:"btn btn-primary btn-block",onClick:t.showWorkspaceModal},c.a.createElement(w,{icon:"circle-plus"}),n.addNewWorkspace)),c.a.createElement("div",{className:"post-filter-item list-group list-group-flush"},c.a.createElement("span",{className:"list-group-item d-flex align-items-center pr-3","data-value":"inbox"},n.filters)),c.a.createElement(u,{actions:t,counters:a,dictionary:n,filterBy:r}))))},k=a(1),y=o.a.div(h||(h=Object(r.a)(["\n  overflow: inherit !important;\n  .action-right {\n    margin: 0 !important;\n  }\n  .action-left {\n    ul {\n      margin-bottom: 0;\n      display: inherit;\n\n      li {\n        position: relative;\n\n        .button-dropdown {\n        }\n      }\n    }\n    .app-sidebar-menu-button {\n      margin-left: 8px;\n    }\n  }\n  .btn-cross {\n    position: absolute;\n    top: 0;\n    right: 45px;\n    border: 0;\n    background: transparent;\n    padding: 0;\n    height: 100%;\n    width: 36px;\n    border-radius: 4px;\n    z-index: 9;\n    svg {\n      width: 16px;\n      color: #495057;\n    }\n  }\n"]))),x=c.a.memo((function(e){var t=e.actions,a=e.dictionary,r=e.search,o=r.value,l=r.searching,s=r.filterBy,m=Object(i.useState)(""),u=Object(n.a)(m,2),p=u[0],b=u[1],f=function(){t.updateSearch(Object(k.a)(Object(k.a)({},r),{},{value:p,filterBy:s,searching:!0}))},v=function(){t.updateSearch({value:""}),b("")};Object(i.useEffect)((function(){var e=setTimeout((function(){t.updateSearch({value:p,hasMore:!0})}),500);return function(){return clearTimeout(e)}}),[p]);return c.a.createElement(y,{className:"files-header app-action"},c.a.createElement("div",{className:"action-left mt-2"},c.a.createElement("span",{className:"app-sidebar-menu-button btn btn-outline-light",onClick:function(){document.body.classList.toggle("mobile-modal-open")}},c.a.createElement(d.s,{icon:"menu"}))),c.a.createElement("div",{className:"action-right"},c.a.createElement("div",{className:"input-group"},c.a.createElement("input",{type:"text",onChange:function(e){""===e.target.value.trim()&&""!==o?v():b(e.target.value)},value:p,onKeyDown:function(e){"Enter"!==e.key||l||f()},className:"form-control",placeholder:a.searchWorkspacePlaceholder,"aria-describedby":"button-addon1"}),""!==p.trim()&&c.a.createElement("button",{onClick:v,className:"btn-cross",type:"button"},c.a.createElement(d.s,{icon:"x"})),c.a.createElement("div",{className:"input-group-append"},c.a.createElement("button",{className:"btn btn-outline-light",type:"button",id:"button-addon1",onClick:f},c.a.createElement(d.s,{icon:"search"}))))))})),C=a(8),A=a(11);function j(){var e=Object(r.a)(["\n  background: #00c851;\n  border-radius: 50%;\n  margin-right: 3px;\n"]);return j=function(){return e},e}function _(){var e=Object(r.a)(["\n  width: 0.8rem;\n  height: 0.8rem;\n  color: #fff;\n  stroke-width: 3;\n  padding: 2px;\n"]);return _=function(){return e},e}function S(){var e=Object(r.a)(["\n  span.text-success {\n    margin-right: 0;\n  }\n"]);return S=function(){return e},e}function L(){var e=Object(r.a)(["\n  width: 1rem;\n  height: 1rem;\n  margin-right: 3px;\n"]);return L=function(){return e},e}function R(){var e=Object(r.a)(["\n  .workspace-title {\n    cursor: pointer;\n  }\n  .labels span {\n    display: flex;\n    align-items: center;\n  }\n  .mobile-icon {\n    display: none;\n  }\n  @media (max-width: 414px) {\n    .badge {\n      display: none;\n    }\n    .mobile-icon {\n      display: block;\n    }\n  }\n"]);return R=function(){return e},e}var D,P,W,T=o.a.div(R()),B=Object(o.a)(d.s)(L()),I=o.a.span(S()),M=Object(o.a)(d.s)(_()),K=o.a.span(j()),J=function(e){var t=e.dictionary,a=e.isExternal,n=e.isMember,r=e.item,i=e.onRedirect;return c.a.createElement(T,{className:"workspace-details"},c.a.createElement("div",{className:"title-labels"},c.a.createElement("span",{className:"workspace-title",onClick:function(e){return i(e,r)}},r.topic.name),r.topic.is_locked&&c.a.createElement(B,{icon:"lock"}),r.topic.is_shared&&!a&&c.a.createElement(c.a.Fragment,null,c.a.createElement("span",{className:"badge badge-external ml-1 align-items-center"},c.a.createElement(B,{icon:"eye"})," ",t.withClient),c.a.createElement(B,{icon:"eye",className:"mobile-icon"}))),c.a.createElement("div",{className:"labels"},n&&c.a.createElement(I,{className:"mr-2"},c.a.createElement(K,null,c.a.createElement(M,{icon:"check"})),c.a.createElement("span",{className:"text-success"},t.labelJoined)),c.a.createElement("span",{className:"mr-2"},c.a.createElement(B,{icon:"user"}),r.members.length),r.workspace&&c.a.createElement("span",{className:"mr-2"},c.a.createElement(B,{icon:"folder"}),r.workspace.name)))},H=o.a.div(D||(D=Object(r.a)(["\n  margin-left: 10px;\n"]))),F=Object(o.a)(d.s)(P||(P=Object(r.a)(["\n  width: 1rem;\n  height: 1rem;\n  margin-right: 10px;\n  &.favorite {\n    color: rgb(255, 193, 7);\n    fill: rgb(255, 193, 7);\n  }\n  :hover {\n    color: #7a1b8b;\n    cursor: pointer;\n    &.favorite {\n      color: rgb(255, 193, 7);\n      fill: rgb(255, 193, 7);\n    }\n  }\n"]))),V=o.a.button(W||(W=Object(r.a)(["\n  padding: 5px 10px;\n  font-size: 12px;\n  font-weight: 500;\n"]))),z=function(e){var t=e.actions,a=e.dictionary,n=e.isExternal,r=e.isMember,i=e.item;return c.a.createElement(H,{className:"workspace-list-buttons"},r&&!n&&c.a.createElement(F,{icon:"pencil",onClick:function(){return t.edit(i)}}),c.a.createElement(F,{icon:"star",className:"".concat(i.topic.is_favourite&&"favorite"),onClick:function(){return t.favourite(i)}}),r&&!n&&c.a.createElement(F,{icon:"trash",onClick:function(){return t.showArchiveConfirmation(i)}}),c.a.createElement(V,{className:"btn ".concat(r?"btn-danger":"btn-primary"),onClick:function(){r?t.leave(i):t.join(i)}},r?a.buttonLeave:a.buttonJoin))};function U(){var e=Object(r.a)(["\n  position: absolute;\n  z-index: 2;\n  width: 1rem;\n  height: 1rem;\n  top: 0;\n  right: 0;\n  color: rgb(255, 193, 7);\n  fill: rgb(255, 193, 7);\n"]);return U=function(){return e},e}function X(){var e=Object(r.a)(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  list-style: none;\n  border-right: none;\n  border-left: none;\n\n  .workspace-icon {\n    position: relative;\n  }\n  .workspace-list-buttons {\n    display: none;\n  }\n  .workspace-title {\n    font-size: 1rem;\n  }\n  .title-labels,\n  .labels {\n    display: flex;\n  }\n  .title-labels {\n    align-items: center;\n    .feather-lock {\n      margin: 0 5px;\n    }\n    .feather-eye {\n      width: 0.8rem;\n      height: 0.8rem;\n    }\n  }\n  :hover {\n    button {\n      display: inline-flex;\n    }\n    .workspace-list-buttons {\n      display: block;\n    }\n  }\n"]);return X=function(){return e},e}var Z,q,G,Q,Y,$=o.a.li(X()),ee=Object(o.a)(d.s)(U()),te=function(e){var t=e.actions,a=e.dictionary,n=e.item,r=Object(A.A)(n.members.map((function(e){return e.id}))),i="external"===Object(l.d)((function(e){return e.session.user})).type,o=function(e,a){var n={id:a.topic.id,name:a.topic.name,folder_id:a.workspace?a.workspace.id:null,folder_name:a.workspace?a.workspace.name:null};t.toWorkspace(n)};return c.a.createElement($,{className:"list-group-item"},c.a.createElement("div",{className:"workspace-icon mr-3"},n.topic.is_favourite&&c.a.createElement(ee,{icon:"star"}),c.a.createElement(d.a,{forceThumbnail:!1,type:"TOPIC",imageLink:n.topic.icon_link,id:n.topic.id,name:n.topic.name,onClick:function(e){return o(0,n)},showSlider:!1})),c.a.createElement(J,{dictionary:a,isExternal:i,isMember:r,item:n,onRedirect:o}),c.a.createElement(z,{actions:t,dictionary:a,isExternal:i,isMember:r,item:n}))},ae=o.a.div(Z||(Z=Object(r.a)(["\n  overflow: visible !important;\n"]))),ne=o.a.li(q||(q=Object(r.a)(["\n  border: none;\n  cursor: pointer;\n  .badge.badge-light {\n    background: #f1f2f7;\n  }\n"]))),re=o.a.ul(G||(G=Object(r.a)(["\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  li {\n    padding: 15px;\n  }\n  li:nth-child(2) {\n    border-top: none;\n  }\n  &.active-workspaces {\n    border-radius 6px 6px 0 0;\n  }\n  &.archived-workspaces {\n    .dark & {\n      border: 1px solid;\n      border-top: 0;\n      border-color: hsla(0,0%,60.8%,.1);\n      border-radius: 0 0 6px 6px;\n      background: #252a2d;\n    }\n  }\n  &.archived-workspaces li {\n    background-color: #fafafa;\n    opacity: .7;\n    .dark & {\n      background-color: #252a2d;\n    }\n  }\n  &.archived-workspaces li:last-child {\n    border-radius 0 0 6px 6px;\n    border-bottom: none;\n  }\n"]))),ie=function(e){var t=e.actions,a=e.dictionary,r=e.filterBy,o=e.results,l=Object(i.useState)({showActive:!0,showArchived:!0}),s=Object(n.a)(l,2),m=s[0],u=s[1],p=Object(i.useState)({activeDate:!0,archivedDate:!0}),b=Object(n.a)(p,2),f=b[0],v=b[1],h=function(e){u(Object(k.a)(Object(k.a)({},m),{},Object(C.a)({},e,!m[e])))},E=function(e){v(Object(k.a)(Object(k.a)({},f),{},Object(C.a)({},e,!f[e])))};return c.a.createElement(ae,{className:"card"},c.a.createElement(re,{className:"active-workspaces"},c.a.createElement(ne,{className:"list-group-item"},c.a.createElement("span",{className:"badge badge-light",onClick:function(){return h("showActive")}},c.a.createElement(d.s,{icon:m.showActive?"arrow-up":"arrow-down",width:16,height:16,className:"mr-1"}),a.active),c.a.createElement("div",{style:{float:"right"}},c.a.createElement(d.t,{content:f.activeDate?a.workspaceSortOptionsDate:a.workspaceSortOptionsAlpha},c.a.createElement("span",{className:"badge badge-light",onClick:function(){return E("activeDate")}},c.a.createElement(d.s,{icon:f.activeDate?"arrow-down":"arrow-up",width:16,height:16,className:"mr-1"}))))),m.showActive&&o.filter((function(e){return"favourites"===r?!e.topic.is_archive&&e.topic.is_favourite:!e.topic.is_archive})).sort((function(e,t){return f.activeDate?new Date(t.topic.created_at.date_time)-new Date(e.topic.created_at.date_time):e.topic.name.toLowerCase()<t.topic.name.toLowerCase()?-1:e.topic.name.toLowerCase()>t.topic.name.toLowerCase()?1:0})).map((function(e){return c.a.createElement(te,{actions:t,key:e.topic.id,dictionary:a,item:e})}))),c.a.createElement(re,{className:"archived-workspaces"},c.a.createElement(ne,{className:"list-group-item"},c.a.createElement("span",{className:"badge badge-light",onClick:function(){return h("showArchived")}},c.a.createElement(d.s,{icon:m.showArchived?"arrow-up":"arrow-down",width:16,height:16,className:"mr-1"}),a.archived),c.a.createElement("div",{style:{float:"right"}},c.a.createElement(d.t,{content:f.archivedDate?a.workspaceSortOptionsDate:a.workspaceSortOptionsAlpha},c.a.createElement("span",{className:"badge badge-light",onClick:function(){return E("archivedDate")}},c.a.createElement(d.s,{icon:f.archivedDate?"arrow-down":"arrow-up",width:16,height:16,className:"mr-1"}))))),m.showArchived&&o.filter((function(e){return"favourites"===r?e.topic.is_archive&&e.topic.is_favourite:e.topic.is_archive})).sort((function(e,t){return f.archivedDate?new Date(t.topic.created_at.date_time)-new Date(e.topic.created_at.date_time):e.topic.name.toLowerCase()<t.topic.name.toLowerCase()?-1:e.topic.name.toLowerCase()>t.topic.name.toLowerCase()?1:0})).map((function(e){return c.a.createElement(te,{actions:t,key:e.topic.id,dictionary:a,item:e})}))))},ce=o.a.div(Q||(Q=Object(r.a)(["\n  overflow: hidden auto;\n  .app-block {\n    overflow: inherit;\n    .app-content {\n      height: auto;\n    }\n  }\n"]))),oe=o.a.div(Y||(Y=Object(r.a)(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n"])));t.default=function(e){var t=Object(A.u)(),a=t.search,r=t.filteredResults,o=a.loaded,l=a.results,s=a.filterBy,m=Object(A.cb)()._t,u=Object(A.nb)(),p=Object(i.useState)(null),b=Object(n.a)(p,2),f=b[0],v=b[1],h=Object(i.useRef)(!0);Object(i.useEffect)((function(){return document.body.classList.add("stretch-layout"),u.getFilterCount((function(e,t){if(!e&&t.data){0===l.length&&h.current&&v(!0);var a=t.data.reduce((function(e,t){return"NON_MEMBER"!==t.entity_type&&"MEMBER"!==t.entity_type||(e+=t.count),e}),0);u.search({search:"",skip:0,limit:a,filter_by:"all"},(function(e,t){h.current&&v(!1),e?u.updateSearch({searching:!1}):u.updateSearch({filterBy:s,searching:!1,count:t.data.total_count,hasMore:t.data.has_more,results:t.data.workspaces,loaded:!0})}))}})),function(){h.current=!1}}),[]);var E={notJoined:m("ALL_WORKSPACE.NOT_JOINED","Not joined"),withClient:m("ALL_WORKSPACE.WITH_CLIENT","With client"),searchWorkspacePlaceholder:m("PLACEHOLDER.SEARCH_WORKSPACE_TITLE","Search workspace"),filters:m("PLACEHOLDER.SEARCH_WORKSPACE_FILTER","Filters","Filters"),private:m("WORKSPACE.PRIVATE","Private"),archived:m("WORKSPACE.ARCHIVED","Archived"),new:m("WORKSPACE.NEW","New"),active:m("ALL_WORKSPACE.ACTIVE","Active"),labelOpen:m("LABEL.OPEN","Open"),labelJoined:m("LABEL.JOINED","Joined"),buttonJoin:m("BUTTON.JOIN","Join"),buttonLeave:m("BUTTON.LEAVE","Leave"),externalAccess:m("WORKSPACE_SEARCH.EXTERNAL_ACCESS","External access"),addNewWorkspace:m("SIDEBAR.ADD_NEW_WORKSPACES","Add new workspace"),favourites:m("WORKSPACE.FAVOURITES","Favourites"),all:m("ALL_WORKSPACE.ALL","All"),workspaceSortOptionsAlpha:m("WORKSPACE_SORT_OPTIONS.ALPHA","Sort by Alphabetical Order (A-Z)"),workspaceSortOptionsDate:m("WORKSPACE_SORT_OPTIONS.DATE","Sort by Date (New to Old)")};return c.a.createElement(ce,{className:"container-fluid h-100 fadeIn"},c.a.createElement("div",{className:"row app-block"},c.a.createElement(O,{actions:u,dictionary:E,filterBy:s,counters:a.counters}),c.a.createElement("div",{className:"col-lg-9 app-content mb-4"},c.a.createElement("div",{className:"app-content-overlay"}),c.a.createElement(x,{actions:u,dictionary:E,search:a}),o&&c.a.createElement(ie,{actions:u,dictionary:E,filterBy:s,results:r}),f&&c.a.createElement(oe,{className:"card initial-load"},c.a.createElement(d.j,null)))))}}}]);