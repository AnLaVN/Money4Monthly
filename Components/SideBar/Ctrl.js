app.controller("SideBarCtrl", ["$scope", "$rootScope", "$translate", function ($scope, $rootScope, $translate) {
//-------------------------------------------------- Environment variable
$scope.Languages = M4M.AppLanguages;
$scope.Author = M4M.AppAuthor;
anime({
	targets: '#SideBarBtn',
	autoplay: true,
	translateY: 30,
	direction: 'alternate',
	loop: true,
	easing: 'easeInOutQuad',
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
$scope.ChangeLanguage = id => $translate.use(id);
$scope.isThisPage = link => link == $rootScope.AppPath ? "active" : "link-body-emphasis";

// AnLaVN - Change Theme to dark/light
$scope.ThemeToggle = function(){
	const BUTTON = document.getElementById("ThemeToggle");
	BUTTON.setAttribute("aria-pressed", $rootScope.AppTheme == "dark");
	BUTTON.addEventListener("click", () => {
		$scope.$apply(() => $rootScope.AppTheme = $rootScope.AppTheme == 'dark' ? 'light' : 'dark');
		localStorage.setItem(M4M.AppTheme, $rootScope.AppTheme);
		BUTTON.setAttribute("aria-pressed", !BUTTON.matches("[aria-pressed=true]"));
	});
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);