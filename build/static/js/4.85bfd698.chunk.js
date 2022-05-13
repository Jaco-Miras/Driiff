(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[4],{928:function(e,a,t){"use strict";t.r(a);var n=t(11),c=t(1),l=t(7),i=t(6),r=t(0),o=t.n(r),m=t(4),s=t(47),d=t(71),u=t(97),E=t(865),b=t(850),f=t(852),v=t(849),O=t(851),p=t(275),h=t(5),T=t(14),N=t(13),_=t(12),j=t(65),x=t(289),y=t(10),g=t(19),A=t(50),I=t(77),k=t(21),P=function(e){var a=e.user,t=Object(y.hb)(),n=Object(y.mb)()._t,c={searchTeamsPlaceholder:n("PLACEHOLDER.SEARCH_TEAMS","Search teams"),searchPeoplePlaceholder:n("PLACEHOLDER.SEARCH_PEOPLE","Search by name or email"),peopleExternal:n("PEOPLE.EXTERNAL","External"),peopleInvited:n("PEOPLE.INVITED","Invited"),assignAsAdmin:n("PEOPLE.ASSIGN_AS_ADMIN","Assign as administrator"),assignAsSupervisor:n("PEOPLE.ASSIGN_AS_SUPERVISOR","Assign as supervisor"),assignAsEmployee:n("PEOPLE.ASSIGN_AS_EMPLOYEE","Assign as employee"),archiveUser:n("PEOPLE.ARCHIVE_USER","Archive user"),unarchiveUser:n("PEOPLE.UNARCHIVE_USER","Unarchive user"),showInactiveMembers:n("PEOPLE.SHOW_INACTIVE_MEMBERS","Show inactive members"),archive:n("PEOPLE.ARCHIVE","Archive"),unarchive:n("PEOPLE.UNARCHIVE","Un-archive"),archiveConfirmationText:n("PEOPLE.ARCHIVE_CONFIRMATION_TEXT","Are you sure you want to archive this user? This means this user can't log in anymore and will be removed from all its workspaces and group chats. If you want to remove him also from all chats and workspaces please use archive this user."),unarchiveConfirmationText:n("PEOPLE.UNARCHIVE_CONFIRMATION_TEXT","Are you sure you want to un-archive this user? The user will be re-added to its connected workspaces and group chats."),cancel:n("BUTTON.CANCEL","Cancel"),activateUser:n("PEOPLE.ACTIVATE_USER","Activate user"),deactivateUser:n("PEOPLE.DEACTIVATE_USER","Deactivate user"),deactivateConfirmationText:n("PEOPLE.DEACTIVATE_CONFIRMATION_TEXT","Are you sure you want to deactivate this user? This means this user can't log in anymore. If you want to remove him also from all chats and workspaces please use archive this user."),activateConfirmationText:n("PEOPLE.ACTIVATE_CONFIRMATION_TEXT","Are you sure you want to activate this user? This means this user can log in again and see chats and workspaces."),activate:n("PEOPLE.ACTIVATE","Activate"),deactivate:n("PEOPLE.DEACTIVATE","Deactivate"),moveToInternal:n("PEOPLE.MOVE_TO_INTERNAL","Move to internal"),moveToExternal:n("PEOPLE.MOVE_TO_EXTERNAL","Move to external"),deleteUser:n("PEOPLE.DELETE_USER","Delete user"),deleteConfirmationText:n("PEOPLE.DELETE_CONFIRMATION_TEXT","Are you sure you want to delete this user? This means this user can't log in anymore."),btnInviteUsers:n("BUTTON.INVITE_USERS","Invite users"),resendInvitation:n("PEOPLE.RESEND_INVITATION","Resend invitation"),showInvited:n("PEOPLE.SHOW_INVITED","Show invited"),removeInvitedInternal:n("PEOPLE.REMOVE_INVITED_INTERNAL","Remove invited internal user"),sendInviteManually:n("PEOPLE.SEND_INVITE_MANUALLY","Send invite manually"),deleteInvitedUser:n("PEOPLE.DELETE_INVITED_USER","Delete invited user"),deleteInvitedConfirmationText:n("PEOPLE.DELETE_INVITED_CONFIRMATION_TEXT","Are you sure you want to remove this invited user?"),toasterRemoveInvited:n("TOASTER.REMOVE_INVITED_USER","Removed invited user"),btnTeam:n("BUTTON.TEAM","Team"),showTeams:n("PEOPLE.SHOW_TEAMS","Show teams"),editTeam:n("TEAM_OPTIONS.EDIT_TEAM","Edit team"),removeTeam:n("TEAM_OPTIONS.REMOVE_TEAM","Remove team"),removeTeamHeader:n("TEAM_MODAL.REMOVE_TEAM_HEADER","Remove team"),removeTeamBtn:n("BUTTON.REMOVE_TEAM","Remove team"),removeTeamConfirmation:n("TEAM_MODAL.REMOVE_TEAM_BODY","Are you sure you want to remove this team?"),addUserToTeam:n("PEOPLE.ADD_USER_TEAM","Add user to team"),removeTeamMember:n("PEOPLE.REMOVE_TEAM_MEMBER","Remove team member"),team:n("TEAM","Team"),internalAccounts:n("CHART.INTERNAL_ACCOUNTS","Accounts"),guestAccounts:n("CHART.GUEST_ACCOUNTS","Guest accounts"),totalAccounts:n("LABEL.TOTAL_ACCOUNTS","Total accounts"),moveToInternalConfirmation:n("PEOPLE.MOVE_TO_INTERNAL_CONFIRMATION","Are you sure you want to change user to internal account"),moveToExternalConfirmation:n("PEOPLE.MOVE_TO_EXTERNAL_CONFIRMATION","Are you sure you want to change user to guest account")},l=Object(m.d)((function(e){return e.users.usersWithoutActivity})),i=Object(m.d)((function(e){return e.admin.notifications})),r=Object(m.d)((function(e){return e.admin.notificationsLoaded})),s=Object(y.rb)(),d=function(){var e={type:"confirmation",headerText:a.active?c.archive:c.unarchive,submitText:a.active?c.archive:c.unarchive,cancelText:c.cancel,bodyText:a.active?c.archiveConfirmationText:c.unarchiveConfirmationText,actions:{onSubmit:function(){a.active?s.archive({user_id:a.id},(function(e,n){e||t.success("".concat(a.name," archived."))})):s.unarchive({user_id:a.id},(function(e,n){e||t.success("".concat(a.name," unarchived."))}))}}};s.showModal(e)},u=function(){var e={type:"confirmation",headerText:a.active?c.deactivate:c.activate,submitText:a.active?c.deactivate:c.activate,cancelText:c.cancel,bodyText:a.active?c.deactivateConfirmationText:c.activateConfirmationText,actions:{onSubmit:function(){a.active&&!a.deactivate?s.deactivate({user_id:a.id},(function(e,n){e||t.success("".concat(a.name," deactivated."))})):0===a.active&&a.deactivate&&s.activate({user_id:a.id},(function(e,n){e||t.success("".concat(a.name," activated."))}))}}};s.showModal(e)};return o.a.createElement(I.c,{className:"ml-2",width:240,moreButton:"more-horizontal"},a.active&&"internal"===a.type&&a.role&&1!==a.role.id&&a.hasOwnProperty("has_accepted")&&a.has_accepted&&o.a.createElement("div",{onClick:function(){var e={user_id:a.id,role_id:1};s.updateUserRole(e)}},c.assignAsAdmin),a.active&&"internal"===a.type&&a.role&&2!==a.role.id&&a.hasOwnProperty("has_accepted")&&a.has_accepted&&o.a.createElement("div",{onClick:function(){var e={user_id:a.id,role_id:2};s.updateUserRole(e)}},c.assignAsSupervisor),a.active&&"internal"===a.type&&a.role&&3!==a.role.id&&a.hasOwnProperty("has_accepted")&&a.has_accepted&&o.a.createElement("div",{onClick:function(){var e={user_id:a.id,role_id:3};s.updateUserRole(e)}},c.assignAsEmployee),a.active&&"external"===a.type&&o.a.createElement("div",{onClick:function(){var e={type:"confirmation",headerText:c.moveToInternal,submitText:c.moveToInternal,cancelText:c.cancel,bodyText:c.moveToInternalConfirmation,actions:{onSubmit:function(){var e={id:a.id,type:"internal"};s.updateType(e,(function(e,a){e||t.success("".concat(n("TOASTER.CHANGE_USER_TYPE","Change user type to ::type::",{type:"internal"})))}))}}};s.showModal(e)}},c.moveToInternal),a.active&&"internal"===a.type&&o.a.createElement("div",{onClick:function(){var e={type:"confirmation",headerText:c.moveToExternal,submitText:c.moveToExternal,cancelText:c.cancel,bodyText:c.moveToExternalConfirmation,actions:{onSubmit:function(){var e={id:a.id,type:"external"};s.updateType(e,(function(e,a){e||t.success("".concat(n("TOASTER.CHANGE_USER_TYPE","Change user type to ::type::",{type:"external"})))}))}}};s.showModal(e)}},c.moveToExternal),0!==a.active||a.deactivate?null:o.a.createElement("div",{onClick:d},c.unarchiveUser),a.active&&a.hasOwnProperty("has_accepted")&&a.has_accepted?o.a.createElement("div",{onClick:d},c.archiveUser):null,!a.deactivate&&a.active&&a.hasOwnProperty("has_accepted")&&a.has_accepted?o.a.createElement("div",{onClick:u},c.deactivateUser):null,0===a.active&&a.deactivate&&0===a.active&&a.hasOwnProperty("has_accepted")&&a.has_accepted?o.a.createElement("div",{onClick:u},c.activateUser):null,a.active&&a.hasOwnProperty("has_accepted")&&a.has_accepted&&l.some((function(e){return e.user_id===a.id}))||a.hasOwnProperty("has_accepted")&&!a.has_accepted&&"external"===a.type?o.a.createElement("div",{onClick:function(e){var a={type:"confirmation",headerText:c.deleteUser,submitText:c.deleteUser,cancelText:c.cancel,bodyText:c.deleteConfirmationText,actions:{onSubmit:function(){s.deleteUserAccount({user_id:e.id},(function(a,n){a||t.success("".concat(e.name," deleted."))}))}}};s.showModal(a)}},c.deleteUser):null,a.active&&a.hasOwnProperty("has_accepted")&&!a.has_accepted&&r&&i.email&&o.a.createElement("div",{onClick:function(){var e={user_id:a.id,email:a.email};s.resendInvitationEmail(e,(function(e,c){e?t.error(n("TOASTER.RESEND_INVITATION_FAILED","Invitation failed")):t.success(n("TOASTER.RESEND_INVITATION_SUCCESS","Invitation sent to ::email::",{email:a.email}))}))}},c.resendInvitation),a.active&&a.hasOwnProperty("has_accepted")&&!a.has_accepted&&"internal"===a.type&&o.a.createElement("div",{onClick:function(){var e={type:"confirmation",headerText:c.deleteInvitedUser,submitText:c.deleteInvitedUser,cancelText:c.cancel,bodyText:c.deleteInvitedConfirmationText,actions:{onSubmit:function(){s.deleteInvitedInternalUser({user_id:a.id},(function(e,a){e||t.success("".concat(c.toasterRemoveInvited))}))}}};s.showModal(e)}},c.removeInvitedInternal),a.active&&a.hasOwnProperty("has_accepted")&&!a.has_accepted&&"internal"===a.type&&o.a.createElement("div",{onClick:function(){Object(k.b)(t,a.invite_link)}},c.sendInviteManually),a.active&&"internal"===a.type&&o.a.createElement("div",{onClick:function(){var e={type:"add-to-team",user:a};s.showModal(e)}},c.addUserToTeam))},S=t(34),w=t.n(S);function C(){var e=Object(i.a)(["\n  overflow: auto;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n\n  .row-user-profile-panel {\n    justify-content: center;\n\n    .avatar {\n      width: 68px;\n      height: 68px;\n    }\n\n    input.designation {\n      &::-webkit-input-placeholder {\n        font-size: 12px;\n      }\n      &:-ms-input-placeholder {\n        font-size: 12px;\n      }\n      &::placeholder {\n        font-size: 12px;\n      }\n    }\n\n    .col-label {\n      max-width: 130px;\n\n      @media only screen and (min-width: 1200px) {\n        max-width: 180px;\n      }\n    }\n  }\n\n  .close {\n    border-radius: 100%;\n    padding: 2px;\n  }\n\n  label {\n    padding: 5px 10px;\n    border-radius: 6px;\n    width: 100%;\n  }\n\n  .btn-toggle {\n    &:hover {\n      .input-group-text {\n        border: 1px solid #e1e1e1;\n        background: #fff;\n        color: ",";\n      }\n    }\n    .input-group-text {\n      border: 1px solid #",";\n      background: ",";\n      color: #fff;\n    }\n    svg {\n      cursor: pointer;\n    }\n  }\n\n  .avatar-container {\n    cursor: pointer;\n    position: relative;\n    width: 68px;\n    height: 68px;\n    margin: 0 auto;\n\n    .edit-avatar {\n      position: absolute;\n      bottom: 0;\n      right: 0;\n      background-color: #fff;\n      border-radius: 50px 50px 50px 50px;\n      height: 25px;\n      width: 25px;\n      padding: 5px;\n      border-color: rgba(0, 0, 0, 0.2);\n      color: #a5aeb3;\n      border-width: 1px;\n      color: #212529;\n      svg {\n        width: 1rem;\n        height: 1rem;\n      }\n    }\n    :hover {\n      svg {\n        color: ",";\n      }\n    }\n    .dark & {\n      svg {\n        color: #fff;\n      }\n    }\n  }\n\n  .form-group {\n    &.designation {\n      margin: 0 auto;\n      width: 66.66%;\n    }\n  }\n  .email-phone-container {\n    .input-group {\n      flex-wrap: ",";\n    }\n    .dropdown-menu.show {\n      left: unset !important;\n      right: 0;\n    }\n    input {\n      width: 100%;\n    }\n  }\n  .more-options {\n    position: absolute;\n    right: 10px;\n    top: 10px;\n  }\n"]);return C=function(){return e},e}var R=h.b.div(C(),(function(e){return e.theme.colors.primary}),(function(e){return e.theme.colors.primary}),(function(e){return e.theme.colors.primary}),(function(e){return e.theme.colors.primary}),(function(e){return"email"===e.registerMode?"unset":"wrap"})),L=/[a-zA-Z]/g;a.default=o.a.memo((function(e){var a,t,i=e.className,h=void 0===i?"":i,I=Object(s.g)(),k=Object(m.c)(),S=Object(y.hb)(),C=Object(y.sb)(),M=C.users,U=C.loggedUser,D=Object(y.pb)(),V=D.checkEmail,F=D.fetchById,B=D.getReadOnlyFields,H=D.getRequiredFields,G=D.update,Y=D.updateProfileImage,X=D.fetchRoles,q=D.fetchUsersWithoutActivity,W=Object(y.qb)().selectUserChannel,z=Object(m.d)((function(e){return e.users.roles})),Z=Object(m.d)((function(e){return e.settings.user.GENERAL_SETTINGS})).dark_mode,K=M[e.match.params.id],J=K&&U.id===K.id,Q=B(K?K.import_from:""),$=H(K?K.import_from:""),ee=Object(r.useState)(!1),ae=Object(l.a)(ee,2),te=ae[0],ne=ae[1],ce=Object(r.useState)(!1),le=Object(l.a)(ce,2),ie=le[0],re=le[1],oe=Object(r.useState)(!1),me=Object(l.a)(oe,2),se=me[0],de=me[1],ue=Object(r.useState)(!1),Ee=Object(l.a)(ue,2),be=Ee[0],fe=Ee[1],ve=Object(r.useState)(K&&K.loaded?K:{}),Oe=Object(l.a)(ve,2),pe=Oe[0],he=Oe[1],Te=Object(r.useState)({valid:{},feedbackState:{},feedbackText:{}}),Ne=Object(l.a)(Te,2),_e=Ne[0],je=Ne[1],xe=Object(r.useState)("email"),ye=Object(l.a)(xe,2),ge=ye[0],Ae=ye[1],Ie=Object(r.useState)(null),ke=Object(l.a)(Ie,2),Pe=ke[0],Se=ke[1],we=Object(r.useState)(M[e.match.params.id]?M[e.match.params.id].role.id:null),Ce=Object(l.a)(we,2),Re=Ce[0],Le=Ce[1],Me={dropZoneRef:Object(r.useRef)(null),first_name:Object(r.useRef)(null),password:Object(r.useRef)(null)},Ue=[{value:1,label:"Admin"},{value:2,label:"Supervisor"},{value:3,label:"Employee"}],De=Object(y.mb)()._t,Ve={companyName:De("PROFILE.COMPANY_NAME","Company name"),information:De("PROFILE.INFORMATION","Information"),firstName:De("PROFILE.FIRST_NAME","First name:"),middleName:De("PROFILE.MIDDLE_NAME","Middle name:"),lastName:De("PROFILE.LAST_NAME","Last name:"),password:De("PROFILE.PASSWORD","Password:"),position:De("PROFILE.POSITION","Position:"),city:De("PROFILE.CITY","City:"),address:De("PROFILE.ADDRESS","Address:"),zip_code:De("PROFILE.ZIP_POST_CODE","ZIP/POST code:"),phone:De("PROFILE.PHONE","Phone:"),email:De("LOGIN.EMAIL_PHONE","Email / Phone number"),edit:De("BUTTON.EDIT","Edit"),saveChanges:De("BUTTON.SAVE_CHANGES","Save changes"),cancel:De("BUTTON.CANCEL","Cancel"),clickToChangePassword:De("PROFILE.CLICK_TO_CHANGE_PASSWORD","Click to change your password"),external:De("PROFILE.EXTERNAL","External"),invalidPhoneNumber:De("FEEDBACK.INVALID_PHONE_NUMBER","Invalid phone number"),invalidEmail:De("FEEDBACK.INVALID_EMAIL","Invalid email format"),emailRequired:De("FEEDBACK.EMAIL_REQUIRED","Email is required."),accountType:De("PROFILE.ACCOUNT_TYPE","Account type"),lastLoggedIn:De("PROFILE.LAST_LOGGED_IN","Last Logged in"),invitedBy:De("PROFILE.INVITED_BY","Invited by")},Fe=U&&"internal"===U.type&&K&&"external"===K.type&&1===K.active||U&&U.role&&U.role.id<=2,Be=function(e){if("boolean"===typeof e)return e?"is-valid":"is-invalid"},He=function(){ne((function(e){return!e})),he(Object(c.a)({},K)),je({valid:{},feedbackState:{},feedbackText:{}}),de(!1)},Ge=function(e){if(null!==e.target){var a=e.target,t=a.name,l=a.value;he((function(e){return Object(c.a)(Object(c.a)({},e),{},Object(n.a)({},t,l.trim()))}))}},Ye=function(e){if(null!==e.target){var a=e.target,t=a.name,l=a.value;if(K[t]===pe[t])return void je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(n.a)({},t,void 0)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(n.a)({},t,void 0)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(n.a)({},t,void 0))}}));"email"===t?$.includes(t)&&""===l.trim()?je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(n.a)({},t,!1)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(n.a)({},t,!1)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(n.a)({},t,Ve.emailRequired))}})):""===l.trim()||T.a.test(l.trim())?V(pe.email,(function(e,a){a&&(a.data.status?je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(n.a)({},t,!1)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(n.a)({},t,!1)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(n.a)({},t,"Email is already taken"))}})):je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(n.a)({},t,!0)),feedbackState:Object(c.a)({},e.feedbackState),feedbackText:Object(c.a)({},e.feedbackText)}})))})):je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(n.a)({},t,!1)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(n.a)({},t,!1)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(n.a)({},t,Ve.invalidEmail))}})):$.includes(t)?je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(n.a)({},t,""!==l.trim())),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(n.a)({},t,""!==l.trim())),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(n.a)({},t,""===l.trim()?"Field is required.":""))}})):je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(n.a)({},t,!0)),feedbackState:e.feedbackState,feedbackText:e.feedbackText}}))}},Xe=function(){fe(!1)},qe=function(e,a){he((function(e){return Object(c.a)(Object(c.a)({},e),{},{profile_image_link:a})})),je((function(a){return{valid:Object(c.a)(Object(c.a)({},a.valid),{},{profile_image_link:!0}),feedbackState:Object(c.a)({},a.feedbackState),feedbackText:Object(c.a)(Object(c.a)({},a.feedbackText),{},{profile_image_link:e})}})),ne(!0),S.info(o.a.createElement(o.a.Fragment,null,"Click the ",o.a.createElement("b",null,"Save Changes")," button to update your profile image."))},We=function(e){he((function(a){return Object(c.a)(Object(c.a)({},a),{},{email:e})})),je((function(e){return Object(c.a)(Object(c.a)({},e),{},{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:void 0}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:void 0}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:void 0})})}))};if(Object(r.useEffect)((function(){fetch("https://ipapi.co/json/").then((function(e){return e.json()})).then((function(e){Se(e.country)})).catch((function(e,a){})),(!e.match.params.hasOwnProperty("id")||e.match.params.hasOwnProperty("id")&&!e.match.params.hasOwnProperty("name")&&parseInt(e.match.params.id)===U.id)&&I.push("/profile/".concat(U.id,"/").concat(Object(T.i)(U.name))),U.role.id<=2&&q(),0===Object.keys(z).length&&X()}),[]),Object(r.useEffect)((function(){var a=M[e.match.params.id]?M[e.match.params.id]:{};a.hasOwnProperty("loaded")?pe.id!==a.id&&he(a):F(e.match.params.id)}),[e.match.params.id,M,he]),Object(r.useEffect)((function(){"edit"===e.match.params.mode&&pe.id&&U.id===pe.id&&(I.push("/profile/".concat(pe.id,"/").concat(Object(T.i)(pe.name))),ne(!0)),"view"===e.match.params.mode&&pe.id&&U.id===pe.id&&(I.push("/profile/".concat(pe.id,"/").concat(Object(T.i)(pe.name))),ne(!1))}),[pe,e.match.params.mode]),Object(r.useEffect)((function(){se&&Me.password.current&&Me.password.current.focus()}),[se,Me.password]),Object(r.useEffect)((function(){te&&Me.first_name.current&&(Me.first_name.current.focus(),K&&"+"===K.email.charAt(0)&&!L.test(K.email)&&Ae("number"))}),[te,Me.first_name]),Object(r.useEffect)((function(){if(We("email"===ge?"":void 0),K){var e="+"===K.email.charAt(0)&&!L.test(K.email);he((function(a){return Object(c.a)(Object(c.a)({},a),{},{email:e&&"email"===ge?"":K.email})}))}}),[ge]),Object(r.useEffect)((function(){null===Re&&M[e.match.params.id]&&Le(M[e.match.params.id].role.name)}),[Re,M]),!M[e.match.params.id])return o.a.createElement(o.a.Fragment,null);var ze="";K&&(ze="+"===K.email.charAt(0)&&!L.test(K.email)&&"email"===ge?"":K.email);return o.a.createElement(R,{className:"user-profile-panel container-fluid h-100 ".concat(h),registerMode:ge},o.a.createElement("div",{className:"row row-user-profile-panel"},o.a.createElement("div",{className:"col-12 col-lg-6 col-xl-6"},o.a.createElement("div",{className:"card"},U.role.id<=2&&U.id!==K.id&&o.a.createElement(P,{user:K}),o.a.createElement("div",{className:"card-body text-center",onDragOver:function(){be||fe(!0)}},(J||Fe)&&o.a.createElement(j.a,{acceptType:"imageOnly",hide:!be,ref:Me.dropZoneRef,onDragLeave:Xe,onDrop:function(e){!function(e){0===e.length?S.error("File type not allowed. Please use an image file."):e.length>1&&S.warning("Multiple files detected. First selected image will be used.");var a={type:"file_crop_upload",imageFile:e[0],mode:"profile",handleSubmit:qe};k(Object(N.a)(a,(function(){Xe()})))}(e.acceptedFiles)},onCancel:Xe}),o.a.createElement("div",{className:"avatar-container"},o.a.createElement(_.a,{imageLink:pe.profile_image_link,name:pe.name?pe.name:pe.email,noDefaultClick:!0,forceThumbnail:!1}),(J||Fe)&&o.a.createElement("span",{className:"btn edit-avatar",onClick:function(){te||ne(!0),Me.dropZoneRef.current.open()}},o.a.createElement(_.u,{icon:"pencil"}))),te?o.a.createElement("h5",{className:"mb-1 mt-2"},pe.first_name," ",pe.middle_name," ",pe.last_name):o.a.createElement("h5",{className:"mb-1 mt-2"},K.first_name," ",K.middle_name," ",K.last_name),te&&!Q.includes("designation")?o.a.createElement("div",{className:"text-muted small d-flex align-items-center mt-2"},o.a.createElement(g.g,{placeholder:"Job Title eg. Manager, Team Leader, Designer",className:"designation",name:"designation",onChange:Ge,onBlur:Ye,defaultValue:K.designation,isValid:_e.feedbackState.designation,valid:_e.feedbackText.designation})):o.a.createElement("p",{className:"text-muted small"},K.designation),o.a.createElement("div",{className:"col col-form my-lg-n3"},"external"===K.type&&Ve.external),U.id!==K.id&&o.a.createElement("div",{className:"d-flex justify-content-center"},""!==K.contact&&"internal"===U.type&&o.a.createElement("button",{className:"btn btn-outline-light mr-1"},o.a.createElement("a",{href:"tel:".concat(K.contact.replace(/ /g,"").replace(/-/g,""))},o.a.createElement(_.u,{className:"",icon:"phone"}))),"external"!==K.type&&"internal"===U.type&&o.a.createElement("button",{className:"ml-1 btn btn-outline-light"},o.a.createElement(_.u,{onClick:function(){!function(e){W(e)}(K)},icon:"message-circle"}))))),o.a.createElement("div",{className:"card"},te?o.a.createElement("div",{className:"card-body"},o.a.createElement("h6",{className:"card-title d-flex justify-content-between align-items-center"},Ve.information),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.firstName),o.a.createElement("div",{className:"col col-form"},Q.includes("first_name")?o.a.createElement(E.a,null,K.first_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(b.a,{className:Be(_e.valid.first_name),innerRef:Me.first_name,name:"first_name",onChange:Ge,onBlur:Ye,defaultValue:K.first_name}),o.a.createElement(x.a,{valid:_e.feedbackState.first_name},_e.feedbackText.first_name)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.middleName),o.a.createElement("div",{className:"col col-form"},Q.includes("middle_name")?o.a.createElement(E.a,null,K.middle_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(b.a,{className:Be(_e.valid.middle_name),name:"middle_name",onChange:Ge,onBlur:Ye,defaultValue:K.middle_name}),o.a.createElement(x.a,{valid:_e.feedbackState.middle_name},_e.feedbackText.middle_name)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.lastName),o.a.createElement("div",{className:"col col-form"},Q.includes("last_name")?o.a.createElement(E.a,null,K.last_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(b.a,{className:Be(_e.valid.last_name),name:"last_name",onChange:Ge,onBlur:Ye,defaultValue:K.last_name}),o.a.createElement(x.a,{valid:_e.feedbackState.last_name},_e.feedbackText.last_name)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.password),o.a.createElement("div",{className:"col col-form"},Q.includes("password")||Fe?o.a.createElement(E.a,null,"*****"):o.a.createElement(o.a.Fragment,null,o.a.createElement(E.a,{onClick:function(){de((function(e){return!e}))},className:"cursor-pointer mb-0 ".concat(se?"d-none":"")},Ve.clickToChangePassword),o.a.createElement(f.a,{className:"form-group-password mb-0 ".concat(se?"":"d-none")},o.a.createElement(v.a,null,o.a.createElement(b.a,{className:Be(_e.valid.password),innerRef:Me.password,name:"password",onChange:Ge,onBlur:Ye,defaultValue:"",type:ie?"text":"password"}),o.a.createElement(O.a,{className:"btn-toggle",addonType:"append"},o.a.createElement(p.a,{className:"btn",onClick:function(){re((function(e){return!e}))}},o.a.createElement(_.u,{icon:ie?"eye-off":"eye"})))),o.a.createElement(x.a,{valid:_e.feedbackState.password},_e.feedbackText.password))))),"external"===K.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.companyName),o.a.createElement("div",{className:"col col-form"},Q.includes("company_name")?o.a.createElement(E.a,null,K.external_company_name&&K.external_company_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(b.a,{className:Be(!0),name:"company_name",disabled:Fe||!J,onChange:Ge,onBlur:Ye,defaultValue:K.external_company_name?K.external_company_name:""})))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.city),o.a.createElement("div",{className:"col col-form"},Q.includes("place")?o.a.createElement(E.a,null,K.place):o.a.createElement(o.a.Fragment,null,o.a.createElement(b.a,{className:Be(_e.valid.place),name:"place",onChange:Ge,onBlur:Ye,defaultValue:K.place}),o.a.createElement(x.a,{valid:_e.feedbackState.place},_e.feedbackText.place)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.address),o.a.createElement("div",{className:"col col-form"},Q.includes("address")?o.a.createElement(E.a,null,K.address):o.a.createElement(o.a.Fragment,null,o.a.createElement(g.g,{name:"address",onChange:Ge,onBlur:Ye,defaultValue:K.address,isValid:_e.feedbackState.address,feedback:_e.feedbackText.address})))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.phone),o.a.createElement("div",{className:"col col-form"},Q.includes("contact")?o.a.createElement(E.a,null,K.contact):o.a.createElement(o.a.Fragment,null,o.a.createElement(b.a,{className:Be(_e.valid.contact),name:"contact",onChange:Ge,onBlur:Ye,defaultValue:K.contact}),o.a.createElement(x.a,{valid:_e.feedbackState.contact},_e.feedbackText.contact)))),o.a.createElement("div",{className:"row mb-2 email-phone-container"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.email),o.a.createElement("div",{className:"col col-form"},Q.includes("email")?o.a.createElement(E.a,null,K.email):o.a.createElement(o.a.Fragment,null,o.a.createElement(g.e,{onChange:We,name:"email_phone",isValid:_e.feedbackState.email,feedback:_e.feedbackText.email,placeholder:Ve.emailOnly,registerMode:ge,setRegisterMode:Ae,value:pe.email,defaultCountry:Pe,defaultValue:ze})))),U.role.id<=2&&U.id!==K.id&&"internal"===K.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.accountType),o.a.createElement("div",{className:"col col-form"},o.a.createElement(d.a,{className:"react-select-container",classNamePrefix:"react-select",styles:"0"===Z?A.b:A.a,value:Ue.find((function(e){return e.value===Re})),onChange:function(e){Le(e.value),he(Object(c.a)(Object(c.a)({},pe),{},{role_ids:[e.value]}))},options:Ue,menuPlacement:"top"}))),o.a.createElement("hr",null),o.a.createElement("div",{className:"d-flex justify-content-between align-items-center mt-0"},o.a.createElement("div",null,"\xa0"),o.a.createElement("div",null,o.a.createElement("span",{onClick:He,className:"btn btn-outline-light mr-2"},Ve.cancel),o.a.createElement("span",{onClick:function(){!1===Object.values(_e.valid).find((function(e){return!1===e}))?S.error("Some fields require your attention."):!0===Object.values(_e.valid).find((function(e){return!0===e}))?pe.profile_image_link!==K.profile_image_link?Y(pe,_e.feedbackText.profile_image_link,(function(e,a){a&&ne(!1)})):K.email!==pe.email?G(Object(c.a)(Object(c.a)({},pe),{},{change_email:1}),(function(e,a){a&&ne(!1)})):G(Object(c.a)({},pe),(function(e,a){a&&ne(!1)})):K&&pe.email&&K.email!==pe.email?$.includes("email")&&""===pe.email.trim()?je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:Ve.emailRequired})}})):""===pe.email.trim()||"+"!==pe.email.charAt(0)||L.test(pe.email)?""===pe.email.trim()||T.a.test(pe.email.trim())?V(pe.email,(function(e,a){a&&(a.data.status?je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:"Email is already taken"})}})):K.email!==pe.email?G(Object(c.a)(Object(c.a)({},pe),{},{change_email:1}),(function(e,a){a&&ne(!1)})):G(Object(c.a)({},pe),(function(e,a){a&&ne(!1)})))})):je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:Ve.invalidEmail})}})):Object(u.b)(pe.email)?V(pe.email,(function(e,a){a&&(a.data.status?je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:"Phone number already taken"})}})):K.email!==pe.email?G(Object(c.a)(Object(c.a)({},pe),{},{change_email:1}),(function(e,a){a&&ne(!1)})):G(Object(c.a)({},pe),(function(e,a){a&&ne(!1)})))})):je((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:Ve.invalidPhoneNumber})}})):K&&Re!==K.role.name?G(Object(c.a)({},pe),(function(e,a){a&&ne(!1)})):(S.info("Nothing was updated."),ne(!1))},className:"btn btn-primary"},Ve.saveChanges)))):o.a.createElement("div",{className:"card-body"},o.a.createElement("h6",{className:"card-title d-flex justify-content-between align-items-center"},Ve.information,J||Fe?o.a.createElement("span",{onClick:He,className:"btn btn-outline-light btn-sm"},o.a.createElement(_.u,{className:"mr-2",icon:"edit-2"})," ",Ve.edit):null),K.first_name&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.firstName),o.a.createElement("div",{className:"col col-form"},K.first_name)),K.middle_name&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.middleName),o.a.createElement("div",{className:"col col-form"},K.middle_name)),K.last_name&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.lastName),o.a.createElement("div",{className:"col col-form"},K.last_name)),K.id===U.id&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.password),o.a.createElement("div",{className:"col col-form"},"*****")),"external"===K.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.companyName),o.a.createElement("div",{className:"col col-form"},K.external_company_name&&K.external_company_name)),K.place&&"internal"===U.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.city),o.a.createElement("div",{className:"col col-form"},K.place)),K.address&&"internal"===U.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.address),o.a.createElement("div",{className:"col col-form"},K.address)),K.contact&&"internal"===U.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.phone),o.a.createElement("div",{className:"col col-form"},K.contact)),K.email&&"internal"===U.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.email),o.a.createElement("div",{className:"col col-form cursor-pointer",onClick:function(){window.location.href="mailto:".concat(K.email)}},K.email)),K.role&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.accountType),o.a.createElement("div",{className:"col col-form"},"external"===K.type?Ve.external:K.role.display_name)),"external"===K.type&&o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.lastLoggedIn),o.a.createElement("div",{className:"col col-form"},w.a.unix(null===K||void 0===K||null===(a=K.last_login)||void 0===a?void 0:a.timestamp).format("MMMM DD YYYY hh:mm A").toString())),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},Ve.invitedBy),o.a.createElement("div",{className:"col col-form"},null===K||void 0===K||null===(t=K.invited_by)||void 0===t?void 0:t.invitedBy))))))))}))}}]);