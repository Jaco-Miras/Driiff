(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[15],{727:function(e,t,a){"use strict";a.r(t);var n,i,c=a(11),r=a(6),o=a(2),s=a(0),l=a.n(s),u=a(39),m=a(3),d=a(103),v=a(9),h=a(126),E=a(7),f=a(13),p=a(5),b=a(711),O=a(14),_=a(36),T=m.a.div(n||(n=Object(o.a)(["\n  overflow: auto;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n\n  .people-header {\n    display: flex;\n    justify-content: space-between;\n    margin-bottom: 1rem;\n    flex-flow: row wrap;\n  }\n\n  .people-search {\n    flex: 0 0 80%;\n    justify-content: flex-start;\n    padding-left: 0;\n    flex-flow: row wrap;\n  }\n"]))),w=Object(m.a)(d.a)(i||(i=Object(o.a)(["\n  width: 50%;\n  margin-bottom: 1rem;\n  min-width: 250px;\n"])));t.default=l.a.memo((function(e){var t=e.className,a=void 0===t?"":t,n=Object(v.fb)(),i=n.users,o=n.userActions,m=n.loggedUser,d=n.selectUserChannel,A=Object(p.d)((function(e){return e.users.roles})),g=Object(p.d)((function(e){return e.users.archivedUsers})),C=Object(p.d)((function(e){return e.users.usersWithoutActivity})),I=Object(p.d)((function(e){return e.users.usersWithoutActivityLoaded})),y=Object(u.g)(),P=Object(p.c)(),x=Object(s.useState)(""),L=Object(r.a)(x,2),N=L[0],j=L[1],U=Object(s.useState)(!1),R=Object(r.a)(U,2),S=R[0],k=R[1],M=Object(s.useState)(!1),V=Object(r.a)(M,2),D=V[0],H=V[1],X=["gripp_bot_account","gripp_bot_invoice","gripp_bot_offerte","gripp_bot_project","gripp_bot_account","driff_webhook_bot","huddle_bot"],F=[].concat(Object(c.a)(Object.values(i)),Object(c.a)(g)).filter((function(e){return!e.email||!X.includes(e.email)})),B={search:Object(s.useRef)()},W=function(e){y.push("/profile/".concat(e.id,"/").concat(Object(O.h)(e.name)))},G=function(e){return d(e)},J=F.filter((function(e){if(["gripp_project_bot","gripp_account_activation","gripp_offerte_bot","gripp_invoice_bot","gripp_police_bot","driff_webhook_bot"].includes(e.email))return!1;if(S){if(1===e.active)return!1;if(""===e.name.trim())return!1}else{if(D)return!e.has_accepted&&e.active;if(1!==e.active)return!1}return""===N||!!(-1!==e.name.toLowerCase().search(N.toLowerCase())||-1!==e.email.toLowerCase().search(N.toLowerCase())||e.role&&-1!==e.role.name.toLowerCase().search(N.toLowerCase()))})).sort((function(e,t){return e.name.localeCompare(t.name)})),Y=Object(v.cb)()._t,q={searchPeoplePlaceholder:Y("PLACEHOLDER.SEARCH_PEOPLE","Search by name or email"),peopleExternal:Y("PEOPLE.EXTERNAL","External"),peopleInvited:Y("PEOPLE.INVITED","Invited"),assignAsAdmin:Y("PEOPLE.ASSIGN_AS_ADMIN","Assign as administrator"),assignAsEmployee:Y("PEOPLE.ASSIGN_AS_EMPLOYEE","Assign as employee"),archiveUser:Y("PEOPLE.ARCHIVE_USER","Archive user"),unarchiveUser:Y("PEOPLE.UNARCHIVE_USER","Unarchive user"),showInactiveMembers:Y("PEOPLE.SHOW_INACTIVE_MEMBERS","Show inactive members"),archive:Y("PEOPLE.ARCHIVE","Archive"),unarchive:Y("PEOPLE.UNARCHIVE","Un-archive"),archiveConfirmationText:Y("PEOPLE.ARCHIVE_CONFIRMATION_TEXT","Are you sure you want to archive this user? This means this user can't log in anymore and will be removed from all its workspaces and group chats. If you want to remove him also from all chats and workspaces please use archive this user."),unarchiveConfirmationText:Y("PEOPLE.UNARCHIVE_CONFIRMATION_TEXT","Are you sure you want to un-archive this user? The user will be re-added to its connected workspaces and group chats."),cancel:Y("BUTTON.CANCEL","Cancel"),activateUser:Y("PEOPLE.ACTIVATE_USER","Activate user"),deactivateUser:Y("PEOPLE.DEACTIVATE_USER","Deactivate user"),deactivateConfirmationText:Y("PEOPLE.DEACTIVATE_CONFIRMATION_TEXT","Are you sure you want to deactivate this user? This means this user can't log in anymore. If you want to remove him also from all chats and workspaces please use archive this user."),activateConfirmationText:Y("PEOPLE.ACTIVATE_CONFIRMATION_TEXT","Are you sure you want to activate this user? This means this user can log in again and see chats and workspaces."),activate:Y("PEOPLE.ACTIVATE","Activate"),deactivate:Y("PEOPLE.DEACTIVATE","Deactivate"),moveToInternal:Y("PEOPLE.MOVE_TO_INTERNAL","Move to internal"),moveToExternal:Y("PEOPLE.MOVE_TO_EXTERNAL","Move to external"),deleteUser:Y("PEOPLE.DELETE_USER","Delete user"),deleteConfirmationText:Y("PEOPLE.DELETE_CONFIRMATION_TEXT","Are you sure you want to delete this user? This means this user can't log in anymore.")},z=Object(v.X)();Object(s.useEffect)((function(){"admin"!==m.role.name&&"owner"!==m.role.name||P(Object(_.m)()),B.search.current.focus(),0===Object.keys(A).length&&o.fetchRoles(),0===g.length&&o.fetchArchivedUsers()}),[]);var K=function(e){var t={type:"confirmation",headerText:e.active?q.archive:q.unarchive,submitText:e.active?q.archive:q.unarchive,cancelText:q.cancel,bodyText:e.active?q.archiveConfirmationText:q.unarchiveConfirmationText,actions:{onSubmit:function(){e.active?o.archive({user_id:e.id},(function(t,a){t||z.success("".concat(e.name," archived."))})):o.unarchive({user_id:e.id},(function(t,a){t||z.success("".concat(e.name," unarchived."))}))}}};P(Object(f.a)(t))},Q=function(e){var t={type:"confirmation",headerText:e.active?q.deactivate:q.activate,submitText:e.active?q.deactivate:q.activate,cancelText:q.cancel,bodyText:e.active?q.deactivateConfirmationText:q.activateConfirmationText,actions:{onSubmit:function(){e.active&&!e.deactivate?o.deactivate({user_id:e.id},(function(t,a){t||z.success("".concat(e.name," deactivated."))})):0===e.active&&e.deactivate&&o.activate({user_id:e.id},(function(t,a){t||z.success("".concat(e.name," activated."))}))}}};P(Object(f.a)(t))},Z=function(e){var t={type:"confirmation",headerText:q.deleteUser,submitText:q.deleteUser,cancelText:q.cancel,bodyText:q.deleteConfirmationText,actions:{onSubmit:function(){o.deleteUserAccount({user_id:e.id},(function(t,a){t||z.success("".concat(e.name," deleted."))}))}}};P(Object(f.a)(t))};return l.a.createElement(T,{className:"workspace-people container-fluid h-100 ".concat(a)},l.a.createElement("div",{className:"card"},l.a.createElement("div",{className:"card-body"},l.a.createElement("div",{className:"people-header"},l.a.createElement("div",{className:"d-flex align-items-center people-search"},l.a.createElement(w,{ref:B.search,value:N,closeButton:"true",onClickEmpty:function(){j("")},placeholder:"Search by name or email",onChange:function(e){j(e.target.value)},autoFocus:!0}),l.a.createElement(b.a,{className:"ml-2 mb-3 cursor-pointer text-muted cursor-pointer",checked:S,id:"show_inactive",name:"show_inactive",type:"switch",onChange:function(){k((function(e){var t=!e;return t?z.success("Showing inactive members"):z.success("Showing active members only"),t})),D&&!S&&H(!1)},"data-success-message":"".concat(S?"Inactive users are shown":"Inactive users are no longer visible"),label:l.a.createElement("span",null,q.showInactiveMembers)}),l.a.createElement(b.a,{className:"ml-2 mb-3 cursor-pointer text-muted cursor-pointer",checked:D,id:"show_invited",name:"show_invited",type:"switch",onChange:function(){H((function(e){return!e})),S&&!D&&k(!1)},label:l.a.createElement("span",null,"Show invited")})),l.a.createElement("div",null,l.a.createElement("button",{className:"btn btn-primary",onClick:function(){var e={type:"driff_invite_users",hasLastName:!0,invitations:[],fromRegister:!1,onPrimaryAction:function(e,t,a){0===e.length&&a.closeModal();var n=0;e.forEach((function(c,r){Object.values(i).some((function(e){return e.email===c.email}))?(z.error(l.a.createElement(l.a.Fragment,null,"Email ",l.a.createElement("b",null,c.email)," is already taken!")),r===e.length-1&&(n===e.length&&a.closeModal(),t())):o.inviteAsInternalUsers({email:c.email,first_name:c.first_name,last_name:c.last_name},(function(i,o){i&&(z.error("Something went wrong with ".concat(c.first_name," ").concat(c.last_name)),a.deleteItemByIndex(a.invitationItems.findIndex((function(e){return e.email===c.email})))),o&&(n+=1,a.deleteItemByIndex(a.invitationItems.findIndex((function(e){return e.email===c.email}))),z.success("You have invited ".concat(c.first_name," ").concat(c.last_name))),r===e.length-1&&(n===e.length&&a.closeModal(),t())}))}))}};P(Object(f.a)(e))}},l.a.createElement(E.s,{className:"mr-2",icon:"user-plus"})," Invite users"))),l.a.createElement("div",{className:"row"},J.map((function(e){return l.a.createElement(h.a,{loggedUser:m,key:e.id,user:e,onNameClick:W,onChatClick:G,dictionary:q,onUpdateRole:o.updateUserRole,showOptions:("admin"===m.role.name||"owner"===m.role.name)&&I,roles:A,onArchiveUser:K,onActivateUser:Q,onChangeUserType:o.updateType,onDeleteUser:Z,showInactive:S,usersWithoutActivity:C})}))))))}))}}]);