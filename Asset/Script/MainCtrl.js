app.controller("MainCtrl", ["$scope", "$rootScope", "$location", "$window", "$timeout", "$translate", "$interval", function ($scope, $rootScope, $location, $window, $timeout, $translate, $interval) {
//-------------------------------------------------- Environment variable
$scope.AppTheme = localStorage.getItem(M4M.AppTheme) || 'dark';
$scope.Notifis = [];
$rootScope.M4M = {Wallet:{}, Income:{}, Sending:{}};
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function

// AnLaVN - Hàm thêm thông báo
$rootScope.AddNotifis = function(content, color){
	var notifi = { content: content, color: color, time: new Date() };	// Tạo thông báo
	$scope.Notifis.push(notifi);				// Thêm thông báo vào danh sách
	$timeout(()=>{new bootstrap.Toast(document.getElementById(`Notifi${notifi.time.getTime()}`)).show()});
	$timeout(()=>{$scope.Notifis.shift()},10000);// Lên lịch xoá thông báo sau 10s
}

// AnLaVN - Hàm thay đổi giao diện sáng / tối
$scope.ChangeTheme = function(){
	$scope.AppTheme = $scope.AppTheme == 'dark' ? 'light' : 'dark';	// Nếu giao diện là tối thì đổi thành sáng và ngược lại
	localStorage.setItem(M4M.AppTheme, $scope.AppTheme);		// Lưu giá trị vào bộ nhớ cục bộ để lần sau truy cập vẫn còn nhớ
}

// AnLaVN - Hàm load trạng thái và xử lí toggle
$scope.ThemeToggle = function(){
	const BUTTON = document.getElementById("ThemeToggle");
	BUTTON.setAttribute("aria-pressed", $scope.AppTheme == "dark");	// Set trạng thái của nút theo giao diện
	BUTTON.addEventListener("click", () => {	// Thêm sự kiện khi click vào nút sẽ thay đổi trạng thái của nút -> thay đổi giao diện
		BUTTON.setAttribute("aria-pressed", !BUTTON.matches("[aria-pressed=true]"));
	});
}

// AnLaVN - Load menu biểu tượng cảm xúc
$scope.LoadEmojiMenu = function(){
	var EmojiMenu = document.getElementById("EmojiMenu");
	var txtText = EmojiMenu.parentElement.parentElement.querySelector("textarea")
	function insertEmoji(emoji) {
		const start = txtText.selectionStart;
		const end = txtText.selectionEnd;
		const text = txtText.value;
		if (start || start == '0') {
			txtText.value = text.substring(0, start) + emoji + text.substring(end, text.length);
		} else txtText.value += emoji;
		txtText.selectionStart = start + 2;
		txtText.selectionEnd = start + 2;
		txtText.focus();
		$scope.$broadcast('updateEmoji', txtText.value);
		auto_grow(txtText);
	}

	const AvailableLanguages = ["en", "ar", "be", "cs", "de", "es", "fa", "fi", "fr", "hi", "it", "ja", "kr", "nl", "pl", "pt", "ru", "sa", "tr", "uk", "vi", "zh"];
	const BrowserLanguage = (navigator.language || navigator.userLanguage).slice(0, 2);
	const EmojiLanguage = AvailableLanguages.includes(BrowserLanguage) ? BrowserLanguage : "en";
	
	const picker = new EmojiMart.Picker({onEmojiSelect: (emoji) => insertEmoji(emoji.native), set:'facebook', theme: $rootScope.Theme, locale: EmojiLanguage });
	document.getElementById("EmojiMenu").appendChild(picker);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);