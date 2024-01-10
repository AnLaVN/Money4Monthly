const M4M = {
	AppName: "M4M",
	AppTheme: "M4M_AppTheme", 
	FirebaseConfig: "M4M_FirebaseConfig"
}
var M4Mdb;
var app = angular.module("M4M",["ngRoute", "luegg.directives", "ngCookies", "pascalprecht.translate", "ngSanitize"]);
app.config(['$compileProvider', function ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}]);