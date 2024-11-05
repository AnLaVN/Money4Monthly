app.controller('SpendingLimitCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', '$translate', function ($scope, $rootScope, $location, $routeParams, $timeout, $translate) {
	//-------------------------------------------------- Environment variable
	$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf('/'));
	$scope.SpendingLimit = {};
	$scope.viewMonth = '0';
	const TutorialName = $translate.instant('spendinglimit.name'), TutorialCurrent= {name: TutorialName};
	const TutorialSteps = [
		
	]
	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable
	
	
	
	//-------------------------------------------------- Logic function
	// AnLaVN - Update form changed status to [true]
	$scope.ChangeForm = () => $scope.formChanged = true;
	$scope.Change = e => e.changed = true;
	
	// AnLaVN - Update form changed status when data of Spending Limit change
	$scope.$watch('SpendingLimit', (newValue, oldValue) => {
		if (newValue !== oldValue) $scope.ChangeForm();
	}, true);
	
	// AnLaVN - Load tutorial
	$scope.LoadTutorial = () => $rootScope.Tutorial($routeParams.tutorial, $rootScope.M4M.SpendingLimit.name, TutorialSteps);

	// AnLaVN - Load data when init
	$scope.LoadData = function(){
		var isChanged = $scope.formChanged;
		$scope.SpendingLimit = angular.copy($rootScope.M4M.SpendingLimit.data);
		$rootScope.currency = $rootScope.getCurrency($rootScope.M4M.Wallet.currency).symbol_native;
		if(!$scope.SpendingLimit.limit) {
			$scope.SpendingLimit.limit = 0;
			$timeout(() => $scope.formChanged = true, 100);
		}
		$scope.SpendingLimit.category = angular.copy($rootScope.M4M.Category.data).map(c => ({...c, limit: $scope.SpendingLimit?.category?.find(e => e.id === c.id)?.limit ?? 0}));
		if(!isChanged) $timeout(() => $scope.formChanged = isChanged);
	}

	// AnLaVN - Calculate corresponding price for limit
	$scope.priceOfLimit = limit => Math.round(limit / 100 * $rootScope.M4M.SpendingLimit.data.limit);

	// AnLaVN - Calculate the max limit value of category
	$scope.maxLimitCategory = categoryID => {
		const limit = $scope.SpendingLimit.limit
		const otherlimit = $rootScope.getTotal($scope.SpendingLimit.category.filter(e => e.id !== categoryID).map(e => ({price: $scope.priceOfLimit(e.limit)})));
		return Math.round((limit - otherlimit)) / limit * 100;
	}

	// AnLaVN - Make sure the value of range input allway small than limit
	$scope.allwaySmallThanLimit = (limit, categoryID) => {
		const maxLimit = $scope.maxLimitCategory(categoryID);
		return limit > maxLimit ? maxLimit : limit;
	}

	// AnLaVN - Calculate total limit of all category
	$scope.totalLimit = () => $rootScope.getTotal($scope.SpendingLimit.category.map(e => ({price: $scope.priceOfLimit(e.limit)})));



	

	// AnLaVN - Check is is there sufficient data required
	$scope.isLoadedData = () => $rootScope.M4M.Spends.data && $rootScope.M4M.SpendingLimit.data && $rootScope.M4M.SpendingLimit.data.limit;

	// AnLaVN - Load data to draw chart
	$scope.loadDataChart = () => {
		$scope.CategoryLimit = $rootScope.M4M.SpendingLimit.data.category.map(c => ({...c, priceLimit: $scope.priceOfLimit(c.limit), total: 0}));
		$scope.SpendsByMonth = $rootScope.getGroupBy($rootScope.M4M.Spends.data, 'month').sort((a, b) => b.time - a.time);
	}

	// AnLaVN - Draw chart
	$scope.drawChartLimit = () => {
		const spends = $scope.SpendsByMonth[$scope.viewMonth];
		let categoryLimit = angular.copy($scope.CategoryLimit);
		spends.data.forEach(e => categoryLimit.find(c => c.id === e.category).total += e.price);
		categoryLimit = categoryLimit.map(c => ({...c, residual: c.priceLimit - c.total})).sort((a, b) => b.priceLimit - a.priceLimit);

		const config = {
			type: 'bar',
			data: {
				labels: categoryLimit.map(c => c.name),
				datasets: [{
					type: 'line',
					label: $translate.instant("spendinglimit.name"),
					data: categoryLimit.map(c => c.priceLimit),
					pointRadius: 8,
					pointHoverRadius: 15,
					backgroundColor: M4M.ChartColor[0]+'33',
					borderColor: M4M.ChartColor[0],
					borderWidth: 2,
				}, {
					type: 'bar',
					label: $translate.instant("spends.name"),
					data: categoryLimit.map(c => c.total),
					maxBarThickness: 100,
					backgroundColor: M4M.ChartColor[1]+'33',
					borderColor: M4M.ChartColor[1],
					borderWidth: 2,
					stack: 'Spends-Residual',
				}, {
					type: 'bar',
					label: $translate.instant("statistical.residual"),
					data: categoryLimit.map(c => c.residual),
					maxBarThickness: 100,
					backgroundColor: M4M.ChartColor[2]+'33',
					borderColor: M4M.ChartColor[2],
					borderWidth: 2,
					stack: 'Spends-Residual',
				}]
			},
			options: {
				indexAxis: 'y',
				maintainAspectRatio: false,
				scales: {
					x: {
						stacked: true
					}
				}
			}
		}
	
		let oldChart = Chart.getChart("SpendingLimit-Chart");
		if (oldChart != undefined) oldChart.destroy();
		Chart.defaults.font.family = 'Dosis';
		new Chart(document.getElementById("SpendingLimit-Chart").getContext("2d"), config);
	}


	// AnLaVN - Save list Spends to Firestore
	$scope.SaveSpendingLimit = function(){
		$scope.SpendingLimit.limit = Number(replaceCurrency($scope.SpendingLimit.limit, false));
		const firestore = {name: $translate.instant('spendinglimit.name')};
		const newData = {
			time: new Date(),
			data: {
				limit: $scope.SpendingLimit.limit,
				category: angular.copy($scope.SpendingLimit.category)
			}
		};
		M4Mfs.collection(M4M.AppName).doc($rootScope.M4M.SpendingLimit.name).update(newData).then(() => {
			$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_success', firestore), 'success')}, 10);
			$scope.formChanged = false;
		}).catch(error => {	
			$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_error', firestore), 'danger')}, 10);
			console.log(error);
		});
	}
	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);