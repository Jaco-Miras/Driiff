(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[6],{719:function(e,t,a){"use strict";a.r(t);var n,i,c=a(11),r=a(6),o=a(2),s=a(0),l=a.n(s),u=a(39),m=a(3),v=a(104),d=a(9),E=a(121),h=a(7),f=a(13),p=a(5),b=a(715),O=a(14),T=a(37),A=m.a.div(n||(n=Object(o.a)(["\n  overflow: auto;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n\n  .people-header {\n    display: flex;\n    justify-content: space-between;\n    margin-bottom: 1rem;\n    flex-flow: row wrap;\n  }\n\n  .people-search {\n    flex: 0 0 80%;\n    justify-content: flex-start;\n    padding-left: 0;\n    flex-flow: row wrap;\n  }\n"]))),_=Object(m.a)(v.a)(i||(i=Object(o.a)(["\n  width: 50%;\n  margin-bottom: 1rem;\n  min-width: 250px;\n"])));t.default=l.a.memo((function(e){var t=e.className,a=void 0===t?"":t,n=Object(d.fb)(),i=n.users,o=n.userActions,m=n.loggedUser,v=n.selectUserChannel,w=Object(p.useSelector)((function(e){return e.users.roles})),I=Object(p.useSelector)((function(e){return e.users.archivedUsers})),C=Object(p.useSelector)((function(e){return e.users.usersWithoutActivity})),P=Object(p.useSelector)((function(e){return e.users.usersWithoutActivityLoaded})),y=Object(u.g)(),g=Object(p.useDispatch)(),L=Object(s.useState)(""),x=Object(r.a)(L,2),N=x[0],j=x[1],U=Object(s.useState)(!1),S=Object(r.a)(U,2),R=S[0],k=S[1],M=[].concat(Object(c.a)(Object.values(i)),Object(c.a)(I)),V={search:Object(s.useRef)()},D=function(e){y.push("/profile/".concat(e.id,"/").concat(Object(O.h)(e.name)))},H=function(e){return v(e)},X=M.filter((function(e){if(["gripp_project_bot","gripp_account_activation","gripp_offerte_bot","gripp_invoice_bot","gripp_police_bot","driff_webhook_bot"].includes(e.email))return!1;if(R){if(1===e.active)return!1;if(""===e.name.trim())return!1}else if(1!==e.active)return!1;return""===N||!!(-1!==e.name.toLowerCase().search(N.toLowerCase())||-1!==e.email.toLowerCase().search(N.toLowerCase())||e.role&&-1!==e.role.name.toLowerCase().search(N.toLowerCase()))})).sort((function(e,t){return e.name.localeCompare(t.name)})),F=Object(d.cb)()._t,B={searchPeoplePlaceholder:F("PLACEHOLDER.SEARCH_PEOPLE","Search by name or email"),peopleExternal:F("PEOPLE.EXTERNAL","External"),peopleInvited:F("PEOPLE.INVITED","Invited"),assignAsAdmin:F("PEOPLE.ASSIGN_AS_ADMIN","Assign as administrator"),assignAsEmployee:F("PEOPLE.ASSIGN_AS_EMPLOYEE","Assign as employee"),archiveUser:F("PEOPLE.ARCHIVE_USER","Archive user"),unarchiveUser:F("PEOPLE.UNARCHIVE_USER","Unarchive user"),showInactiveMembers:F("PEOPLE.SHOW_INACTIVE_MEMBERS","Show inactive members"),archive:F("PEOPLE.ARCHIVE","Archive"),unarchive:F("PEOPLE.UNARCHIVE","Un-archive"),archiveConfirmationText:F("PEOPLE.ARCHIVE_CONFIRMATION_TEXT","Are you sure you want to archive this user? This means this user can't log in anymore and will be removed from all its workspaces and group chats. If you want to remove him also from all chats and workspaces please use archive this user."),unarchiveConfirmationText:F("PEOPLE.UNARCHIVE_CONFIRMATION_TEXT","Are you sure you want to un-archive this user? The user will be re-added to its connected workspaces and group chats."),cancel:F("BUTTON.CANCEL","Cancel"),activateUser:F("PEOPLE.ACTIVATE_USER","Activate user"),deactivateUser:F("PEOPLE.DEACTIVATE_USER","Deactivate user"),deactivateConfirmationText:F("PEOPLE.DEACTIVATE_CONFIRMATION_TEXT","Are you sure you want to deactivate this user? This means this user can't log in anymore. If you want to remove him also from all chats and workspaces please use archive this user."),activateConfirmationText:F("PEOPLE.ACTIVATE_CONFIRMATION_TEXT","Are you sure you want to activate this user? This means this user can log in again and see chats and workspaces."),activate:F("PEOPLE.ACTIVATE","Activate"),deactivate:F("PEOPLE.DEACTIVATE","Deactivate"),moveToInternal:F("PEOPLE.MOVE_TO_INTERNAL","Move to internal"),moveToExternal:F("PEOPLE.MOVE_TO_EXTERNAL","Move to external"),deleteUser:F("PEOPLE.DELETE_USER","Delete user"),deleteConfirmationText:F("PEOPLE.DELETE_CONFIRMATION_TEXT","Are you sure you want to delete this user? This means this user can't log in anymore.")},W=Object(d.X)();Object(s.useEffect)((function(){"admin"!==m.role.name&&"owner"!==m.role.name||g(Object(T.m)()),V.search.current.focus(),0===Object.keys(w).length&&o.fetchRoles(),0===I.length&&o.fetchArchivedUsers()}),[]);var G=function(e){var t={type:"confirmation",headerText:e.active?B.archive:B.unarchive,submitText:e.active?B.archive:B.unarchive,cancelText:B.cancel,bodyText:e.active?B.archiveConfirmationText:B.unarchiveConfirmationText,actions:{onSubmit:function(){e.active?o.archive({user_id:e.id},(function(t,a){t||W.success("".concat(e.name," archived."))})):o.unarchive({user_id:e.id},(function(t,a){t||W.success("".concat(e.name," unarchived."))}))}}};g(Object(f.a)(t))},J=function(e){var t={type:"confirmation",headerText:e.active?B.deactivate:B.activate,submitText:e.active?B.deactivate:B.activate,cancelText:B.cancel,bodyText:e.active?B.deactivateConfirmationText:B.activateConfirmationText,actions:{onSubmit:function(){e.active&&!e.deactivate?o.deactivate({user_id:e.id},(function(t,a){t||W.success("".concat(e.name," deactivated."))})):0===e.active&&e.deactivate&&o.activate({user_id:e.id},(function(t,a){t||W.success("".concat(e.name," activated."))}))}}};g(Object(f.a)(t))},Y=function(e){var t={type:"confirmation",headerText:B.deleteUser,submitText:B.deleteUser,cancelText:B.cancel,bodyText:B.deleteConfirmationText,actions:{onSubmit:function(){o.deleteUserAccount({user_id:e.id},(function(t,a){t||W.success("".concat(e.name," deleted."))}))}}};g(Object(f.a)(t))};return l.a.createElement(A,{className:"workspace-people container-fluid h-100 ".concat(a)},l.a.createElement("div",{className:"card"},l.a.createElement("div",{className:"card-body"},l.a.createElement("div",{className:"people-header"},l.a.createElement("div",{className:"d-flex align-items-center people-search"},l.a.createElement(_,{ref:V.search,value:N,closeButton:"true",onClickEmpty:function(){j("")},placeholder:"Search by name or email",onChange:function(e){j(e.target.value)},autoFocus:!0}),l.a.createElement(b.a,{className:"ml-2 mb-3 cursor-pointer text-muted cursor-pointer",checked:R,id:"show_inactive",name:"show_inactive",type:"switch",onChange:function(){k((function(e){var t=!e;return t?W.success("Showing inactive members"):W.success("Showing active members only"),t}))},"data-success-message":"".concat(R?"Inactive users are shown":"Inactive users are no longer visible"),label:l.a.createElement("span",null,B.showInactiveMembers)})),l.a.createElement("div",null,l.a.createElement("button",{className:"btn btn-primary",onClick:function(){var e={type:"driff_invite_users",hasLastName:!0,invitations:[],onPrimaryAction:function(e,t,a){0===e.length&&a.closeModal();var n=0;e.forEach((function(c,r){Object.values(i).some((function(e){return e.email===c.email}))?(W.error(l.a.createElement(l.a.Fragment,null,"Email ",l.a.createElement("b",null,c.email)," is already taken!")),r===e.length-1&&(n===e.length&&a.closeModal(),t())):o.inviteAsInternalUsers({email:c.email,first_name:c.first_name,last_name:c.last_name},(function(i,o){i&&(W.error("Something went wrong with ".concat(c.first_name," ").concat(c.last_name)),a.deleteItemByIndex(a.invitationItems.findIndex((function(e){return e.email===c.email})))),o&&(n+=1,a.deleteItemByIndex(a.invitationItems.findIndex((function(e){return e.email===c.email}))),W.success("You have invited ".concat(c.first_name," ").concat(c.last_name))),r===e.length-1&&(n===e.length&&a.closeModal(),t())}))}))}};g(Object(f.a)(e))}},l.a.createElement(h.s,{className:"mr-2",icon:"user-plus"})," Invite users"))),l.a.createElement("div",{className:"row"},X.map((function(e){return l.a.createElement(E.a,{loggedUser:m,key:e.id,user:e,onNameClick:D,onChatClick:H,dictionary:B,onUpdateRole:o.updateUserRole,showOptions:("admin"===m.role.name||"owner"===m.role.name)&&P,roles:w,onArchiveUser:G,onActivateUser:J,onChangeUserType:o.updateType,onDeleteUser:Y,showInactive:R,usersWithoutActivity:C})}))))))}))}}]);