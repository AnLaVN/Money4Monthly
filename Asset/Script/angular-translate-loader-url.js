/*!
 * angular-translate - v2.19.0 - 2021-09-02
 * 
 * Copyright (c) 2021 The angular-translate team, Pascal Precht; Licensed MIT
 */
!function(e,t){"function"==typeof define&&define.amd?define([],function(){return t()}):"object"==typeof module&&module.exports?module.exports=t():t()}(0,function(){function e(r,n){"use strict";return function(e){if(!e||!e.url)throw new Error("Couldn't use urlLoader since no url is given!");var t={};return t[e.queryParameter||"lang"]=e.key,n(angular.extend({url:e.url,params:t,method:"GET"},e.$http)).then(function(e){return e.data},function(){return r.reject(e.key)})}}return e.$inject=["$q","$http"],angular.module("pascalprecht.translate").factory("$translateUrlLoader",e),e.displayName="$translateUrlLoader","pascalprecht.translate"});