(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[3,7,8],{716:function(e,a,t){"use strict";t.r(a);var n,l=t(12),c=t(1),r=t(5),i=t(2),s=t(0),o=t.n(s),m=t(6),d=t(39),u=t(706),p=t(700),b=t(702),f=t(699),E=t(701),v=t(238),O=t(3),g=t(14),N=t(13),h=t(7),k=t(73),j=t(242),w=t(9),y=t(22),C=O.a.div(n||(n=Object(i.a)(["\n  overflow: auto;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n\n  .row-user-profile-panel {\n    justify-content: center;\n\n    .avatar {\n      width: 68px;\n      height: 68px;\n    }\n\n    input.designation {\n      &::-webkit-input-placeholder {\n        font-size: 12px;\n      }\n      &:-ms-input-placeholder {\n        font-size: 12px;\n      }\n      &::placeholder {\n        font-size: 12px;\n      }\n    }\n\n    .col-label {\n      max-width: 130px;\n\n      @media only screen and (min-width: 1200px) {\n        max-width: 180px;\n      }\n    }\n  }\n\n  .close {\n    border-radius: 100%;\n    padding: 2px;\n  }\n\n  label {\n    padding: 5px 10px;\n    border-radius: 6px;\n    width: 100%;\n  }\n\n  .btn-toggle {\n    &:hover {\n      .input-group-text {\n        border: 1px solid #e1e1e1;\n        background: #fff;\n        color: #7a1b8b;\n      }\n    }\n    .input-group-text {\n      border: 1px solid #7a1b8b;\n      background: #7a1b8b;\n      color: #fff;\n    }\n    svg {\n      cursor: pointer;\n    }\n  }\n\n  .avatar-container {\n    cursor: pointer;\n    position: relative;\n    width: 68px;\n    height: 68px;\n    margin: 0 auto;\n\n    .btn {\n      position: absolute;\n      bottom: 0;\n      right: 0;\n      background-color: #fff;\n      border-radius: 50px 50px 50px 50px;\n      height: 25px;\n      width: 25px;\n      padding: 5px;\n    }\n  }\n\n  .form-group {\n    &.designation {\n      margin: 0 auto;\n      width: 66.66%;\n    }\n  }\n"])));a.default=o.a.memo((function(e){var a=e.className,t=void 0===a?"":a,n=Object(d.g)(),i=Object(m.useDispatch)(),O=Object(w.X)(),x=Object(w.fb)(),_=x.users,T=x.loggedUser,S=Object(w.db)(),P=S.checkEmail,I=S.fetchById,A=S.getReadOnlyFields,L=S.getRequiredFields,F=S.update,R=S.updateProfileImage,M=Object(w.eb)().selectUserChannel,D=_[e.match.params.id],U=D&&T.id===D.id,H=A(D?D.import_from:""),V=L(D?D.import_from:""),B=Object(s.useState)(!1),W=Object(r.a)(B,2),z=W[0],K=W[1],G=Object(s.useState)(!1),q=Object(r.a)(G,2),Z=q[0],Y=q[1],J=Object(s.useState)(!1),X=Object(r.a)(J,2),Q=X[0],$=X[1],ee=Object(s.useState)(!1),ae=Object(r.a)(ee,2),te=ae[0],ne=ae[1],le=Object(s.useState)(D&&D.loaded?D:{}),ce=Object(r.a)(le,2),re=ce[0],ie=ce[1],se=Object(s.useState)({valid:{},feedbackState:{},feedbackText:{}}),oe=Object(r.a)(se,2),me=oe[0],de=oe[1],ue={dropZoneRef:Object(s.useRef)(null),first_name:Object(s.useRef)(null),password:Object(s.useRef)(null)},pe=Object(w.cb)()._t,be={companyName:pe("PROFILE.COMPANY_NAME","Company name"),information:pe("PROFILE.INFORMATION","Information"),firstName:pe("PROFILE.FIRST_NAME","First name:"),middleName:pe("PROFILE.MIDDLE_NAME","Middle name:"),lastName:pe("PROFILE.LAST_NAME","Last name:"),password:pe("PROFILE.PASSWORD","Password:"),position:pe("PROFILE.POSITION","Position:"),city:pe("PROFILE.CITY","City:"),address:pe("PROFILE.ADDRESS","Address:"),zip_code:pe("PROFILE.ZIP_POST_CODE","ZIP/POST code:"),phone:pe("PROFILE.Phone","Phone:"),email:pe("PROFILE.EMAIL","Email:"),edit:pe("BUTTON.EDIT","Edit"),saveChanges:pe("BUTTON.SAVE_CHANGES","Save changes"),cancel:pe("BUTTON.Cancel","Cancel"),clickToChangePassword:pe("PROFILE.CLICK_TO_CHANGE_PASSWORD","Click to change your password"),external:pe("PROFILE.EXTERNAL","External")},fe=T&&"internal"===T.type&&D&&"external"===D.type&&1===D.active,Ee=Object(s.useCallback)((function(e){if("boolean"===typeof e)return e?"is-valid":"is-invalid"}),[]),ve=Object(s.useCallback)((function(){$((function(e){return!e}))}),[$]),Oe=Object(s.useCallback)((function(){Y((function(e){return!e}))}),[Y]),ge=Object(s.useCallback)((function(){K((function(e){return!e})),ie(Object(c.a)({},D)),de({valid:{},feedbackState:{},feedbackText:{}}),$(!1)}),[D,ie,$,K]),Ne=Object(s.useCallback)((function(e){if(null!==e.target){var a=e.target,t=a.name,n=a.value;ie((function(e){return Object(c.a)(Object(c.a)({},e),{},Object(l.a)({},t,n.trim()))}))}}),[]),he=Object(s.useCallback)((function(e){if(null!==e.target){var a=e.target,t=a.name,n=a.value;if(D[t]===re[t])return void de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(l.a)({},t,void 0)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(l.a)({},t,void 0)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(l.a)({},t,void 0))}}));"email"===t?V.includes(t)&&""===n.trim()?de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(l.a)({},t,!1)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(l.a)({},t,!1)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(l.a)({},t,"Email is required"))}})):""===n.trim()||g.a.test(n.trim())?P(re.email,(function(e,a){a&&(a.data.status?de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(l.a)({},t,!1)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(l.a)({},t,!1)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(l.a)({},t,"Email is already taken"))}})):de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(l.a)({},t,!0)),feedbackState:Object(c.a)({},e.feedbackState),feedbackText:Object(c.a)({},e.feedbackText)}})))})):de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(l.a)({},t,!1)),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(l.a)({},t,!1)),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(l.a)({},t,"Invalid email format"))}})):V.includes(t)?de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(l.a)({},t,""!==n.trim())),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},Object(l.a)({},t,""!==n.trim())),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},Object(l.a)({},t,""===n.trim()?"Field is required.":""))}})):de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},Object(l.a)({},t,!0)),feedbackState:e.feedbackState,feedbackText:e.feedbackText}}))}}),[D,re,V]),ke=Object(s.useCallback)((function(){!1===Object.values(me.valid).find((function(e){return!1===e}))?O.error("Some fields require your attention."):!0===Object.values(me.valid).find((function(e){return!0===e}))?re.profile_image_link!==D.profile_image_link?R(re,me.feedbackText.profile_image_link,(function(e,a){a&&K(!1)})):fe?D.email!==re.email?F(Object(c.a)(Object(c.a)({},re),{},{change_email:1}),(function(e,a){a&&K(!1)})):F(Object(c.a)({},re),(function(e,a){a&&K(!1)})):F(re,(function(e,a){a&&K(!1)})):(D&&re.email&&D.email!==re.email?V.includes("email")&&""===re.email.trim()?de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:"Email is required"})}})):""===re.email.trim()||g.a.test(re.email.trim())?P(re.email,(function(e,a){a&&(a.data.status?de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:"Email is already taken"})}})):fe?D.email!==re.email?F(Object(c.a)(Object(c.a)({},re),{},{change_email:1}),(function(e,a){a&&K(!1)})):F(Object(c.a)({},re),(function(e,a){a&&K(!1)})):F(re,(function(e,a){a&&K(!1)})))})):de((function(e){return{valid:Object(c.a)(Object(c.a)({},e.valid),{},{email:!1}),feedbackState:Object(c.a)(Object(c.a)({},e.feedbackState),{},{email:!1}),feedbackText:Object(c.a)(Object(c.a)({},e.feedbackText),{},{email:"Invalid email format"})}})):O.info("Nothing was updated."),K(!1))}),[re,me,F,K,D,fe]),je=Object(s.useCallback)((function(){te||ne(!0)}),[te,ne]),we=Object(s.useCallback)((function(){ne(!1)}),[ne]),ye=Object(s.useCallback)((function(e,a){ie((function(e){return Object(c.a)(Object(c.a)({},e),{},{profile_image_link:a})})),de((function(a){return{valid:Object(c.a)(Object(c.a)({},a.valid),{},{profile_image_link:!0}),feedbackState:Object(c.a)({},a.feedbackState),feedbackText:Object(c.a)(Object(c.a)({},a.feedbackText),{},{profile_image_link:e})}})),K(!0),O.info(o.a.createElement(o.a.Fragment,null,"Click the ",o.a.createElement("b",null,"Save Changes")," button to update your profile image."))}),[]),Ce=Object(s.useCallback)((function(e){0===e.length?O.error("File type not allowed. Please use an image file."):e.length>1&&O.warning("Multiple files detected. First selected image will be used.");var a={type:"file_crop_upload",imageFile:e[0],mode:"profile",handleSubmit:ye};i(Object(N.a)(a,(function(){we()})))}),[ye,we]),xe=Object(s.useCallback)((function(){window.location.href="mailto:".concat(D.email)}),[D]);return Object(s.useEffect)((function(){(!e.match.params.hasOwnProperty("id")||e.match.params.hasOwnProperty("id")&&!e.match.params.hasOwnProperty("name")&&parseInt(e.match.params.id)===T.id)&&n.push("/profile/".concat(T.id,"/").concat(Object(g.h)(T.name)))}),[]),Object(s.useEffect)((function(){var a=_[e.match.params.id]?_[e.match.params.id]:{};a.hasOwnProperty("loaded")?re.id!==a.id&&ie(a):I(e.match.params.id)}),[e.match.params.id,_,ie]),Object(s.useEffect)((function(){"edit"===e.match.params.mode&&re.id&&T.id===re.id&&(n.push("/profile/".concat(re.id,"/").concat(Object(g.h)(re.name))),K(!0)),"view"===e.match.params.mode&&re.id&&T.id===re.id&&(n.push("/profile/".concat(re.id,"/").concat(Object(g.h)(re.name))),K(!1))}),[re,e.match.params.mode]),Object(s.useEffect)((function(){Q&&ue.password.current&&ue.password.current.focus()}),[Q,ue.password]),Object(s.useEffect)((function(){z&&ue.first_name.current&&ue.first_name.current.focus()}),[z,ue.first_name]),re.id?o.a.createElement(C,{className:"user-profile-panel container-fluid h-100 ".concat(t)},o.a.createElement("div",{className:"row row-user-profile-panel"},o.a.createElement("div",{className:"col-12 col-lg-5 col-xl-6"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body text-center",onDragOver:je},(U||fe)&&o.a.createElement(k.a,{acceptType:"imageOnly",hide:!te,ref:ue.dropZoneRef,onDragLeave:we,onDrop:function(e){var a=e.acceptedFiles;Ce(a)},onCancel:we}),o.a.createElement("div",{className:"avatar-container"},o.a.createElement(h.a,{imageLink:re.profile_image_link,name:re.name?re.name:re.email,noDefaultClick:!0,forceThumbnail:!1}),(U||fe)&&o.a.createElement("span",{className:"btn btn-outline-light btn-sm"},o.a.createElement(h.t,{icon:"pencil",onClick:function(){z||K(!0),ue.dropZoneRef.current.open()}}))),z?o.a.createElement("h5",{className:"mb-1 mt-2"},re.first_name," ",re.middle_name," ",re.last_name):o.a.createElement("h5",{className:"mb-1 mt-2"},D.first_name," ",D.middle_name," ",D.last_name),z&&!H.includes("designation")?o.a.createElement("div",{className:"text-muted small d-flex align-items-center mt-2"},o.a.createElement(y.e,{placeholder:"Job Title eg. Manager, Team Leader, Designer",className:"designation",name:"designation",onChange:Ne,onBlur:he,defaultValue:D.designation,isValid:me.feedbackState.designation,valid:me.feedbackText.designation})):o.a.createElement("p",{className:"text-muted small"},D.designation),T.id!==D.id&&o.a.createElement("div",{className:"d-flex justify-content-center"},""!==D.contact&&"internal"===T.type&&o.a.createElement("button",{className:"btn btn-outline-light mr-1"},o.a.createElement("a",{href:"tel:".concat(D.contact.replace(/ /g,"").replace(/-/g,""))},o.a.createElement(h.t,{className:"",icon:"phone"}))),"external"!==D.type&&"internal"===T.type&&o.a.createElement("button",{className:"ml-1 btn btn-outline-light"},o.a.createElement(h.t,{onClick:function(){!function(e){M(e)}(D)},icon:"message-circle"}))))),o.a.createElement("div",{className:"card"},z?o.a.createElement("div",{className:"card-body"},o.a.createElement("h6",{className:"card-title d-flex justify-content-between align-items-center"},be.information),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.firstName),o.a.createElement("div",{className:"col col-form"},H.includes("first_name")?o.a.createElement(u.a,null,D.first_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(p.a,{className:Ee(me.valid.first_name),innerRef:ue.first_name,name:"first_name",onChange:Ne,onBlur:he,defaultValue:D.first_name}),o.a.createElement(j.a,{valid:me.feedbackState.first_name},me.feedbackText.first_name)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.middleName),o.a.createElement("div",{className:"col col-form"},H.includes("middle_name")?o.a.createElement(u.a,null,D.middle_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(p.a,{className:Ee(me.valid.middle_name),name:"middle_name",onChange:Ne,onBlur:he,defaultValue:D.middle_name}),o.a.createElement(j.a,{valid:me.feedbackState.middle_name},me.feedbackText.middle_name)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.lastName),o.a.createElement("div",{className:"col col-form"},H.includes("last_name")?o.a.createElement(u.a,null,D.last_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(p.a,{className:Ee(me.valid.last_name),name:"last_name",onChange:Ne,onBlur:he,defaultValue:D.last_name}),o.a.createElement(j.a,{valid:me.feedbackState.last_name},me.feedbackText.last_name)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.password),o.a.createElement("div",{className:"col col-form"},H.includes("password")||fe?o.a.createElement(u.a,null,"*****"):o.a.createElement(o.a.Fragment,null,o.a.createElement(u.a,{onClick:ve,className:"cursor-pointer mb-0 ".concat(Q?"d-none":"")},be.clickToChangePassword),o.a.createElement(b.a,{className:"form-group-password mb-0 ".concat(Q?"":"d-none")},o.a.createElement(f.a,null,o.a.createElement(p.a,{className:Ee(me.valid.password),innerRef:ue.password,name:"password",onChange:Ne,onBlur:he,defaultValue:"",type:Z?"text":"password"}),o.a.createElement(E.a,{className:"btn-toggle",addonType:"append"},o.a.createElement(v.a,{className:"btn",onClick:Oe},o.a.createElement(h.t,{icon:Z?"eye-off":"eye"})))),o.a.createElement(j.a,{valid:me.feedbackState.password},me.feedbackText.password))))),"external"===D.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.companyName),o.a.createElement("div",{className:"col col-form"},H.includes("company_name")?o.a.createElement(u.a,null,D.external_company_name&&D.external_company_name):o.a.createElement(o.a.Fragment,null,o.a.createElement(p.a,{className:Ee(!0),name:"company_name",disabled:fe||!U,onChange:Ne,onBlur:he,defaultValue:D.external_company_name?D.external_company_name:""})))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.city),o.a.createElement("div",{className:"col col-form"},H.includes("place")?o.a.createElement(u.a,null,D.place):o.a.createElement(o.a.Fragment,null,o.a.createElement(p.a,{className:Ee(me.valid.place),name:"place",disabled:fe||!U,onChange:Ne,onBlur:he,defaultValue:D.place}),o.a.createElement(j.a,{valid:me.feedbackState.place},me.feedbackText.place)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.address),o.a.createElement("div",{className:"col col-form"},H.includes("address")?o.a.createElement(u.a,null,D.address):o.a.createElement(o.a.Fragment,null,o.a.createElement(y.e,{name:"address",disabled:fe||!U,onChange:Ne,onBlur:he,defaultValue:D.address,isValid:me.feedbackState.address,feedback:me.feedbackText.address})))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.phone),o.a.createElement("div",{className:"col col-form"},H.includes("contact")?o.a.createElement(u.a,null,D.contact):o.a.createElement(o.a.Fragment,null,o.a.createElement(p.a,{className:Ee(me.valid.contact),name:"contact",disabled:fe||!U,onChange:Ne,onBlur:he,defaultValue:D.contact}),o.a.createElement(j.a,{valid:me.feedbackState.contact},me.feedbackText.contact)))),o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.email),o.a.createElement("div",{className:"col col-form"},H.includes("email")?o.a.createElement(u.a,null,D.email):o.a.createElement(o.a.Fragment,null,o.a.createElement(p.a,{type:"email",className:Ee(me.valid.email),name:"email",onChange:Ne,onBlur:he,defaultValue:D.email}),o.a.createElement(j.a,{valid:me.feedbackState.email},me.feedbackText.email)))),o.a.createElement("hr",null),o.a.createElement("div",{className:"d-flex justify-content-between align-items-center mt-0"},o.a.createElement("div",null,"\xa0"),o.a.createElement("div",null,o.a.createElement("span",{onClick:ge,className:"btn btn-outline-light mr-2"},be.cancel),o.a.createElement("span",{onClick:ke,className:"btn btn-primary"},be.saveChanges)))):o.a.createElement("div",{className:"card-body"},o.a.createElement("h6",{className:"card-title d-flex justify-content-between align-items-center"},be.information,U||fe?o.a.createElement("span",{onClick:ge,className:"btn btn-outline-light btn-sm"},o.a.createElement(h.t,{className:"mr-2",icon:"edit-2"})," ",be.edit):null),D.first_name&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.firstName),o.a.createElement("div",{className:"col col-form"},D.first_name)),D.middle_name&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.middleName),o.a.createElement("div",{className:"col col-form"},D.middle_name)),D.last_name&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.lastName),o.a.createElement("div",{className:"col col-form"},D.last_name)),D.id===T.id&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.password),o.a.createElement("div",{className:"col col-form"},"*****")),"external"===D.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.companyName),o.a.createElement("div",{className:"col col-form"},D.external_company_name&&D.external_company_name)),D.role&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.position),o.a.createElement("div",{className:"col col-form"},"external"===D.type?be.external:D.role.name)),D.place&&"internal"===T.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.city),o.a.createElement("div",{className:"col col-form"},D.place)),D.address&&"internal"===T.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.address),o.a.createElement("div",{className:"col col-form"},D.address)),D.contact&&"internal"===T.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.phone),o.a.createElement("div",{className:"col col-form"},D.contact)),D.email&&"internal"===T.type&&o.a.createElement("div",{className:"row mb-2"},o.a.createElement("div",{className:"col col-label text-muted"},be.email),o.a.createElement("div",{className:"col col-form cursor-pointer",onClick:xe},D.email))))))):o.a.createElement(o.a.Fragment,null)}))},717:function(e,a,t){"use strict";t.r(a);var n,l=t(5),c=t(2),r=t(0),i=t.n(r),s=t(3),o=t(7),m=t(9),d=s.a.div(n||(n=Object(c.a)(["\n  .btn-cross {\n    position: absolute;\n    top: 0;\n    right: 45px;\n    border: 0;\n    background: transparent;\n    padding: 0;\n    height: 100%;\n    width: 36px;\n    border-radius: 4px;\n    z-index: 9;\n    svg {\n      width: 16px;\n      color: #495057;\n    }\n  }\n"]))),u=function(e){var a=e.actions,t=e.clearTab,n=e.value,c=Object(r.useState)(n),s=Object(l.a)(c,2),u=s[0],p=s[1],b=function(){""!==u.trim()&&(t(),a.search({search:u,skip:0,limit:10}),a.saveSearchValue({value:u}))};Object(r.useEffect)((function(){p(n)}),[n]);var f={searchGlobalPlaceholder:(0,Object(m.cb)()._t)("PLACEHOLDER.SEARCH_GLOBAL","Search for anything in this Driff")};return i.a.createElement(d,{className:"card p-t-b-40","data-backround-image":"assets/media/image/image1.jpg"},i.a.createElement("div",{className:"container"},i.a.createElement("div",{className:"row d-flex justify-content-center"},i.a.createElement("div",null,i.a.createElement("h2",{className:"mb-4 text-center"},"What do you want to find?"),i.a.createElement("div",{className:"input-group"},i.a.createElement("input",{onChange:function(e){""===e.target.value.trim()&&""!==n&&(t(),a.saveSearchValue({value:""})),p(e.target.value)},onKeyDown:function(e){"Enter"===e.key&&b()},type:"text",className:"form-control",placeholder:f.searchGlobalPlaceholder,"aria-describedby":"button-addon1",autoFocus:!0,value:u}),""!==u.trim()&&i.a.createElement("button",{onClick:function(){p(""),t(),a.search({search:"",skip:0,limit:10}),a.saveSearchValue({value:""})},className:"btn-cross",type:"button"},i.a.createElement(o.t,{icon:"x"})),i.a.createElement("div",{className:"input-group-append"},i.a.createElement("button",{className:"btn btn-outline-light",type:"button",onClick:b},i.a.createElement(o.t,{icon:"search"}))))))))},p=function(e){var a=e.activeTab,t=e.onSelectTab,n=e.tabs;return i.a.createElement("ul",{className:"nav nav-pills mb-4",role:"tablist"},n.hasOwnProperty("CHANNEL")&&Object.keys(n.CHANNEL).length>0&&i.a.createElement("li",{className:"nav-item"},i.a.createElement("a",{className:"nav-link ".concat(("channel"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"channel",role:"tab","aria-controls":"clasic","aria-selected":"true"},"Chat channel")),n.hasOwnProperty("CHAT")&&Object.keys(n.CHAT).length>0&&i.a.createElement("li",{className:"nav-item"},i.a.createElement("a",{className:"nav-link ".concat(("chat"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"chat",role:"tab","aria-controls":"clasic","aria-selected":"true"},"Message")),n.hasOwnProperty("COMMENT")&&Object.keys(n.COMMENT).length>0&&i.a.createElement("li",{className:"nav-item"},i.a.createElement("a",{className:"nav-link ".concat(("comment"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"comment",role:"tab","aria-controls":"clasic","aria-selected":"true"},"Comment")),n.hasOwnProperty("DOCUMENT")&&Object.keys(n.DOCUMENT).length>0&&i.a.createElement("li",{className:"nav-item"},i.a.createElement("a",{className:"nav-link ".concat(("document"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"document",role:"tab","aria-controls":"articles","aria-selected":"false"},"Files")),n.hasOwnProperty("PEOPLE")&&Object.keys(n.PEOPLE).length>0&&i.a.createElement("li",{className:"nav-item"},i.a.createElement("a",{className:"nav-link ".concat(("people"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"people",role:"tab","aria-controls":"users","aria-selected":"false"},"People")),n.hasOwnProperty("POST")&&Object.keys(n.POST).length>0&&i.a.createElement("li",{className:"nav-item"},i.a.createElement("a",{className:"nav-link ".concat(("post"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"post",role:"tab","aria-controls":"photos","aria-selected":"false"},"Posts")),n.hasOwnProperty("WORKSPACE")&&Object.keys(n.WORKSPACE).length>0&&i.a.createElement("li",{className:"nav-item"},i.a.createElement("a",{className:"nav-link ".concat(("workspace"===a||null===a)&&"active"),onClick:t,"data-toggle":"tab","data-value":"workspace",role:"tab","aria-controls":"photos","aria-selected":"false"},"Workspace")))},b=function(e){var a=e.activeTab,t=e.tabs,n=e.redirect;return i.a.createElement("div",{className:"tab-content search-results",id:"myTabContent"},i.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"channel"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("CHANNEL")&&i.a.createElement(f,{channels:t.CHANNEL.items,page:t.CHANNEL.page,redirect:n})),i.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"chat"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("CHAT")&&i.a.createElement(v,{chats:t.CHAT.items,page:t.CHAT.page,redirect:n})),i.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"comment"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("COMMENT")&&i.a.createElement(h,{comments:t.COMMENT.items,page:t.COMMENT.page,redirect:n})),i.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"document"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("DOCUMENT")&&i.a.createElement(T,{files:t.DOCUMENT.items,page:t.DOCUMENT.page,redirect:n})),i.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"people"===a)&&"active show"),id:"users",role:"tabpanel"},t.hasOwnProperty("PEOPLE")&&i.a.createElement(_,{people:t.PEOPLE.items,page:t.PEOPLE.page,redirect:n})),i.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"post"===a)&&"active show"),id:"photos",role:"tabpanel"},t.hasOwnProperty("POST")&&i.a.createElement(P,{posts:t.POST.items,page:t.POST.page,redirect:n})),i.a.createElement("div",{className:"tab-pane fade ".concat((null===a||"workspace"===a)&&"active show"),role:"tabpanel"},t.hasOwnProperty("WORKSPACE")&&i.a.createElement(D,{workspaces:t.WORKSPACE.items,page:t.WORKSPACE.page,redirect:n})))},f=function(e){var a=e.channels,t=e.page,n=e.redirect;return i.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return e.data?i.a.createElement(E,{key:e.id,data:e.data,redirect:n}):null})))},E=function(e){var a=e.data,t=e.redirect,n=a.channel;return i.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},i.a.createElement("h5",{onClick:function(){t.toChannel(n)}},n.title))},v=function(e){var a=e.chats,t=e.page,n=e.redirect;return i.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).filter((function(e){return e.data&&null!==e.data.message})).map((function(e){return i.a.createElement(N,{key:e.id,data:e.data,redirect:n})})))};function O(){var e=Object(c.a)(["\n  display: flex;\n  width: 100%;\n  p {\n    margin: 0;\n  }\n"]);return O=function(){return e},e}var g=s.a.li(O()),N=function(e){var a=e.data,t=e.redirect,n=a.channel,l=a.message;return i.a.createElement(g,{className:"list-group-item p-l-0 p-r-0"},i.a.createElement("div",null,i.a.createElement(o.a,{id:l.user.id,name:l.user.name,imageLink:l.user.profile_image_thumbnail_link?l.user.profile_image_thumbnail_link:l.user.profile_image_link,showSlider:!0})),i.a.createElement("div",{className:"ml-2",onClick:function(){t.toChat(n,l)}},i.a.createElement("p",null,l.user.name," - ",n.title),i.a.createElement("p",{className:"text-muted",dangerouslySetInnerHTML:{__html:l.body}})))},h=function(e){var a=e.comments,t=e.page,n=e.redirect;return i.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return i.a.createElement(C,{key:e.id,comment:e,redirect:n})})))};function k(){var e=Object(c.a)(["\n  img {\n    max-height: 200px;\n    padding: 20px;\n    margin-top: 20px;\n    float: right;\n  }\n  p {\n    display: none;\n    &:nth-child(1),\n    &:nth-child(2),\n    &:nth-child(3),\n    &:nth-child(4),\n    &:nth-child(5) {\n      display: block;\n    }\n  }\n"]);return k=function(){return e},e}function j(){var e=Object(c.a)(["\n  display: flex;\n  width: 100%;\n  p {\n    margin: 0;\n  }\n"]);return j=function(){return e},e}var w=s.a.li(j()),y=s.a.div(k()),C=function(e){var a=e.comment,t=e.redirect,n=a.data;return i.a.createElement(w,{className:"list-group-item p-l-0 p-r-0",onClick:function(){if(null!==n)if(n.workspaces.length){var e={id:n.workspaces[0].topic.id,name:n.workspaces[0].topic.name,folder_id:n.workspaces[0].workspace?n.workspaces[0].workspace.id:null,folder_name:n.workspaces[0].workspace?n.workspaces[0].workspace.name:null};t.toPost({workspace:e,post:n.post},{focusOnMessage:n.comment.id})}else t.toPost({workspace:null,post:n.post},{focusOnMessage:n.comment.id})}},null!==n&&i.a.createElement(i.a.Fragment,null,i.a.createElement("div",null,i.a.createElement(o.a,{id:n.comment.author.id,name:n.comment.author.name,imageLink:(n.comment.author.profile_image_link,n.comment.author.profile_image_thumbnail_link),showSlider:!0})),i.a.createElement("div",{className:"ml-2"},i.a.createElement("p",null,n.comment.author.name),i.a.createElement(y,{className:"text-muted",dangerouslySetInnerHTML:{__html:n.comment.body}}))),null===n&&i.a.createElement("div",null,i.a.createElement("p",{className:"text-muted",dangerouslySetInnerHTML:{__html:a.search_body}})))},x=function(e){var a=e.user,t=e.redirect;return i.a.createElement("li",{className:"list-group-item p-l-r-0"},i.a.createElement("div",{className:"media",onClick:function(){t.toPeople(a)}},i.a.createElement(o.a,{id:a.id,name:a.name,imageLink:a.profile_image_thumbnail_link?a.profile_image_thumbnail_link:a.profile_image_link,className:"mr-2"}),i.a.createElement("div",{className:"media-body"},i.a.createElement("h6",{className:"m-0"},a.name))))},_=function(e){var a=e.page,t=e.people,n=e.redirect;return i.a.createElement("ul",{className:"list-group list-group-flush"},Object.keys(t).length>0&&Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return i.a.createElement(x,{key:e.id,user:e.data,redirect:n})})))},T=function(e){var a=e.files,t=e.page,n=e.redirect;return i.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(a).slice(t>1?10*t-10:0,10*t).map((function(e){return i.a.createElement(S,{key:e.data.id,file:e.data,redirect:n})})))},S=function(e){var a=e.file,t=e.redirect;return i.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},i.a.createElement("label",{onClick:function(){t.toFiles(a)}},a.name))},P=function(e){var a=e.page,t=e.posts,n=e.redirect;return i.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return i.a.createElement(I,{key:e.id,data:e.data,redirect:n})})))},I=function(e){var a=e.data,t=e.redirect,n=a.post,l=a.workspaces,c=Object(m.W)().localizeChatDate;return i.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},i.a.createElement("div",{onClick:function(){var e=null;l.length&&(e={id:l[0].topic.id,name:l[0].topic.name,folder_id:l[0].workspace?l[0].workspace.id:null,folder_name:l[0].workspace?l[0].workspace.name:null}),t.toPost({post:n,workspace:e})}},i.a.createElement("h5",null,n.title),i.a.createElement("div",{className:"text-muted font-size-13"},i.a.createElement("div",null,c(n.created_at.timestamp)))))},A=t(1),L=t(186),F=t.n(L),R=function(e){var a=e.actions,t=e.activeTab,n=e.tabs,c=e.value,s=Object(r.useState)(!1),o=Object(l.a)(s,2),m=o[0],d=o[1],u=function(e,n){var l=t;"workspace"===t?l="topic":"people"===t&&(l="user"),d(!0),a.search({search:c,skip:e,limit:n,tag:l},(function(e,a){d(!1)}))};if(Object(r.useEffect)((function(){if(t&&!m){var e=n[t.toUpperCase()].page,a=n[t.toUpperCase()].count;(1===e&&a<10&&n[t.toUpperCase()].total_count>10||1===e&&0===a)&&u(a,10)}}),[n,t,m]),t&&n[t.toUpperCase()].maxPage<=1||null===t)return null;var p=n[t.toUpperCase()].page,b=n[t.toUpperCase()].maxPage;return i.a.createElement("nav",{className:"mt-3"},i.a.createElement(F.a,{forcePage:p-1,previousLabel:"previous",nextLabel:"next",breakLabel:"...",breakClassName:"break-me page-item",breakLinkClassName:"page-link",pageCount:b,marginPagesDisplayed:2,pageRangeDisplayed:5,onPageChange:function(e){var l=e.selected+1,c=n[t.toUpperCase()].items.slice(l>1?10*l-10:0,10*l),r=n[t.toUpperCase()].count;10!==c.length&&u(r,10*l);var i=Object(A.a)(Object(A.a)({},n[t.toUpperCase()]),{},{page:l,key:t.toUpperCase()});a.updateTabPage(i)},containerClassName:"pagination justify-content-center",subContainerClassName:"pages pagination",activeClassName:"active",pageClassName:"page-item",pageLinkClassName:"page-link",previousClassName:"page-item",previousLinkClassName:"page-link",nextClassName:"page-item",nextLinkClassName:"page-link"}))},M=t(6),D=function(e){var a=e.page,t=e.workspaces,n=e.redirect,l=Object(M.useSelector)((function(e){return e.workspaces.workspaces}));return i.a.createElement("ul",{className:"list-group list-group-flush"},Object.values(t).slice(a>1?10*a-10:0,10*a).map((function(e){return i.a.createElement(U,{key:e.id,data:e.data,redirect:n,workspaces:l})})))},U=function(e){var a=e.data,t=e.redirect,n=e.workspaces,l=a.topic,c=a.workspace;return i.a.createElement("li",{className:"list-group-item p-l-0 p-r-0"},i.a.createElement("h5",{onClick:function(){var e={id:l.id,name:l.name,folder_id:c?c.id:null,folder_name:c?c.name:null};n.hasOwnProperty(l.id)?t.toWorkspace(e):t.fetchWorkspaceAndRedirect(e)}},l.name))};function H(){var e=Object(c.a)(["\n  .empty-notification {\n    h4 {\n      margin: 2rem auto;\n      text-align: center;\n      color: #972c86;\n    }\n  }\n"]);return H=function(){return e},e}var V=s.a.div(H());a.default=i.a.memo((function(e){var a=e.className,t=void 0===a?"":a,n=Object(m.N)(),c=Object(m.Q)(),s=Object(m.P)(),d=s.count,f=s.results,E=s.searching,v=s.tabs,O=s.value,g=Object(r.useState)(null),N=Object(l.a)(g,2),h=N[0],k=N[1];Object(r.useEffect)((function(){return document.getElementById("main").setAttribute("style","overflow: auto"),function(){return document.getElementById("main").removeAttribute("style")}}),[]),Object(r.useEffect)((function(){if(Object.keys(v).length&&null===h){var e=Object.keys(v)[0];k(e.toLowerCase())}else 0===Object.keys(v).length&&null!==h&&k(null)}),[v,h]);return i.a.createElement(V,{className:"user-search-panel container-fluid h-100 ".concat(t)},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-12"},i.a.createElement("div",{className:"card"},i.a.createElement("div",{className:"card-body"},i.a.createElement(u,{actions:c,value:O,clearTab:function(){return k(null)}}),""!==O&&i.a.createElement("h4",{className:"mb-5"},i.a.createElement(o.t,{icon:"search"}),E&&i.a.createElement("span",null,"Searching ",i.a.createElement("span",{className:"text-primary"},"\u201c",O,"\u201d")),!E&&i.a.createElement("span",null,d," results found for: ",i.a.createElement("span",{className:"text-primary"},"\u201c",O,"\u201d"))),i.a.createElement(p,{activeTab:h,onSelectTab:function(e){e.currentTarget.dataset.value!==h&&k(e.currentTarget.dataset.value)},tabs:v}),i.a.createElement(b,{activeTab:h,results:f,tabs:v,redirect:n}),d>0&&i.a.createElement(R,{activeTab:h,tabs:v,actions:c,value:O}))))))}))},722:function(e,a,t){"use strict";t.r(a);var n,l,c=t(2),r=t(0),i=t.n(r),s=t(39),o=t(6),m=t(3),d=t(9),u=t(341),p=t(7),b=(t(716),t(717),m.a.div(n||(n=Object(c.a)(["\n  font-family: Inter;\n  letter-spacing: 0;\n  text-align: center;\n  font-size: 12px;\n  p {\n    padding: 0 !important;\n    margin: 0 !important;\n    color: #8b8b8b;\n    text-align: center;\n    line-height: 15px;\n  }\n  span {\n    text-align: center;\n    cursor: pointer;\n  }\n\n  .app-sidebar-menu {\n    padding: 2em 1em;\n    text-align: center;\n  }\n  .app-sidebar-menu p {\n    padding: 0 !important;\n    margin: 0 !important;\n    color: #8b8b8b;\n    line-height: 15px;\n  }\n  .app-sidebar-menu p:last-child {\n    padding-bottom: 1em !important;\n  }\n  .app-sidebar-menu span {\n    text-decoration: underline !important;\n    margin-top: 1em;\n    display: block;\n    cursor: pointer;\n  }\n  .app-sidebar-menu p:nth-of-type(2) {\n    font-weight: bold;\n    color: ",";\n  }\n"])),(function(e){return"1"===e.darkMode?"#afb8bd":"#000000"}))),f=i.a.memo((function(e){var a=e.className,t=void 0===a?"":a,n=e.dictionary,l=e.user,c=e.unreadNotifications,r=e.darkMode,o=Object(s.g)(),m=Object(d.D)();return i.a.createElement(b,{className:"bottom-modal-mobile ".concat(t),darkMode:r},i.a.createElement("div",{className:"card"},i.a.createElement("div",{className:"app-sidebar-menu",tabIndex:"1"},i.a.createElement("p",null,"\ud83d\udcec"),i.a.createElement("p",null,n.howdy," ",l.first_name),i.a.createElement("p",null,n.notificationCount1," ",c," ",n.notificationCount2),i.a.createElement("span",{onClick:function(e){e.preventDefault(),m.readAll({})}},n.markAllAsRead))),i.a.createElement("p",null,n.improve),i.a.createElement("span",{onClick:function(){o.push("/settings")},style:{color:"#5B1269"}},n.viewSettings))})),E=m.a.div(l||(l=Object(c.a)(["\n  .empty-notification {\n    h4 {\n      margin: 2rem auto;\n      text-align: center;\n      color: #972c86;\n    }\n  }\n  overflow: auto;\n"])));a.default=i.a.memo((function(e){var a=e.className,t=void 0===a?"":a,n=Object(o.useSelector)((function(e){return e.session.user})),l=Object(s.g)(),c=Object(d.D)(),r=Object(d.E)(),m=r.notifications,b=r.unreadNotifications,v=Object(d.cb)()._t,O=Object(d.N)(),g=Object(d.S)().generalSettings.dark_mode,N={new:v("NOTIFICATION.NEW","New"),markAllAsRead:v("NOTIFICATION.MARK_ALL_AS_READ","Mark all as read"),oldNotifications:v("NOTIFICATION.OLD_NOTIFICATIONS","Old notifications"),noNotificationsToShow:v("NOTIFICATION.NO_NOTIFICATIONS_TO_SHOW","There are no notifications to show."),howdy:v("NOTIFICATION.howdy","Here you go, "),notificationCount1:v("NOTIFICATION.noficicationCount1","You have"),notificationCount2:v("NOTIFICATION.noficicationCount2","new notifications."),viewSettings:v("NOTIFICATION.VIEW_SETTINGS","View Settings"),improve:v("NOTIFICATION.IMPROVE_NOTIFICATIONS","Improve your notifications"),mustRead:v("NOTIFICATION.MUST_READ","Must read"),needsReply:v("NOTIFICATION.NEEDS_REPLY","Needs reply")},h=Object.values(m).sort((function(e,a){return a.created_at.timestamp-e.created_at.timestamp}));return i.a.createElement(E,{className:"user-profile-panel container-fluid h-100 ".concat(t)},i.a.createElement("div",{className:"row row-user-profile-panel"},i.a.createElement(f,{className:"col-md-3",dictionary:N,user:n,unreadNotifications:b,darkMode:g}),i.a.createElement("div",{className:"col-md-6"},h.length>0&&i.a.createElement("div",{className:"card app-content-body mb-4 "},i.a.createElement("div",{className:"card-body ",style:{padding:"0px"}},i.a.createElement("div",{className:"timeline"},h.map((function(e){return i.a.createElement(u.c,{key:e.id,notification:e,actions:c,history:l,redirect:O,user:n,_t:v,darkMode:g})}))))),!h.length&&i.a.createElement("div",{className:"card empty-notification"},i.a.createElement("h4",null,N.noNotificationsToShow),i.a.createElement("div",{className:"card-body d-flex justify-content-center align-items-center"},i.a.createElement(p.r,{icon:1,height:330}))))))}))}}]);