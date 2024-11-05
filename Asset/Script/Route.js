app.config(function ($routeProvider) {
	$routeProvider
		.when("/home", {
			templateUrl: "Pages/Home/index.html",
			controller: "HomeCtrl"
		})
		.when("/income", {
			templateUrl: "Pages/Income/index.html",
			controller: "IncomeCtrl"
		})
		.when("/spends", {
			templateUrl: "Pages/Spends/index.html",
			controller: "SpendsCtrl"
		})
		.when("/spendinglimit", {
			templateUrl: "Pages/SpendingLimit/index.html",
			controller: "SpendingLimitCtrl"
		})
		.when("/statistical", {
			templateUrl: "Pages/Statistical/index.html",
			controller: "StatisticalCtrl"
		})
		.when("/error", {
			templateUrl: "Pages/Error/index.html",
			controller: "MainCtrl"
		})
		.otherwise({
			redirectTo: "/home"
		});
});