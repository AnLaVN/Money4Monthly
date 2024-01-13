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

$rootScope.formatCurrency = (event) => {
	var input = $(event.target);
	var input_val = input.val();
	if (input_val === "") return;
	var original_len = input_val.length;
	var caret_pos = input.prop("selectionStart");
	input_val = replaceCurrency(replaceCurrency(input_val, false), true) + $rootScope.getCurrency($rootScope.M4M.Wallet.currency).symbol_native
	input.val(input_val);
	var updated_len = input_val.length;
	caret_pos = updated_len - original_len + caret_pos;
	input[0].setSelectionRange(caret_pos, caret_pos);
}

$rootScope.viewTime = time => time && time.seconds ? new Date(time.seconds * 1000) : time;
$rootScope.getCategory = id => $rootScope.M4M.Category.data.find(e => e.id === id);
$rootScope.getWallet = id => $rootScope.M4M.Wallet.data.find(e => e.id === id);
$rootScope.getCurrency = code => $rootScope.Currencys[code];
$rootScope.getTotal = arr => arr && arr.reduce((sum, e) => sum + Number(replaceCurrency(e.price, false) || 0), 0);
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);