app.controller("MainCtrl", ["$scope", "$rootScope", "$http", "$timeout", function ($scope, $rootScope, $http, $timeout) {
//-------------------------------------------------- Environment variable
$rootScope.AppTheme = localStorage.getItem(M4M.AppTheme) || 'dark';
$scope.Notifis = [];
$rootScope.M4M = {Wallet:{name:"Wallet"}, Category:{name:"Category"}, Income:{name:"Income"}, Sending:{name:"Sending"}};
$http.get(M4M.Currency).then(res => $rootScope.Currencys = res.data);
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function

// AnLaVN - Hàm thêm thông báo
$rootScope.AddNotifis = function(content, color){
	var notifi = { content: content, color: color, time: new Date() };	// Tạo thông báo
	$scope.Notifis.push(notifi);				// Thêm thông báo vào danh sách
	$timeout(()=>{new bootstrap.Toast(document.getElementById(`Notifi${notifi.time.getTime()}`)).show()});
	$timeout(()=>{$scope.Notifis.shift()},10000);// Lên lịch xoá thông báo sau 10s
}

// AnLaVN - Load menu biểu tượng cảm xúc
$rootScope.LoadEmojiMenu = function(element, scope){
	const AvailableLanguages = ["en", "ar", "be", "cs", "de", "es", "fa", "fi", "fr", "hi", "it", "ja", "kr", "nl", "pl", "pt", "ru", "sa", "tr", "uk", "vi", "zh"];
	const BrowserLanguage = (navigator.language || navigator.userLanguage).slice(0, 2);
	const EmojiLanguage = AvailableLanguages.includes(BrowserLanguage) ? BrowserLanguage : "en";
	scope.icon = scope.icon || "🙂";
	const picker = new EmojiMart.Picker({
		onEmojiSelect: (emoji) => $scope.$apply(() => scope.icon = emoji.native), 
		locale: EmojiLanguage,
		previewPosition: 'none',
		searchPosition: 'static',
		set:'facebook', 
		theme: $rootScope.AppTheme, 
	});
	$timeout(() => {
		element = document.getElementById(element);
		element.innerHTML = "";
		element.appendChild(picker);
	});
}

$rootScope.viewTime = time => time && time.seconds ? new Date(time.seconds * 1000) : time;
$rootScope.getCategory = id => $rootScope.M4M.Category.data.find(e => e.id === id);
$rootScope.getWallet = id => $rootScope.M4M.Wallet.data.find(e => e.id === id);
$rootScope.getCurrency = code => $rootScope.Currencys[code];
$rootScope.getTotal = arr => arr && arr.reduce((sum, e) => sum + Number(e.price || 0), 0);
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);