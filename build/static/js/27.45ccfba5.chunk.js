(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[27],{731:function(e,t,n){"use strict";n.r(t);var a,i,r=n(7),c=n(11),o=n(9),s=n(1),l=n.n(s),u=n(38),m=n(10),d=n(197),E=n(12),v=n(626),h=n(19),f=n(14),T=n(5),I=n(740),_=n(17),p=n(36),O=m.a.div(a||(a=Object(o.a)(["\n  overflow: auto;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n\n  .people-header {\n    display: flex;\n    justify-content: space-between;\n    margin-bottom: 1rem;\n    flex-flow: row wrap;\n  }\n\n  .people-search {\n    flex: 0 0 80%;\n    justify-content: flex-start;\n    padding-left: 0;\n    flex-flow: row wrap;\n  }\n"]))),b=Object(m.a)(d.a)(i||(i=Object(o.a)(["\n  width: 50%;\n  margin-bottom: 1rem;\n  min-width: 250px;\n"])));t.default=l.a.memo((function(e){var t=e.className,n=void 0===t?"":t,a=Object(E.eb)(),i=a.users,o=a.userActions,m=a.loggedUser,d=a.selectUserChannel,A=Object(T.d)((function(e){return e.users.roles})),P=Object(T.d)((function(e){return e.users.archivedUsers})),w=Object(T.d)((function(e){return e.users.usersWithoutActivity})),N=Object(T.d)((function(e){return e.users.usersWithoutActivityLoaded})),C=Object(u.g)(),y=Object(T.c)(),L=Object(s.useState)(""),g=Object(c.a)(L,2),R=g[0],x=g[1],U=Object(s.useState)(!1),S=Object(c.a)(U,2),j=S[0],V=S[1],D=Object(s.useState)(!1),M=Object(c.a)(D,2),k=M[0],H=M[1],F=["gripp_bot_account","gripp_bot_invoice","gripp_bot_offerte","gripp_bot_project","gripp_bot_account","driff_webhook_bot","huddle_bot"],X=[].concat(Object(r.a)(Object.values(i)),Object(r.a)(P)).filter((function(e){return!e.email||!F.includes(e.email)})),B={search:Object(s.useRef)()},W=function(e){C.push("/profile/".concat(e.id,"/").concat(Object(_.h)(e.name)))},Y=function(e){return d(e)},G=X.filter((function(e){if(["gripp_project_bot","gripp_account_activation","gripp_offerte_bot","gripp_invoice_bot","gripp_police_bot","driff_webhook_bot"].includes(e.email))return!1;if(j){if(1===e.active)return!1;if(""===e.name.trim())return!1}else{if(k)return!e.has_accepted&&e.active;if(1!==e.active)return!1}return""===R||!!(-1!==e.name.toLowerCase().search(R.toLowerCase())||-1!==e.email.toLowerCase().search(R.toLowerCase())||e.role&&-1!==e.role.name.toLowerCase().search(R.toLowerCase()))})).sort((function(e,t){return e.name.localeCompare(t.name)})),J=Object(E.bb)()._t,q={searchPeoplePlaceholder:J("PLACEHOLDER.SEARCH_PEOPLE","Search by name or email"),peopleExternal:J("PEOPLE.EXTERNAL","External"),peopleInvited:J("PEOPLE.INVITED","Invited"),assignAsAdmin:J("PEOPLE.ASSIGN_AS_ADMIN","Assign as administrator"),assignAsEmployee:J("PEOPLE.ASSIGN_AS_EMPLOYEE","Assign as employee"),archiveUser:J("PEOPLE.ARCHIVE_USER","Archive user"),unarchiveUser:J("PEOPLE.UNARCHIVE_USER","Unarchive user"),showInactiveMembers:J("PEOPLE.SHOW_INACTIVE_MEMBERS","Show inactive members"),archive:J("PEOPLE.ARCHIVE","Archive"),unarchive:J("PEOPLE.UNARCHIVE","Un-archive"),archiveConfirmationText:J("PEOPLE.ARCHIVE_CONFIRMATION_TEXT","Are you sure you want to archive this user? This means this user can't log in anymore and will be removed from all its workspaces and group chats. If you want to remove him also from all chats and workspaces please use archive this user."),unarchiveConfirmationText:J("PEOPLE.UNARCHIVE_CONFIRMATION_TEXT","Are you sure you want to un-archive this user? The user will be re-added to its connected workspaces and group chats."),cancel:J("BUTTON.CANCEL","Cancel"),activateUser:J("PEOPLE.ACTIVATE_USER","Activate user"),deactivateUser:J("PEOPLE.DEACTIVATE_USER","Deactivate user"),deactivateConfirmationText:J("PEOPLE.DEACTIVATE_CONFIRMATION_TEXT","Are you sure you want to deactivate this user? This means this user can't log in anymore. If you want to remove him also from all chats and workspaces please use archive this user."),activateConfirmationText:J("PEOPLE.ACTIVATE_CONFIRMATION_TEXT","Are you sure you want to activate this user? This means this user can log in again and see chats and workspaces."),activate:J("PEOPLE.ACTIVATE","Activate"),deactivate:J("PEOPLE.DEACTIVATE","Deactivate"),moveToInternal:J("PEOPLE.MOVE_TO_INTERNAL","Move to internal"),moveToExternal:J("PEOPLE.MOVE_TO_EXTERNAL","Move to external"),deleteUser:J("PEOPLE.DELETE_USER","Delete user"),deleteConfirmationText:J("PEOPLE.DELETE_CONFIRMATION_TEXT","Are you sure you want to delete this user? This means this user can't log in anymore."),btnInviteUsers:J("BUTTON.INVITE_USERS","Invite users"),resendInvitation:J("PEOPLE.RESEND_INVITATION","Resend invitation"),showInvited:J("PEOPLE.SHOW_INVITED","Show invited"),removeInvitedInternal:J("PEOPLE.REMOVE_INVITED_INTERNAL","Remove invited internal user"),sendInviteManually:J("PEOPLE.SEND_INVITE_MANUALLY","Send invite manually"),deleteInvitedUser:J("PEOPLE.DELETE_INVITED_USER","Delete invited user"),deleteInvitedConfirmationText:J("PEOPLE.DELETE_INVITED_CONFIRMATION_TEXT","Are you sure you want to remove this invited user?"),toasterRemoveInvited:J("TOASTER.REMOVE_INVITED_USER","Removed invited user")},z=Object(E.W)();Object(s.useEffect)((function(){"admin"!==m.role.name&&"owner"!==m.role.name||y(Object(p.n)()),B.search.current.focus(),0===Object.keys(A).length&&o.fetchRoles(),0===P.length&&o.fetchArchivedUsers()}),[]);var K=function(e){var t={type:"confirmation",headerText:e.active?q.archive:q.unarchive,submitText:e.active?q.archive:q.unarchive,cancelText:q.cancel,bodyText:e.active?q.archiveConfirmationText:q.unarchiveConfirmationText,actions:{onSubmit:function(){e.active?o.archive({user_id:e.id},(function(t,n){t||z.success("".concat(e.name," archived."))})):o.unarchive({user_id:e.id},(function(t,n){t||z.success("".concat(e.name," unarchived."))}))}}};y(Object(f.a)(t))},Q=function(e){var t={type:"confirmation",headerText:e.active?q.deactivate:q.activate,submitText:e.active?q.deactivate:q.activate,cancelText:q.cancel,bodyText:e.active?q.deactivateConfirmationText:q.activateConfirmationText,actions:{onSubmit:function(){e.active&&!e.deactivate?o.deactivate({user_id:e.id},(function(t,n){t||z.success("".concat(e.name," deactivated."))})):0===e.active&&e.deactivate&&o.activate({user_id:e.id},(function(t,n){t||z.success("".concat(e.name," activated."))}))}}};y(Object(f.a)(t))},Z=function(e){var t={type:"confirmation",headerText:q.deleteUser,submitText:q.deleteUser,cancelText:q.cancel,bodyText:q.deleteConfirmationText,actions:{onSubmit:function(){o.deleteUserAccount({user_id:e.id},(function(t,n){t||z.success("".concat(e.name," deleted."))}))}}};y(Object(f.a)(t))},$=function(e){var t={user_id:e.id,email:e.email};o.resendInvitationEmail(t,(function(t,n){t?z.error(J("TOASTER.RESEND_INVITATION_FAILED","Invitation failed")):z.success(J("TOASTER.RESEND_INVITATION_SUCCESS","Invitation sent to ::email::",{email:e.email}))}))},ee=function(e){var t={type:"confirmation",headerText:q.deleteInvitedUser,submitText:q.deleteInvitedUser,cancelText:q.cancel,bodyText:q.deleteInvitedConfirmationText,actions:{onSubmit:function(){o.deleteInvitedInternalUser({user_id:e.id},(function(e,t){e||z.success("".concat(q.toasterRemoveInvited))}))}}};y(Object(f.a)(t))};return l.a.createElement(O,{className:"workspace-people container-fluid h-100 ".concat(n)},l.a.createElement("div",{className:"card"},l.a.createElement("div",{className:"card-body"},l.a.createElement("div",{className:"people-header"},l.a.createElement("div",{className:"d-flex align-items-center people-search"},l.a.createElement(b,{ref:B.search,value:R,closeButton:"true",onClickEmpty:function(){x("")},placeholder:q.searchPeoplePlaceholder,onChange:function(e){x(e.target.value)},autoFocus:!0}),l.a.createElement(I.a,{className:"ml-2 mb-3 cursor-pointer text-muted cursor-pointer",checked:j,id:"show_inactive",name:"show_inactive",type:"switch",onChange:function(){V((function(e){var t=!e;return t?z.success("Showing inactive members"):z.success("Showing active members only"),t})),k&&!j&&H(!1)},"data-success-message":"".concat(j?"Inactive users are shown":"Inactive users are no longer visible"),label:l.a.createElement("span",null,q.showInactiveMembers)}),l.a.createElement(I.a,{className:"ml-2 mb-3 cursor-pointer text-muted cursor-pointer",checked:k,id:"show_invited",name:"show_invited",type:"switch",onChange:function(){H((function(e){return!e})),j&&!k&&V(!1)},label:l.a.createElement("span",null,q.showInvited)})),l.a.createElement("div",null,l.a.createElement("button",{className:"btn btn-primary",onClick:function(){var e={type:"driff_invite_users",hasLastName:!0,invitations:[],fromRegister:!1,onPrimaryAction:function(e,t,n){0===e.length&&n.closeModal();var a=0;e.forEach((function(r,c){Object.values(i).some((function(e){return e.email===r.email}))?(z.error(l.a.createElement(l.a.Fragment,null,"Email ",l.a.createElement("b",null,r.email)," is already taken!")),c===e.length-1&&(a===e.length&&n.closeModal(),t())):o.inviteAsInternalUsers({email:r.email,first_name:r.first_name,last_name:r.last_name},(function(i,o){i&&(z.error("Something went wrong with ".concat(r.first_name," ").concat(r.last_name)),n.deleteItemByIndex(n.invitationItems.findIndex((function(e){return e.email===r.email})))),o&&(a+=1,n.deleteItemByIndex(n.invitationItems.findIndex((function(e){return e.email===r.email}))),z.success("You have invited ".concat(r.first_name," ").concat(r.last_name))),c===e.length-1&&(a===e.length&&n.closeModal(),t())}))}))}};y(Object(f.a)(e))}},l.a.createElement(h.s,{className:"mr-2",icon:"user-plus"})," ",q.btnInviteUsers))),l.a.createElement("div",{className:"row"},G.map((function(e){return l.a.createElement(v.a,{loggedUser:m,key:e.id,user:e,onNameClick:W,onChatClick:Y,dictionary:q,onUpdateRole:o.updateUserRole,showOptions:("admin"===m.role.name||"owner"===m.role.name)&&N,roles:A,onArchiveUser:K,onActivateUser:Q,onChangeUserType:o.updateType,onDeleteUser:Z,onResendInvite:$,onDeleteInvitedInternalUser:ee,showInactive:j,usersWithoutActivity:w})}))))))}))}}]);