(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[23],{785:function(e,a,t){"use strict";t.r(a);var n=t(7),r=t(5),l=t(0),c=t.n(l),s=t(4),i=t(12),o=t(11);function m(){var e=Object(r.a)(["\n  .btn-cross {\n    position: absolute;\n    top: 0;\n    right: 45px;\n    border: 0;\n    background: transparent;\n    padding: 0;\n    height: 100%;\n    width: 36px;\n    border-radius: 4px;\n    z-index: 9;\n    svg {\n      width: 16px;\n      color: #495057;\n    }\n  }\n"]);return m=function(){return e},e}var u=s.b.div(m()),p=function(e){var a=e.actions,t=e.clearTab,r=e.value,s=Object(l.useState)(r),m=Object(n.a)(s,2),p=m[0],d=m[1],E=function(){""!==p.trim()&&(t(),a.search({search:p,skip:0,limit:10}),a.saveSearchValue({value:p}))};Object(l.useEffect)((function(){d(r)}),[r]),Object(l.useEffect)((function(){return function(){a.saveSearchValue({value:""})}}),[]);var g=Object(o.gb)()._t,v={searchGlobalPlaceholder:g("PLACEHOLDER.SEARCH_GLOBAL","Search for anything in this Driff"),whatDoYouWantToFind:g("SEARCH.WHAT_DO_YOU_WANT_TO_FIND","What do you want to find?")};return c.a.createElement(u,{className:"card p-t-b-40","data-backround-image":"assets/media/image/image1.jpg"},c.a.createElement("div",{className:"container"},c.a.createElement("div",{className:"row d-flex justify-content-center"},c.a.createElement("div",null,c.a.createElement("h2",{className:"mb-4 text-center"},v.whatDoYouWantToFind),c.a.createElement("div",{className:"input-group"},c.a.createElement("input",{onChange:function(e){""===e.target.value.trim()&&""!==r&&(t(),a.saveSearchValue({value:""})),d(e.target.value)},onKeyDown:function(e){"Enter"===e.key&&E()},type:"text",className:"form-control",placeholder:v.searchGlobalPlaceholder,"aria-describedby":"button-addon1",autoFocus:!0,value:p}),""!==p.trim()&&c.a.createElement("button",{onClick:function(){d(""),t(),a.search({search:"",skip:0,limit:10}),a.saveSearchValue({value:""})},className:"btn-cross",type:"button"},c.a.createElement(i.s,{icon:"x"})),c.a.createElement("div",{className:"input-group-append"},c.a.createElement("button",{className:"btn btn-outline-light",type:"button",onClick:E},c.a.createElement(i.s,{icon:"search"}))))))))};function d(){var e=Object(r.a)(["\n  &.nav-pills .nav-link.active {\n    background-color: ",";\n  }\n"]);return d=function(){return e},e}var E=s.b.ul(d(),(function(e){return e.theme.colors.primary})),g=function(e){var a=e.activeTab,t=e.onSelectTab,n=e.tabs,r=e.dictionary;return c.a.createElement(E,{className:"nav nav-pills mb-4",role:"tablist"},n.hasOwnProperty("CHANNEL")&&Object.keys(n.CHANNEL).length>0&&c.a.createElement("li",{className:"nav-item"},c.a.createElement("a",{className:"nav-link ".concat(("channel"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"channel",role:"tab","aria-controls":"clasic","aria-selected":"true"},r.chatChannel)),n.hasOwnProperty("CHAT")&&Object.keys(n.CHAT).length>0&&c.a.createElement("li",{className:"nav-item"},c.a.createElement("a",{className:"nav-link ".concat(("chat"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"chat",role:"tab","aria-controls":"clasic","aria-selected":"true"},r.message)),n.hasOwnProperty("COMMENT")&&Object.keys(n.COMMENT).length>0&&c.a.createElement("li",{className:"nav-item"},c.a.createElement("a",{className:"nav-link ".concat(("comment"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"comment",role:"tab","aria-controls":"clasic","aria-selected":"true"},r.comment)),n.hasOwnProperty("DOCUMENT")&&Object.keys(n.DOCUMENT).length>0&&c.a.createElement("li",{className:"nav-item"},c.a.createElement("a",{className:"nav-link ".concat(("document"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"document",role:"tab","aria-controls":"articles","aria-selected":"false"},r.files)),n.hasOwnProperty("PEOPLE")&&Object.keys(n.PEOPLE).length>0&&c.a.createElement("li",{className:"nav-item"},c.a.createElement("a",{className:"nav-link ".concat(("people"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"people",role:"tab","aria-controls":"users","aria-selected":"false"},r.people)),n.hasOwnProperty("POST")&&Object.keys(n.POST).length>0&&c.a.createElement("li",{className:"nav-item"},c.a.createElement("a",{className:"nav-link ".concat(("post"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"post",role:"tab","aria-controls":"photos","aria-selected":"false"},r.posts)),n.hasOwnProperty("WORKSPACE")&&Object.keys(n.WORKSPACE).length>0&&c.a.createElement("li",{className:"nav-item"},c.a.createElement("a",{className:"nav-link ".concat(("workspace"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"workspace",role:"tab","aria-controls":"photos","aria-selected":"false"},r.workspace)))},v=function(e){var a=e.activeTab,t=e.tabs,n=e.redirect;return c.a.createElement("div",{className:"tab-content search-results",id:"myTabContent"},c.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"channel"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("CHANNEL")&&c.a.createElement(b,{channels:t.CHANNEL.items,page:t.CHANNEL.page,redirect:n})),c.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"chat"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("CHAT")&&c.a.createElement(f,{chats:t.CHAT.items,page:t.CHAT.page,redirect:n})),c.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"comment"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("COMMENT")&&c.a.createElement(C,{comments:t.COMMENT.items,page:t.COMMENT.page,redirect:n})),c.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"document"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("DOCUMENT")&&c.a.createElement(A,{files:t.DOCUMENT.items,page:t.DOCUMENT.page,redirect:n})),c.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"people"===a)&&"active show"),id:"users",role:"tabpanel"},t.hasOwnProperty("PEOPLE")&&c.a.createElement(S,{people:t.PEOPLE.items,page:t.PEOPLE.page,redirect:n})),c.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"post"===a)&&"active show"),id:"photos",role:"tabpanel"},t.hasOwnProperty("POST")&&c.a.createElement(x,{posts:t.POST.items,page:t.POST.page,redirect:n})),c.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"workspace"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("WORKSPACE")&&c.a.createElement(B,{workspaces:t.WORKSPACE.items,page:t.WORKSPACE.page,redirect:n})))},b=function(e){var a=e.channels,t=e.page,n=e.redirect;return c.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return e.data?c.a.createElement(h,{key:e.id,data:e.data,redirect:n}):null})))},h=function(e){var a=e.data,t=e.redirect,n=a.channel;return c.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},c.a.createElement("h5",{onClick:function(){t.toChannel(n)}},n.title))},f=function(e){var a=e.chats,t=e.page,n=e.redirect;return c.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).filter((function(e){return e.data&&null!==e.data.message})).map((function(e){return c.a.createElement(O,{key:e.id,data:e.data,redirect:n})})))};function k(){var e=Object(r.a)(["\n  display: flex;\n  width: 100%;\n  p {\n    margin: 0;\n  }\n"]);return k=function(){return e},e}var N=s.b.li(k()),O=function(e){var a=e.data,t=e.redirect,n=a.channel,r=a.message;return c.a.createElement(N,{className:"list-group-item p-l-0 p-r-0"},c.a.createElement("div",null,c.a.createElement(i.a,{id:r.user.id,name:r.user.name,imageLink:r.user.profile_image_thumbnail_link?r.user.profile_image_thumbnail_link:r.user.profile_image_link,showSlider:!0})),c.a.createElement("div",{className:"ml-2",onClick:function(){t.toChat(n,r)}},c.a.createElement("p",null,r.user.name," - ",n.title),c.a.createElement("p",{className:"text-muted",dangerouslySetInnerHTML:{__html:r.body}})))},C=function(e){var a=e.comments,t=e.page,n=e.redirect;return c.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return c.a.createElement(_,{key:e.id,comment:e,redirect:n})})))};function w(){var e=Object(r.a)(["\n  img {\n    max-height: 200px;\n    padding: 20px;\n    margin-top: 20px;\n    float: right;\n  }\n  p {\n    display: none;\n    &:nth-child(1),\n    &:nth-child(2),\n    &:nth-child(3),\n    &:nth-child(4),\n    &:nth-child(5) {\n      display: block;\n    }\n  }\n"]);return w=function(){return e},e}function y(){var e=Object(r.a)(["\n  display: flex;\n  width: 100%;\n  p {\n    margin: 0;\n  }\n"]);return y=function(){return e},e}var P=s.b.li(y()),T=s.b.div(w()),_=function(e){var a=e.comment,t=e.redirect,n=a.data;return c.a.createElement(P,{className:"list-group-item p-l-0 p-r-0",onClick:function(){if(null!==n)if(n.workspaces.length){var e={id:n.workspaces[0].topic.id,name:n.workspaces[0].topic.name,folder_id:n.workspaces[0].workspace?n.workspaces[0].workspace.id:null,folder_name:n.workspaces[0].workspace?n.workspaces[0].workspace.name:null};t.toPost({workspace:e,post:n.post},{focusOnMessage:n.comment.id})}else t.toPost({workspace:null,post:n.post},{focusOnMessage:n.comment.id})}},null!==n&&c.a.createElement(c.a.Fragment,null,c.a.createElement("div",null,c.a.createElement(i.a,{id:n.comment.author.id,name:n.comment.author.name,imageLink:(n.comment.author.profile_image_link,n.comment.author.profile_image_thumbnail_link),showSlider:!0})),c.a.createElement("div",{className:"ml-2"},c.a.createElement("p",null,n.comment.author.name),c.a.createElement(T,{className:"text-muted",dangerouslySetInnerHTML:{__html:n.comment.body}}))),null===n&&c.a.createElement("div",null,c.a.createElement("p",{className:"text-muted",dangerouslySetInnerHTML:{__html:a.search_body}})))},j=function(e){var a=e.user,t=e.redirect;return c.a.createElement("li",{className:"list-group-item p-l-r-0"},c.a.createElement("div",{className:"media",onClick:function(){t.toPeople(a)}},c.a.createElement(i.a,{id:a.id,name:a.name,imageLink:a.profile_image_thumbnail_link?a.profile_image_thumbnail_link:a.profile_image_link,className:"mr-2"}),c.a.createElement("div",{className:"media-body"},c.a.createElement("h6",{className:"m-0"},a.name))))},S=function(e){var a=e.page,t=e.people,n=e.redirect;return c.a.createElement("ul",{className:"list-group list-group-flush"},Object.keys(t).length>0&&Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return c.a.createElement(j,{key:e.id,user:e.data,redirect:n})})))},A=function(e){var a=e.files,t=e.page,n=e.redirect;return c.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return c.a.createElement(L,{key:e.data.id,file:e.data,redirect:n})})))},L=function(e){var a=e.file,t=e.redirect;return c.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},c.a.createElement("label",{onClick:function(){t.toFiles(a)}},a.name))},x=function(e){var a=e.page,t=e.posts,n=e.redirect;return c.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return c.a.createElement(H,{key:e.id,data:e.data,redirect:n})})))},H=function(e){var a=e.data,t=e.redirect,n=a.post,r=a.workspaces,l=Object(o.ab)().localizeChatDate;return c.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},c.a.createElement("div",{onClick:function(){var e=null;r.length&&(e={id:r[0].topic.id,name:r[0].topic.name,folder_id:r[0].workspace?r[0].workspace.id:null,folder_name:r[0].workspace?r[0].workspace.name:null}),t.toPost({post:n,workspace:e})}},c.a.createElement("h5",null,n.title),c.a.createElement("div",{className:"text-muted font-size-13"},c.a.createElement("div",null,l(n.created_at.timestamp)))))},M=t(1),R=t(783),U=t.n(R),D=function(e){var a=e.actions,t=e.activeTab,r=e.tabs,s=e.value,i=Object(l.useState)(!1),o=Object(n.a)(i,2),m=o[0],u=o[1],p=function(e,n){var r=t;"workspace"===t?r="topic":"people"===t&&(r="user"),u(!0),a.search({search:s,skip:e,limit:n,tag:r},(function(e,a){u(!1)}))};if(Object(l.useEffect)((function(){if(t&&!m){var e=r[t.toUpperCase()].page,a=r[t.toUpperCase()].count;(1===e&&a<10&&r[t.toUpperCase()].total_count>10||1===e&&0===a)&&p(a,10)}}),[r,t,m]),t&&r[t.toUpperCase()].maxPage<=1||null===t)return null;var d=r[t.toUpperCase()].page,E=r[t.toUpperCase()].maxPage;return c.a.createElement("nav",{className:"mt-3"},c.a.createElement(U.a,{forcePage:d-1,previousLabel:"previous",nextLabel:"next",breakLabel:"...",breakClassName:"break-me page-item",breakLinkClassName:"page-link",pageCount:E,marginPagesDisplayed:2,pageRangeDisplayed:5,onPageChange:function(e){var n=e.selected+1,l=r[t.toUpperCase()].items.slice(n>1?10*n-10:0,10*n),c=r[t.toUpperCase()].count;10!==l.length&&p(c,10*n);var s=Object(M.a)(Object(M.a)({},r[t.toUpperCase()]),{},{page:n,key:t.toUpperCase()});a.updateTabPage(s)},containerClassName:"pagination justify-content-center",subContainerClassName:"pages pagination",activeClassName:"active",pageClassName:"page-item",pageLinkClassName:"page-link",previousClassName:"page-item",previousLinkClassName:"page-link",nextClassName:"page-item",nextLinkClassName:"page-link"}))},W=t(6),B=function(e){var a=e.page,t=e.workspaces,n=e.redirect,r=Object(W.d)((function(e){return e.workspaces.workspaces}));return c.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return c.a.createElement(F,{key:e.id,data:e.data,redirect:n,workspaces:r})})))},F=function(e){var a=e.data,t=e.redirect,n=e.workspaces,r=a.topic,l=a.workspace;return c.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},c.a.createElement("h5",{onClick:function(){var e={id:r.id,name:r.name,folder_id:l?l.id:null,folder_name:l?l.name:null};n.hasOwnProperty(r.id)?t.toWorkspace(e):t.fetchWorkspaceAndRedirect(e)}},r.name))};function I(){var e=Object(r.a)(["\n  .empty-notification {\n    h4 {\n      margin: 2rem auto;\n      text-align: center;\n      color: #972c86;\n    }\n  }\n  .text-primary {\n    color: ","!important;\n  }\n"]);return I=function(){return e},e}var K=s.b.div(I(),(function(e){return e.theme.colors.third}));a.default=c.a.memo((function(e){var a=e.className,t=void 0===a?"":a,r=Object(o.O)(),s=Object(o.R)(),m=Object(o.Q)(),u=m.count,d=m.results,E=m.searching,b=m.tabs,h=m.value,f=Object(o.gb)()._t,k={searching:f("SEARCH.SEARCHING","Searching"),chatChannel:f("SEARCH.TAB_CHAT_CHANNEL","Chat channel"),message:f("SEARCH.TAB_MESSAGE","Message"),comment:f("SEARCH.TAB_COMMENT","Comment"),files:f("SEARCH.TAB_FILES","Files"),people:f("SEARCH.TAB_PEOPLE","People"),posts:f("SEARCH.TAB_POSTS","Posts"),workspace:f("SEARCH.TAB_WORKSPACE","Workspace")},N=Object(l.useState)(null),O=Object(n.a)(N,2),C=O[0],w=O[1];Object(l.useEffect)((function(){return document.getElementById("main").setAttribute("style","overflow: auto"),function(){return document.getElementById("main").removeAttribute("style")}}),[]),Object(l.useEffect)((function(){if(Object.keys(b).length&&null===C){var e=Object.keys(b)[0];w(e.toLowerCase())}else 0===Object.keys(b).length&&null!==C&&w(null)}),[b,C]);return c.a.createElement(K,{className:"user-search-panel container-fluid h-100 ".concat(t)},c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col-md-12"},c.a.createElement("div",{className:"card"},c.a.createElement("div",{className:"card-body"},c.a.createElement(p,{actions:s,value:h,clearTab:function(){return w(null)}}),""!==h&&c.a.createElement("h4",{className:"mb-5"},c.a.createElement(i.s,{icon:"search"}),E&&c.a.createElement("span",null,k.searching," ",c.a.createElement("span",{className:"text-primary"},"\u201c",h,"\u201d")),!E&&c.a.createElement("span",null,f("SEARCH.RESULTS_FOUND","::count:: results found for:",{count:u})," ",c.a.createElement("span",{className:"text-primary"},"\u201c",h,"\u201d"))),c.a.createElement(g,{activeTab:C,onSelectTab:function(e){e.currentTarget.dataset.value!==C&&w(e.currentTarget.dataset.value)},tabs:b,dictionary:k}),c.a.createElement(v,{activeTab:C,results:d,tabs:b,redirect:r}),u>0&&c.a.createElement(D,{activeTab:C,tabs:b,actions:s,value:h}))))))}))}}]);