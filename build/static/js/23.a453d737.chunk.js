(this.webpackJsonpdriff=this.webpackJsonpdriff||[]).push([[23],{907:function(e,n,t){"use strict";t.r(n);var a=t(6),r=t(0),i=t.n(r),c=t(4),o=t(5),l=t(11),m=t(13),s=t(12),d=t(75);function u(){var e=Object(a.a)(["\n  margin-bottom: 2rem;\n  .date-edit {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n  .title {\n    font-weight: bold;\n    font-size: 1.1rem;\n  }\n  .feather-pencil {\n    cursor: pointer;\n    display: none;\n  }\n  .text-muted,\n  .description {\n    font-size: 0.8rem;\n  }\n  :hover {\n    .feather-pencil {\n      display: block;\n    }\n  }\n"]);return u=function(){return e},e}var f=o.b.div(u()),p=i.a.memo((function(e){var n=e.item,t=e.fromNow,a=e.openModal,r=e.isAuthorizedUser;return i.a.createElement(f,null,i.a.createElement("div",{className:"date-edit"},i.a.createElement("span",{className:"text-muted"},t(n.created_at.timestamp)," \xa0 ",(null===n||void 0===n?void 0:n.draft_type)&&i.a.createElement("div",{className:"badge badge-warning"},"draft")),r&&i.a.createElement(s.u,{icon:"pencil",height:12,width:12,onClick:function(){return a(n)}})),i.a.createElement("div",{className:"title"},n.action_text),i.a.createElement("p",{className:"description",dangerouslySetInnerHTML:{__html:d.a.parseEmoji(n.body)}}))}));function v(){var e=Object(a.a)(["\n  overflow: auto;\n  .empty-notification {\n    h4 {\n      margin: 2rem auto;\n      text-align: center;\n      color: ",";\n    }\n  }\n  .feather-edit {\n    cursor: pointer;\n  }\n"]);return v=function(){return e},e}var h=o.b.div(v(),(function(e){return e.theme.colors.primary}));n.default=i.a.memo((function(e){var n=Object(c.c)(),t=Object(l.db)().fromNow,a=Object(c.d)((function(e){return e.global.releases})).items,o=Object(c.d)((function(e){return e.session.user}));Object(r.useEffect)((function(){n(Object(m.v)())}),[]);var d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t={type:"release",item:e};n(Object(m.a)(t))},u=["anthea@makedevelopment.com","jessryll@makedevelopment.com","nilo@makedevelopment.com","sander@zuid.com","johnpaul@makedevelopment.com"].includes(o.email);return i.a.createElement(h,{className:"container-fluid h-100"},i.a.createElement("div",{className:"row row-user-profile-panel justify-content-center"},i.a.createElement("div",{className:"col-md-6"},i.a.createElement("div",{className:"card"},i.a.createElement("div",{className:"card-body"},i.a.createElement("h6",{className:"card-title d-flex justify-content-between align-items-center"},i.a.createElement("span",null,"Announcements"),u&&i.a.createElement(s.u,{icon:"edit",height:16,width:16,onClick:function(){return d(null)}})),i.a.createElement("div",null,a.length>0&&a.map((function(e){return i.a.createElement(p,{key:e.draft_id?e.draft_id:e.id,item:e,fromNow:t,openModal:d,isAuthorizedUser:u})}))))))))}))}}]);