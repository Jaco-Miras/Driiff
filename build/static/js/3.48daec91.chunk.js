(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[3],{702:function(e,t,a){"use strict";a.r(t);var n,c,i=a(11),r=a(5),s=a(2),o=a(0),l=a.n(o),u=a(49),m=a(3),v=a(103),h=a(8),E=a(121),d=a(7),f=a(13),p=a(6),b=a(701),O=a(14),T=m.a.div(n||(n=Object(s.a)(["\n  overflow: auto;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n\n  .people-header {\n    display: flex;\n    justify-content: space-between;\n    margin-bottom: 1rem;\n  }\n\n  .people-search {\n    flex: 0 0 80%;\n    justify-content: flex-start;\n    padding-left: 0;\n  }\n"]))),A=Object(m.a)(v.a)(c||(c=Object(s.a)(["\n  width: 50%;\n  margin-bottom: 1rem;\n  min-width: 250px;\n"])));t.default=l.a.memo((function(e){var t=e.className,a=void 0===t?"":t,n=Object(h.eb)(),c=n.users,s=n.userActions,m=n.loggedUser,v=n.selectUserChannel,_=Object(p.useSelector)((function(e){return e.users.roles})),I=Object(p.useSelector)((function(e){return e.users.archivedUsers})),P=Object(u.g)(),w=Object(p.useDispatch)(),C=Object(o.useState)(""),g=Object(r.a)(C,2),y=g[0],N=g[1],L=Object(o.useState)(!1),x=Object(r.a)(L,2),j=x[0],S=x[1],U=[].concat(Object(i.a)(Object.values(c)),Object(i.a)(I)),R={search:Object(o.useRef)()},k=function(e){P.push("/profile/".concat(e.id,"/").concat(Object(O.h)(e.name)))},M=function(e){return v(e)},V=U.filter((function(e){if(["gripp_project_bot","gripp_account_activation","gripp_offerte_bot","gripp_invoice_bot","gripp_police_bot","driff_webhook_bot"].includes(e.email))return!1;if(j){if(1===e.active)return!1;if(""===e.name.trim())return!1}else if(1!==e.active)return!1;return""===y||-1!==e.name.toLowerCase().search(y.toLowerCase())||-1!==e.email.toLowerCase().search(y.toLowerCase())})).sort((function(e,t){return e.name.localeCompare(t.name)})),D=Object(h.cb)()._t,H={searchPeoplePlaceholder:D("PLACEHOLDER.SEARCH_PEOPLE","Search by name or email"),peopleExternal:D("PEOPLE.EXTERNAL","External"),peopleInvited:D("PEOPLE.INVITED","Invited"),assignAsAdmin:D("PEOPLE.ASSIGN_AS_ADMIN","Assign as administrator"),assignAsEmployee:D("PEOPLE.ASSIGN_AS_EMPLOYEE","Assign as employee"),archiveUser:D("PEOPLE.ARCHIVE_USER","Archive user"),unarchiveUser:D("PEOPLE.UNARCHIVE_USER","Unarchive user"),showInactiveMembers:D("PEOPLE.SHOW_INACTIVE_MEMBERS","Show inactive members"),archive:D("PEOPLE.ARCHIVE","Archive"),unarchive:D("PEOPLE.UNARCHIVE","Un-archive"),archiveConfirmationText:D("PEOPLE.ARCHIVE_CONFIRMATION_TEXT","Are you sure you want to archive this user? This means this user can't log in anymore and will be removed from all its workspaces and group chats. If you want to remove him also from all chats and workspaces please use archive this user."),unarchiveConfirmationText:D("PEOPLE.UNARCHIVE_CONFIRMATION_TEXT","Are you sure you want to un-archive this user? The user will be re-added to its connected workspaces and group chats."),cancel:D("BUTTON.CANCEL","Cancel"),activateUser:D("PEOPLE.ACTIVATE_USER","Activate user"),deactivateUser:D("PEOPLE.DEACTIVATE_USER","Deactivate user"),deactivateConfirmationText:D("PEOPLE.DEACTIVATE_CONFIRMATION_TEXT","Are you sure you want to deactivate this user? This means this user can't log in anymore. If you want to remove him also from all chats and workspaces please use archive this user."),activateConfirmationText:D("PEOPLE.ACTIVATE_CONFIRMATION_TEXT","Are you sure you want to activate this user? This means this user can log in again and see chats and workspaces."),activate:D("PEOPLE.ACTIVATE","Activate"),deactivate:D("PEOPLE.DEACTIVATE","Deactivate"),moveToInternal:D("PEOPLE.MOVE_TO_INTERNAL","Move to internal"),moveToExternal:D("PEOPLE.MOVE_TO_EXTERNAL","Move to external")},X=Object(h.X)();Object(o.useEffect)((function(){R.search.current.focus(),0===Object.keys(_).length&&s.fetchRoles(),0===I.length&&s.fetchArchivedUsers()}),[]);var F=function(e){var t={type:"confirmation",headerText:e.active?H.archive:H.unarchive,submitText:e.active?H.archive:H.unarchive,cancelText:H.cancel,bodyText:e.active?H.archiveConfirmationText:H.unarchiveConfirmationText,actions:{onSubmit:function(){e.active?s.archive({user_id:e.id},(function(t,a){t||X.success("".concat(e.name," archived."))})):s.unarchive({user_id:e.id},(function(t,a){t||X.success("".concat(e.name," unarchived."))}))}}};w(Object(f.a)(t))},B=function(e){var t={type:"confirmation",headerText:e.active?H.deactivate:H.activate,submitText:e.active?H.deactivate:H.activate,cancelText:H.cancel,bodyText:e.active?H.deactivateConfirmationText:H.activateConfirmationText,actions:{onSubmit:function(){e.active&&!e.deactivate?s.deactivate({user_id:e.id},(function(t,a){t||X.success("".concat(e.name," deactivated."))})):0===e.active&&e.deactivate&&s.activate({user_id:e.id},(function(t,a){t||X.success("".concat(e.name," activated."))}))}}};w(Object(f.a)(t))};return l.a.createElement(T,{className:"workspace-people container-fluid h-100 ".concat(a)},l.a.createElement("div",{className:"card"},l.a.createElement("div",{className:"card-body"},l.a.createElement("div",{className:"people-header"},l.a.createElement("div",{className:"d-flex align-items-center people-search"},l.a.createElement(A,{ref:R.search,value:y,closeButton:"true",onClickEmpty:function(){N("")},placeholder:"Search by name or email",onChange:function(e){N(e.target.value)},autoFocus:!0}),l.a.createElement(b.a,{className:"ml-2 mb-3 cursor-pointer text-muted cursor-pointer",checked:j,id:"show_inactive",name:"show_inactive",type:"switch",onChange:function(){S((function(e){var t=!e;return t?X.success("Showing inactive members"):X.success("Showing active members only"),t}))},"data-success-message":"".concat(j?"Inactive users are shown":"Inactive users are no longer visible"),label:l.a.createElement("span",null,H.showInactiveMembers)})),l.a.createElement("div",null,l.a.createElement("button",{className:"btn btn-primary",onClick:function(){var e={type:"driff_invite_users",hasLastName:!0,invitations:[],onPrimaryAction:function(e,t,a){0===e.length&&a.closeModal();var n=0;e.forEach((function(i,r){Object.values(c).some((function(e){return e.email===i.email}))?(X.error(l.a.createElement(l.a.Fragment,null,"Email ",l.a.createElement("b",null,i.email)," is already taken!")),r===e.length-1&&(n===e.length&&a.closeModal(),t())):s.inviteAsInternalUsers({email:i.email,first_name:i.first_name,last_name:i.last_name},(function(c,s){c&&(X.error("Something went wrong with ".concat(i.first_name," ").concat(i.last_name)),a.deleteItemByIndex(a.invitationItems.findIndex((function(e){return e.email===i.email})))),s&&(n+=1,a.deleteItemByIndex(a.invitationItems.findIndex((function(e){return e.email===i.email}))),X.success("You have invited ".concat(i.first_name," ").concat(i.last_name))),r===e.length-1&&(n===e.length&&a.closeModal(),t())}))}))}};w(Object(f.a)(e))}},l.a.createElement(d.t,{className:"mr-2",icon:"user-plus"})," Invite users"))),l.a.createElement("div",{className:"row"},V.map((function(e){return l.a.createElement(E.a,{loggedUser:m,key:e.id,user:e,onNameClick:k,onChatClick:M,dictionary:H,onUpdateRole:s.updateUserRole,showOptions:"admin"===m.role.name||"owner"===m.role.name,roles:_,onArchiveUser:F,onActivateUser:B,onChangeUserType:s.updateType,showInactive:j})}))))))}))}}]);