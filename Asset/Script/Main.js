const M4M = {
	AppName: "M4M",
	AppAuthor: "AnLaVN", 
	AppTheme: "M4M_AppTheme", 
	AppLanguages: [
		{id: "vi_VN", icon: "🇻🇳", name: "Tiếng Việt"},
		{id: "en_EN", icon: "🇺🇲", name: "English"}
	],
	FirebaseConfig: "M4M_FirebaseConfig",
	FirebaseConfigExample: '{&#13;"apiKey": "&lt;API_KEY&gt;",&#13;"authDomain": "&lt;PROJECT_ID&gt;.firebaseapp.com",&#13;"projectId": "&lt;PROJECT_ID&gt;",&#13;"storageBucket": "&lt;PROJECT_ID&gt;.appspot.com",&#13;"messagingSenderId": "&lt;MESSAGING_ID&gt;",&#13;"appId": "&lt;APP_ID>"&#13;}',
	Currency: "https://gist.githubusercontent.com/ksafranski/2973986/raw/Common-Currency.json"
}
var M4Mfs;
var app = angular.module("M4M",["ngRoute", "luegg.directives", "ngCookies", "pascalprecht.translate", "ngSanitize"]);
app.config(['$compileProvider', function ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}]);