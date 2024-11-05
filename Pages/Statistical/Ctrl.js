app.controller("StatisticalCtrl", ["$scope", "$rootScope", "$location", "$translate", function ($scope, $rootScope, $location, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
$scope.Statistical = {name: "spends", groupBy: "day"};
$scope.groupBy = "month";
$scope.viewRecord = "";
$scope.totalRecord = 0;
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
function getGroupByCategory(arr, groupBy){
	let data = arr.filter(e => e.category === groupBy);
	return data ? Math.abs($rootScope.getTotal(data)) : 0;
}

$scope.isLoadedData = () => $rootScope.M4M.Income.data && $rootScope.M4M.Spends.data;
$scope.loadData = () => {
	$scope.Income = $rootScope.getTotal($rootScope.M4M.Income.data);
	$scope.Spends = $rootScope.getTotal($rootScope.M4M.Spends.data)
	$scope.Residual = $scope.Income - $scope.Spends;
	$scope.currency = $rootScope.getCurrency($rootScope.M4M.Wallet.currency).symbol_native;
}
$scope.drawChartMonthly = function(){
	let income = $rootScope.getGroupBy($rootScope.M4M.Income.data, $scope.groupBy);
	let spends = $rootScope.getGroupBy($rootScope.M4M.Spends.data, $scope.groupBy);
	let residual = income.map((i, index) => ({...i, total: i.total - spends[index].total }) );
	$scope.totalRecord = residual.length;
	if($scope.viewRecord > 0) {
		const viewRecord = $scope.viewRecord * -1;
		income = income.slice(viewRecord);
		spends = spends.slice(viewRecord);
		residual = residual.slice(viewRecord);
	}
	
	const config = {
		type: 'bar',
		data: {
			labels: residual.map(e => $rootScope.monthFormat(e.time)),
			datasets: [{
				type: 'line',
				label: $translate.instant("income.name"),
				data: income.map(e => e.total),
				pointRadius: 8,
				pointHoverRadius: 15,
				backgroundColor: M4M.ChartColor[0]+'33',
				borderColor: M4M.ChartColor[0],
				borderWidth: 2,
			}, {
				type: 'bar',
				label: $translate.instant("spends.name"),
				data: spends.map(e => e.total),
				maxBarThickness: 100,
				backgroundColor: M4M.ChartColor[1]+'33',
				borderColor: M4M.ChartColor[1],
				borderWidth: 2,
				stack: 'Spends-Residual',
			}, {
				type: 'bar',
				label: $translate.instant("statistical.residual"),
				data: residual.map(e => e.total),
				maxBarThickness: 100,
				backgroundColor: M4M.ChartColor[2]+'33',
				borderColor: M4M.ChartColor[2],
				borderWidth: 2,
				stack: 'Spends-Residual',
			},
			...$rootScope.M4M.Category.data.map((c, index) => ({
				type: 'line',
				label: c.icon + ' ' + c.name,
				data: spends.map(e => getGroupByCategory(e.data, c.id)),
				hidden: true,
				pointRadius: 8,
				pointHoverRadius: 15,
				backgroundColor: M4M.ChartColor[index+3]+'33',
				borderColor: M4M.ChartColor[index+3],
				borderWidth: 2,
			}))
		]
		},
		options: {
			maintainAspectRatio: false,
			scales: {
				x: {
					stacked: true
				}
			}
		}
	}

	let oldChart = Chart.getChart("Statistical-Chart");
	if (oldChart != undefined) oldChart.destroy();
	Chart.defaults.font.family = 'Dosis';
	new Chart(document.getElementById("Statistical-Chart").getContext("2d"), config);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);