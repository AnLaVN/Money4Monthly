/*!
 * angular-translate - v2.19.0 - 2021-09-02
 * 
 * Copyright (c) 2021 The angular-translate team, Pascal Precht; Licensed MIT
 */
!function(t,e){"function"==typeof define&&define.amd?define([],function(){return e()}):"object"==typeof module&&module.exports?module.exports=e():e()}(0,function(){function t(a,t){"use strict";var o,e={get:function(t){return o||(o=a.localStorage.getItem(t)),o},set:function(t,e){o=e,a.localStorage.setItem(t,e)},put:function(t,e){o=e,a.localStorage.setItem(t,e)}},r="localStorage"in a;if(r){var n="pascalprecht.translate.storageTest";try{r=null!==a.localStorage&&(a.localStorage.setItem(n,"foo"),a.localStorage.removeItem(n),!0)}catch(t){r=!1}}return r?e:t}return t.$inject=["$window","$translateCookieStorage"],angular.module("pascalprecht.translate").factory("$translateLocalStorage",t),t.displayName="$translateLocalStorageFactory","pascalprecht.translate"});