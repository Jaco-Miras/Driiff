(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[24],{665:function(e,a,t){"use strict";t.r(a);var n,l=t(7),r=t(10),c=t(1),s=t.n(c),i=t(9),o=t(15),m=t(11),u=i.a.div(n||(n=Object(r.a)(["\n  .btn-cross {\n    position: absolute;\n    top: 0;\n    right: 45px;\n    border: 0;\n    background: transparent;\n    padding: 0;\n    height: 100%;\n    width: 36px;\n    border-radius: 4px;\n    z-index: 9;\n    svg {\n      width: 16px;\n      color: #495057;\n    }\n  }\n"]))),p=function(e){var a=e.actions,t=e.clearTab,n=e.value,r=Object(c.useState)(n),i=Object(l.a)(r,2),p=i[0],d=i[1],E=function(){""!==p.trim()&&(t(),a.search({search:p,skip:0,limit:10}),a.saveSearchValue({value:p}))};Object(c.useEffect)((function(){d(n)}),[n]);var g=Object(m.db)()._t,h={searchGlobalPlaceholder:g("PLACEHOLDER.SEARCH_GLOBAL","Search for anything in this Driff"),whatDoYouWantToFind:g("SEARCH.WHAT_DO_YOU_WANT_TO_FIND","What do you want to find?")};return s.a.createElement(u,{className:"card p-t-b-40","data-backround-image":"assets/media/image/image1.jpg"},s.a.createElement("div",{className:"container"},s.a.createElement("div",{className:"row d-flex justify-content-center"},s.a.createElement("div",null,s.a.createElement("h2",{className:"mb-4 text-center"},h.whatDoYouWantToFind),s.a.createElement("div",{className:"input-group"},s.a.createElement("input",{onChange:function(e){""===e.target.value.trim()&&""!==n&&(t(),a.saveSearchValue({value:""})),d(e.target.value)},onKeyDown:function(e){"Enter"===e.key&&E()},type:"text",className:"form-control",placeholder:h.searchGlobalPlaceholder,"aria-describedby":"button-addon1",autoFocus:!0,value:p}),""!==p.trim()&&s.a.createElement("button",{onClick:function(){d(""),t(),a.search({search:"",skip:0,limit:10}),a.saveSearchValue({value:""})},className:"btn-cross",type:"button"},s.a.createElement(o.s,{icon:"x"})),s.a.createElement("div",{className:"input-group-append"},s.a.createElement("button",{className:"btn btn-outline-light",type:"button",onClick:E},s.a.createElement(o.s,{icon:"search"}))))))))},d=function(e){var a=e.activeTab,t=e.onSelectTab,n=e.tabs,l=e.dictionary;return s.a.createElement("ul",{className:"nav nav-pills mb-4",role:"tablist"},n.hasOwnProperty("CHANNEL")&&Object.keys(n.CHANNEL).length>0&&s.a.createElement("li",{className:"nav-item"},s.a.createElement("a",{className:"nav-link ".concat(("channel"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"channel",role:"tab","aria-controls":"clasic","aria-selected":"true"},l.chatChannel)),n.hasOwnProperty("CHAT")&&Object.keys(n.CHAT).length>0&&s.a.createElement("li",{className:"nav-item"},s.a.createElement("a",{className:"nav-link ".concat(("chat"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"chat",role:"tab","aria-controls":"clasic","aria-selected":"true"},l.message)),n.hasOwnProperty("COMMENT")&&Object.keys(n.COMMENT).length>0&&s.a.createElement("li",{className:"nav-item"},s.a.createElement("a",{className:"nav-link ".concat(("comment"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"comment",role:"tab","aria-controls":"clasic","aria-selected":"true"},l.comment)),n.hasOwnProperty("DOCUMENT")&&Object.keys(n.DOCUMENT).length>0&&s.a.createElement("li",{className:"nav-item"},s.a.createElement("a",{className:"nav-link ".concat(("document"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"document",role:"tab","aria-controls":"articles","aria-selected":"false"},l.files)),n.hasOwnProperty("PEOPLE")&&Object.keys(n.PEOPLE).length>0&&s.a.createElement("li",{className:"nav-item"},s.a.createElement("a",{className:"nav-link ".concat(("people"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"people",role:"tab","aria-controls":"users","aria-selected":"false"},l.people)),n.hasOwnProperty("POST")&&Object.keys(n.POST).length>0&&s.a.createElement("li",{className:"nav-item"},s.a.createElement("a",{className:"nav-link ".concat(("post"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"post",role:"tab","aria-controls":"photos","aria-selected":"false"},l.posts)),n.hasOwnProperty("WORKSPACE")&&Object.keys(n.WORKSPACE).length>0&&s.a.createElement("li",{className:"nav-item"},s.a.createElement("a",{className:"nav-link ".concat(("workspace"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"workspace",role:"tab","aria-controls":"photos","aria-selected":"false"},l.workspace)))},E=function(e){var a=e.activeTab,t=e.tabs,n=e.redirect;return s.a.createElement("div",{className:"tab-content search-results",id:"myTabContent"},s.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"channel"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("CHANNEL")&&s.a.createElement(g,{channels:t.CHANNEL.items,page:t.CHANNEL.page,redirect:n})),s.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"chat"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("CHAT")&&s.a.createElement(v,{chats:t.CHAT.items,page:t.CHAT.page,redirect:n})),s.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"comment"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("COMMENT")&&s.a.createElement(N,{comments:t.COMMENT.items,page:t.COMMENT.page,redirect:n})),s.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"document"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("DOCUMENT")&&s.a.createElement(A,{files:t.DOCUMENT.items,page:t.DOCUMENT.page,redirect:n})),s.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"people"===a)&&"active show"),id:"users",role:"tabpanel"},t.hasOwnProperty("PEOPLE")&&s.a.createElement(j,{people:t.PEOPLE.items,page:t.PEOPLE.page,redirect:n})),s.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"post"===a)&&"active show"),id:"photos",role:"tabpanel"},t.hasOwnProperty("POST")&&s.a.createElement(L,{posts:t.POST.items,page:t.POST.page,redirect:n})),s.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"workspace"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("WORKSPACE")&&s.a.createElement(W,{workspaces:t.WORKSPACE.items,page:t.WORKSPACE.page,redirect:n})))},g=function(e){var a=e.channels,t=e.page,n=e.redirect;return s.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return e.data?s.a.createElement(h,{key:e.id,data:e.data,redirect:n}):null})))},h=function(e){var a=e.data,t=e.redirect,n=a.channel;return s.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},s.a.createElement("h5",{onClick:function(){t.toChannel(n)}},n.title))},v=function(e){var a=e.chats,t=e.page,n=e.redirect;return s.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).filter((function(e){return e.data&&null!==e.data.message})).map((function(e){return s.a.createElement(k,{key:e.id,data:e.data,redirect:n})})))};function b(){var e=Object(r.a)(["\n  display: flex;\n  width: 100%;\n  p {\n    margin: 0;\n  }\n"]);return b=function(){return e},e}var f=i.a.li(b()),k=function(e){var a=e.data,t=e.redirect,n=a.channel,l=a.message;return s.a.createElement(f,{className:"list-group-item p-l-0 p-r-0"},s.a.createElement("div",null,s.a.createElement(o.a,{id:l.user.id,name:l.user.name,imageLink:l.user.profile_image_thumbnail_link?l.user.profile_image_thumbnail_link:l.user.profile_image_link,showSlider:!0})),s.a.createElement("div",{className:"ml-2",onClick:function(){t.toChat(n,l)}},s.a.createElement("p",null,l.user.name," - ",n.title),s.a.createElement("p",{className:"text-muted",dangerouslySetInnerHTML:{__html:l.body}})))},N=function(e){var a=e.comments,t=e.page,n=e.redirect;return s.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return s.a.createElement(T,{key:e.id,comment:e,redirect:n})})))};function O(){var e=Object(r.a)(["\n  img {\n    max-height: 200px;\n    padding: 20px;\n    margin-top: 20px;\n    float: right;\n  }\n  p {\n    display: none;\n    &:nth-child(1),\n    &:nth-child(2),\n    &:nth-child(3),\n    &:nth-child(4),\n    &:nth-child(5) {\n      display: block;\n    }\n  }\n"]);return O=function(){return e},e}function C(){var e=Object(r.a)(["\n  display: flex;\n  width: 100%;\n  p {\n    margin: 0;\n  }\n"]);return C=function(){return e},e}var w,y=i.a.li(C()),P=i.a.div(O()),T=function(e){var a=e.comment,t=e.redirect,n=a.data;return s.a.createElement(y,{className:"list-group-item p-l-0 p-r-0",onClick:function(){if(null!==n)if(n.workspaces.length){var e={id:n.workspaces[0].topic.id,name:n.workspaces[0].topic.name,folder_id:n.workspaces[0].workspace?n.workspaces[0].workspace.id:null,folder_name:n.workspaces[0].workspace?n.workspaces[0].workspace.name:null};t.toPost({workspace:e,post:n.post},{focusOnMessage:n.comment.id})}else t.toPost({workspace:null,post:n.post},{focusOnMessage:n.comment.id})}},null!==n&&s.a.createElement(s.a.Fragment,null,s.a.createElement("div",null,s.a.createElement(o.a,{id:n.comment.author.id,name:n.comment.author.name,imageLink:(n.comment.author.profile_image_link,n.comment.author.profile_image_thumbnail_link),showSlider:!0})),s.a.createElement("div",{className:"ml-2"},s.a.createElement("p",null,n.comment.author.name),s.a.createElement(P,{className:"text-muted",dangerouslySetInnerHTML:{__html:n.comment.body}}))),null===n&&s.a.createElement("div",null,s.a.createElement("p",{className:"text-muted",dangerouslySetInnerHTML:{__html:a.search_body}})))},_=function(e){var a=e.user,t=e.redirect;return s.a.createElement("li",{className:"list-group-item p-l-r-0"},s.a.createElement("div",{className:"media",onClick:function(){t.toPeople(a)}},s.a.createElement(o.a,{id:a.id,name:a.name,imageLink:a.profile_image_thumbnail_link?a.profile_image_thumbnail_link:a.profile_image_link,className:"mr-2"}),s.a.createElement("div",{className:"media-body"},s.a.createElement("h6",{className:"m-0"},a.name))))},j=function(e){var a=e.page,t=e.people,n=e.redirect;return s.a.createElement("ul",{className:"list-group list-group-flush"},Object.keys(t).length>0&&Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return s.a.createElement(_,{key:e.id,user:e.data,redirect:n})})))},A=function(e){var a=e.files,t=e.page,n=e.redirect;return s.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return s.a.createElement(S,{key:e.data.id,file:e.data,redirect:n})})))},S=function(e){var a=e.file,t=e.redirect;return s.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},s.a.createElement("label",{onClick:function(){t.toFiles(a)}},a.name))},L=function(e){var a=e.page,t=e.posts,n=e.redirect;return s.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return s.a.createElement(H,{key:e.id,data:e.data,redirect:n})})))},H=function(e){var a=e.data,t=e.redirect,n=a.post,l=a.workspaces,r=Object(m.X)().localizeChatDate;return s.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},s.a.createElement("div",{onClick:function(){var e=null;l.length&&(e={id:l[0].topic.id,name:l[0].topic.name,folder_id:l[0].workspace?l[0].workspace.id:null,folder_name:l[0].workspace?l[0].workspace.name:null}),t.toPost({post:n,workspace:e})}},s.a.createElement("h5",null,n.title),s.a.createElement("div",{className:"text-muted font-size-13"},s.a.createElement("div",null,r(n.created_at.timestamp)))))},x=t(0),M=t(655),R=t.n(M),U=function(e){var a=e.actions,t=e.activeTab,n=e.tabs,r=e.value,i=Object(c.useState)(!1),o=Object(l.a)(i,2),m=o[0],u=o[1],p=function(e,n){var l=t;"workspace"===t?l="topic":"people"===t&&(l="user"),u(!0),a.search({search:r,skip:e,limit:n,tag:l},(function(e,a){u(!1)}))};if(Object(c.useEffect)((function(){if(t&&!m){var e=n[t.toUpperCase()].page,a=n[t.toUpperCase()].count;(1===e&&a<10&&n[t.toUpperCase()].total_count>10||1===e&&0===a)&&p(a,10)}}),[n,t,m]),t&&n[t.toUpperCase()].maxPage<=1||null===t)return null;var d=n[t.toUpperCase()].page,E=n[t.toUpperCase()].maxPage;return s.a.createElement("nav",{className:"mt-3"},s.a.createElement(R.a,{forcePage:d-1,previousLabel:"previous",nextLabel:"next",breakLabel:"...",breakClassName:"break-me page-item",breakLinkClassName:"page-link",pageCount:E,marginPagesDisplayed:2,pageRangeDisplayed:5,onPageChange:function(e){var l=e.selected+1,r=n[t.toUpperCase()].items.slice(l>1?10*l-10:0,10*l),c=n[t.toUpperCase()].count;10!==r.length&&p(c,10*l);var s=Object(x.a)(Object(x.a)({},n[t.toUpperCase()]),{},{page:l,key:t.toUpperCase()});a.updateTabPage(s)},containerClassName:"pagination justify-content-center",subContainerClassName:"pages pagination",activeClassName:"active",pageClassName:"page-item",pageLinkClassName:"page-link",previousClassName:"page-item",previousLinkClassName:"page-link",nextClassName:"page-item",nextLinkClassName:"page-link"}))},D=t(5),W=function(e){var a=e.page,t=e.workspaces,n=e.redirect,l=Object(D.d)((function(e){return e.workspaces.workspaces}));return s.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return s.a.createElement(B,{key:e.id,data:e.data,redirect:n,workspaces:l})})))},B=function(e){var a=e.data,t=e.redirect,n=e.workspaces,l=a.topic,r=a.workspace;return s.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},s.a.createElement("h5",{onClick:function(){var e={id:l.id,name:l.name,folder_id:r?r.id:null,folder_name:r?r.name:null};n.hasOwnProperty(l.id)?t.toWorkspace(e):t.fetchWorkspaceAndRedirect(e)}},l.name))},F=i.a.div(w||(w=Object(r.a)(["\n  .empty-notification {\n    h4 {\n      margin: 2rem auto;\n      text-align: center;\n      color: #972c86;\n    }\n  }\n"])));a.default=s.a.memo((function(e){var a=e.className,t=void 0===a?"":a,n=Object(m.N)(),r=Object(m.Q)(),i=Object(m.P)(),u=i.count,g=i.results,h=i.searching,v=i.tabs,b=i.value,f=Object(m.db)()._t,k={searching:f("SEARCH.SEARCHING","Searching"),chatChannel:f("SEARCH.TAB_CHAT_CHANNEL","Chat channel"),message:f("SEARCH.TAB_MESSAGE","Message"),comment:f("SEARCH.TAB_COMMENT","Comment"),files:f("SEARCH.TAB_FILES","Files"),people:f("SEARCH.TAB_PEOPLE","People"),posts:f("SEARCH.TAB_POSTS","Posts"),workspace:f("SEARCH.TAB_WORKSPACE","Workspace")},N=Object(c.useState)(null),O=Object(l.a)(N,2),C=O[0],w=O[1];Object(c.useEffect)((function(){return document.getElementById("main").setAttribute("style","overflow: auto"),function(){return document.getElementById("main").removeAttribute("style")}}),[]),Object(c.useEffect)((function(){if(Object.keys(v).length&&null===C){var e=Object.keys(v)[0];w(e.toLowerCase())}else 0===Object.keys(v).length&&null!==C&&w(null)}),[v,C]);return s.a.createElement(F,{className:"user-search-panel container-fluid h-100 ".concat(t)},s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-12"},s.a.createElement("div",{className:"card"},s.a.createElement("div",{className:"card-body"},s.a.createElement(p,{actions:r,value:b,clearTab:function(){return w(null)}}),""!==b&&s.a.createElement("h4",{className:"mb-5"},s.a.createElement(o.s,{icon:"search"}),h&&s.a.createElement("span",null,k.searching," ",s.a.createElement("span",{className:"text-primary"},"\u201c",b,"\u201d")),!h&&s.a.createElement("span",null,f("SEARCH.RESULTS_FOUND","::count:: results found for:",{count:u})," ",s.a.createElement("span",{className:"text-primary"},"\u201c",b,"\u201d"))),s.a.createElement(d,{activeTab:C,onSelectTab:function(e){e.currentTarget.dataset.value!==C&&w(e.currentTarget.dataset.value)},tabs:v,dictionary:k}),s.a.createElement(E,{activeTab:C,results:g,tabs:v,redirect:n}),u>0&&s.a.createElement(U,{activeTab:C,tabs:v,actions:r,value:b}))))))}))}}]);