(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-17155aac"],{"0c97":function(t,a,e){},"461b":function(t,a,e){t.exports=e.p+"img/tree-3-green.01cc4b73.png"},"4bd4":function(t,a,e){"use strict";var n=e("5530"),i=(e("caad"),e("2532"),e("07ac"),e("4de4"),e("159b"),e("7db0"),e("58df")),s=e("7e2b"),r=e("3206");a["a"]=Object(i["a"])(s["a"],Object(r["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var a=Object.values(t).includes(!0);this.$emit("input",!a)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var a=this,e=function(t){return t.$watch("hasError",(function(e){a.$set(a.errorBag,t._uid,e)}),{immediate:!0})},n={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?n.shouldValidate=t.$watch("shouldValidate",(function(i){i&&(a.errorBag.hasOwnProperty(t._uid)||(n.valid=e(t)))})):n.valid=e(t),n},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var a=this.inputs.find((function(a){return a._uid===t._uid}));if(a){var e=this.watchers.find((function(t){return t._uid===a._uid}));e&&(e.valid(),e.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==a._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==a._uid})),this.$delete(this.errorBag,a._uid)}}},render:function(t){var a=this;return t("form",{staticClass:"v-form",attrs:Object(n["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return a.$emit("submit",t)}}},this.$slots.default)}})},"6bc2":function(t,a){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACz4AAAFaBAMAAACX3HTLAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAPUExURUdwTC0pRC4qRSwoQywoQ4Cl7k8AAAAEdFJOUwB7PbhEZZIrAAAFUklEQVR42u3b0W2DMBSG0agboEwQVjAjeP+Z+tC+QAmChMIfc84IjvLp6trcbgCE6ftHd3cMABm++r7r7qXUX04E4OxRuStlqH84G4CkKuszwFlRLnUdBwZw+qiszwAHmd71vcIpAuw8Kr9VZX0G2HlUHurOHC3ASQsMfQbYeYEx1CM4boCTFhj6DJA+KuszQHyV9RlgGuVSs/hhAFXO5CcCruSAZ3H6DNBklfUZuEyUh/qh/ISAUVmfAf5J0rM4fQaMyp++wNBnoMVRudTm+a0BCwx9Bti4wHi0ctenz4BZWZ8BzMr6DLQ+KquyPgMZo3JvVNZnQJX1GeB5lAe11WfAqKzPACOexekzYIGhzwBLo7IFhj4DFhj6DDC/wJBLfQYsMNBnwKisz4Aqo8/A+ii769NnwKiMPgNjnsXpM6DK6DOwFGULDH0GjMroMzDmrk+fAQsM9BlYHJUtMPQZCOmyBYY+A3nTsjzpMxBUZRsM9Bky/Fz3KRH6DEZl9BmYHZVVGX0GCwz0GZiLsgUG+gwWGOgzMOWxMvoMeVU2KqPPYFRGnwFVRp/BXR/oMxiV0WcwKoM+gyqjz2CBAfoMRmXQZ4zKoM+gyqDPXDPKFhjoMxiVQZ9h9q5PldFnSKly5wUG+gxGZdBneFZlozLoM15ggD6DBQboM0Zl0GfYUGX/ONBngqKsyqDPWGCAPoO7PtBnVBn0GTZE2QID9BmjMugzuOsDfcYCA9Bn1o/KFhigz1hgAPqMuz7QZywwAH3GXR/oMxYYgD7zbpRVGfQZCwxAn3HXB/pMcpWNyqDPxI3Kqgz6jAUGoM+46wP02agM6DNGZUCfVRnQZ3zXB+izURnQZ9z1AfqsygD67Ls+QJ+NygD67K4P0GcsMAB99lgZQJ8tMAB9dtcHoM9GZUCfjcoA+qzKgD57Fgegz0ZlgPb77K4P0OesKltgAPrsuz4AfbbAAMjus7s+gGqBAaDPRmWA9D6rMkBQn33XB5DUZ1UGSOqzZ3EASX1WZYCgPnsWB5DUZ6MyQFCfPYsDSOqzBQZAUJ89iwNI6rMFBkBSn931AQT2WZUBMvvsCAD0GQB9BtBnAPQZQJ8B0GcA9BlAnwHQZwB9BkCfAfQZAH0GQJ8B9BkAfQbQZwD0GQB9BtBnAPQZQJ8B0GcAfQZAnwHQZwB9BkCfAfQZAH0GQJ8B9BkAfQbQZwD0GUCfAdBnAPQZQJ8B0GcAfQZAnwH02REA6DMA+gygzwDoM4A+A6DPAOgzgD4DoM8A+gyAPgPoMwD6DIA+A+gzAPoMoM8A6DMA+gygzwDoM4A+A6DPAPoMgD4DoM8A+gyAPgPoMwD6DIA+A+gzAPoMoM8A6DOAPgOgzwDoM4A+A6DPAPoMgD4D6LMjANBnAPQZQJ8B0GcAfQZAnwHQZwB9BkCfAfQZAH0G0GcA9BkAfQbQZwD0GUCfAdBnAPQZQJ8B0GcAfQZAnwH0GQB9BkCfAfQZAH0G0GcA9BkAfQbQZwD0GUCfAdBnAH0GQJ8B0GcAfQZAnwH0GQB9BtBnRwCgzwDoM4A+A6DPAPoMgD4DoM8A+gyAPgPoMwD6DKDPAOgzAPoMoM8A6DOAPgOgzwDoM4A+A6DPAPoMgD4D6DMA+gyAPgPoMwD6DKDPAOgzAPoMoM8A6DOAPgOgzwD6DIA+A6DPAPoMgD4D6DMA+gygz44AQJ8B0GcAfQZAnwH0GQB9BkCfAfQZAH0G0GcA9BlAnwHQZwD0GUCfAdBnAH0GQJ8B0GcAfQZAnwH0GQB9BtBnAPQZAH0G0GcA9BlAnwHQZwD0GUCfAdBngCZ8A2ywbuR66ljNAAAAAElFTkSuQmCC"},"89a6":function(t,a,e){var n={"./mask-dark.png":"6bc2","./mask-light.png":"f9bd"};function i(t){var a=s(t);return e(a)}function s(t){if(!e.o(n,t)){var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}return n[t]}i.keys=function(){return Object.keys(n)},i.resolve=s,t.exports=i,i.id="89a6"},"8b48":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"auth-wrapper auth-v1"},[n("div",{staticClass:"auth-inner"},[n("v-card",{staticClass:"auth-card rounded-xl"},[n("v-card-title",{staticClass:"d-flex align-center justify-center py-7"},[n("router-link",{staticClass:"d-flex align-center",attrs:{to:"/"}},[n("v-img",{staticClass:"me-3 ",attrs:{src:e("c4f2"),"max-height":"40px","max-width":"40px",alt:"logo",contain:""}}),n("h2",{staticClass:"text-2xl font-weight-semibold"},[t._v(" Formunica-Reintegro ")])],1)],1),n("v-card-text",[n("p",{staticClass:"text-2xl font-weight-semibold text--primary mb-2"},[t._v(" ¡Bienvenido! ")]),n("p",{staticClass:"mb-2"},[t._v(" Favor autenticarse con sus credenciales Formunica ")])]),n("v-card-text",[n("v-text-field",{staticClass:"mb-3",attrs:{outlined:"",label:"Usuario",placeholder:"user@formunica.com","hide-details":""},on:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.login.apply(null,arguments)}},model:{value:t.userData.USUARIO,callback:function(a){t.$set(t.userData,"USUARIO",a)},expression:"userData.USUARIO"}}),n("v-text-field",{attrs:{outlined:"",type:t.isPasswordVisible?"text":"password",label:"Contraseña",placeholder:"············","append-icon":t.isPasswordVisible?t.icons.mdiEyeOffOutline:t.icons.mdiEyeOutline,"hide-details":""},on:{"click:append":function(a){t.isPasswordVisible=!t.isPasswordVisible},keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.login.apply(null,arguments)}},model:{value:t.userData.PASSWORD,callback:function(a){t.$set(t.userData,"PASSWORD",a)},expression:"userData.PASSWORD"}}),n("v-form",[n("v-btn",{staticClass:"mt-6",attrs:{block:"",color:"primary",disabled:t.enabledBtn},on:{click:function(a){return t.login()}}},[t._v(" Iniciar Sesión ")])],1)],1),n("v-dialog",{attrs:{"hide-overlay":"",persistent:"",width:"300"},model:{value:t.dialog,callback:function(a){t.dialog=a},expression:"dialog"}},[n("v-card",{attrs:{color:"primary",dark:""}},[n("v-card-text",[t._v(" Iniciando Sesión... "),n("v-progress-linear",{staticClass:"mb-0",attrs:{indeterminate:"",color:"white"}})],1)],1)],1),n("v-card-text",{staticClass:"d-flex align-center justify-center flex-wrap mt-2"},[n("span",{staticClass:"me-2"},[t._v(" ¿Nuevo en la plataforma? ")]),n("span",[n("strong",[t._v("Pongase en contacto con el area de IT")])])]),n("v-card-text",{staticClass:"d-flex align-center mt-2"},[n("v-divider"),n("span",{staticClass:"mx-5"},[t._v("o")]),n("v-divider")],1),n("v-snackbar",{scopedSlots:t._u([{key:"action",fn:function(a){var e=a.attrs;return[n("v-btn",t._b({attrs:{text:""},on:{click:function(a){t.snackbar=!1}}},"v-btn",e,!1),[t._v(" Cerrar ")])]}}]),model:{value:t.snackbar,callback:function(a){t.snackbar=a},expression:"snackbar"}},[t._v(" "+t._s(t.text)+" ")])],1)],1),n("img",{staticClass:"auth-mask-bg",attrs:{height:"173",src:e("89a6")("./mask-"+(t.$vuetify.theme.dark?"dark":"light")+".png")}}),n("v-img",{staticClass:"auth-tree",attrs:{width:"247",height:"185",src:e("fe35")}}),n("v-img",{staticClass:"auth-tree-3",attrs:{width:"377",height:"289",src:e("461b")}})],1)},i=[],s=e("94ed"),r=e("ed09"),o=e("bc3a"),A=e.n(o),c={setup:function(){var t=Object(r["f"])(!1);return{isPasswordVisible:t,icons:{mdiEyeOutline:s["A"],mdiEyeOffOutline:s["z"]}}},data:function(){return{email:"",name:"",userName:"",userData:{USUARIO:"",PASSWORD:""},snackbar:!1,text:"",enabledBtn:!1,dialog:!1}},created:function(){},methods:{login:function(){var t=this;""===this.userData.USUARIO?(this.snackbar=!0,this.text="Favor ingrese su usuario"):""===this.userData.PASSWORD?(this.snackbar=!0,this.text="Favor ingrese su contraseña"):(this.enabledBtn=!0,this.dialog=!0,A.a.post("/api/login",this.userData).then((function(a){404===a.data.StatusCode?(t.snackbar=!0,t.text=a.data.mensaje,t.enabledBtn=!1,t.dialog=!1):(sessionStorage.setItem("tknReiFormunica",a.data.token),sessionStorage.setItem("userRei",a.data.user),sessionStorage.setItem("roleRei",a.data.rol),A.a.defaults.headers.common.Authorization="Bearer ".concat(sessionStorage.tknReiFormunica),t.$router.push({name:"dashboard"}),t.enabledBtn=!1,t.dialog=!1)})).catch((function(a){t.snackbar=!0,t.text=a.response.data.mensaje,t.enabledBtn=!1,t.dialog=!1})))}}},u=c,l=(e("f499"),e("2877")),d=e("6544"),g=e.n(d),B=e("8336"),f=e("b0af"),h=e("99d9"),D=e("169a"),Q=e("ce7e"),C=e("4bd4"),w=e("adda"),m=e("8e36"),b=e("2db4"),p=e("8654"),v=Object(l["a"])(u,n,i,!1,null,null,null);a["default"]=v.exports;g()(v,{VBtn:B["a"],VCard:f["a"],VCardText:h["c"],VCardTitle:h["d"],VDialog:D["a"],VDivider:Q["a"],VForm:C["a"],VImg:w["a"],VProgressLinear:m["a"],VSnackbar:b["a"],VTextField:p["a"]})},f499:function(t,a,e){"use strict";e("0c97")},f9bd:function(t,a){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAACtBAMAAAC0KMWCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAVUExURUdwTPHx9vDx9vDx9vHy9/Pz+e/w9XrTQnAAAAAGdFJOUwB7ptFPJqEDGaYAAAKASURBVHja7d3NacNAFIVRb1KAUoJUgkB7g0qIW1D/JcSEkEVwyJ/BulfnlKB8DO/NGHI6QYHLyzoM4zT7EuR6uqzr8HzNePvgoxB4GJ+HcZyX7Qafh5DD+H2muJmxoEmZKc7XmWKet5/yzciaKQRN6oK3CZq0w/jXM4WgSV3wBE3Vgido9rjgDX9d8ARN1YInaHaQ8fyAjAXNbu8pBE3VPYWg6R+NBU3qPYWgOeZhLGi+P4zffhUUl7Gg+TxTTCEzhaD5YqbY022boPnPTLFsrfyNLXiCJuEwLp0pBH2s07hpwRP04S8qtsPTQvxFxbTIWND5FxXaFXT+RYXDWNAFjx8yFrQFT9CYKQSNBU/QRz+MzRSCzj+MLXiCNlMg6P284MlY0AWHsZlC0OELnsNY0F7wEPROXvBkLOj8FzwzhaAteAjaCx6CvseCJ2NBmykQtAUPQd/jV0EyFnTBgmemELQFD0E//AXPgkdy0BY8CoJ220ZB0BY88oO24FEQtJmC/KAteBQE7QWP/KC94FEQtJmCgqC94JEftMOYgqAL/kc0grbgkR+0FzwKgvaCR37QFjwKgvaCR0HQFjw6gjZTUBW0T4CgQdAgaBA0ggZBg6BB0CBoBA2CBkGDoEHQCBoEDYIGQYOgETQIGgQNggZBI2gQNAgaBA2CRtAgaBA0CBoEjaBB0CBoEDSCBkGDoEHQIGgEDYIGQYOgQdAIGgQNggZBg6ARNAgaBA2CBkEjaBA0CBoEDYJG0CBoEDQIGgSNoEHQIGgQNAgaQYOgQdAgaAQNggZBg6BB0AgaBA2CBkGDoBE0CBoEDYIGQSNoEDQIGgQNgkbQIGgQNAgaBE2rV8fAx8SI153KAAAAAElFTkSuQmCC"},fe35:function(t,a,e){t.exports=e.p+"img/tree-green.c435745c.png"}}]);
//# sourceMappingURL=chunk-17155aac.6374bb37.js.map