const M4M = {
	AppName: "M4M",
	AppAuthor: "AnLaVN", 
	AppTheme: "M4M_AppTheme", 
	CategoryDiscount: "GiamGia",
	AppLanguages: [
		{id: "vi_VN", icon: "🇻🇳", name: "Tiếng Việt"},
		{id: "en_EN", icon: "🇺🇲", name: "English"}
	],
	FirebaseConfig: "M4M_FirebaseConfig",
	FirebaseConfigExample: '{&#13;"apiKey": "&lt;API_KEY&gt;",&#13;"authDomain": "&lt;PROJECT_ID&gt;.firebaseapp.com",&#13;"projectId": "&lt;PROJECT_ID&gt;",&#13;"storageBucket": "&lt;PROJECT_ID&gt;.appspot.com",&#13;"messagingSenderId": "&lt;MESSAGING_ID&gt;",&#13;"appId": "&lt;APP_ID>"&#13;}',
	Currency: "https://gist.githubusercontent.com/ksafranski/2973986/raw/Common-Currency.json",
	ChartColor: [
		'#36a2eb',
		'#ff6384',
		'#38d86e',
		'#4c5cb4',
		// '#a5b8d7',
		'#ce85ee',
		'#71a177',
		'#c08557',
		'#b4a9be',
		'#929075',
		'#53a2b3',
		'#c9cbcf',
		'#ffcd56',
		'#9966ff',
		'#ff9f40',
		'#4bc0c0',
	]
}
const replaceCurrency = (input, add) => {
	if (typeof input !== 'string') input = input.toString();
	return add ? input.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : input.replace(/\D/g, "");
}
const decodeEntity = inputStr => {
	var textarea = document.createElement('textarea');
	textarea.innerHTML = inputStr;
	return textarea.value;
}
const isDiscount = id => id == M4M.CategoryDiscount ? -1 : 1;
var M4Mfs;
var app = angular.module("M4M", ["ngRoute", "luegg.directives", "ngCookies", "pascalprecht.translate", "ngSanitize"]);
app.config(['$compileProvider', function ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}]);