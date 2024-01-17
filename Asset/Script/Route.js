app.config(function ($routeProvider) {
	$routeProvider
		.when("/home", { // Trang chủ
			templateUrl: "Pages/Home/index.html",
			controller: "HomeCtrl"
		})
		.when("/income", { // Trang thu nhập
			templateUrl: "Pages/Income/index.html",
			controller: "IncomeCtrl"
		})
		.when("/spends", { // Trang chi tiêu
			templateUrl: "Pages/Spends/index.html",
			controller: "IncomeCtrl"
		})
		.when("/statistical", { // Trang thống kê
			templateUrl: "Pages/Statistical/index.html",
			controller: "StatisticalCtrl"
		})
		.when("/error", { // Trang báo lỗi
			templateUrl: "Pages/Error/index.html",
			controller: "MainCtrl"
		})
		.otherwise({
			redirectTo: "/error"
		});
});