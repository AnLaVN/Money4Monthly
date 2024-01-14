app.controller("StatisticalCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$filter", "$translate", function ($scope, $rootScope, $location, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
$scope.Statistical = {name: "sending", groupBy: "day"}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
$scope.drawChart = function(){
	let data = $scope.Statistical.name == 'income' ? $rootScope.M4M.Income.data : $rootScope.M4M.Sending.data
	data = data.reduce((acc, current) => {
		const date = $rootScope.viewTime(current.time);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const key = $scope.Statistical.groupBy == "year" ? `${year}-1` : ($scope.Statistical.groupBy == "month" ? `${year}-${month}` : `${year}-${month}-${day}`);

		if (acc.has(key)) acc.get(key).total += current.price * (current.category==M4M.CategoryDiscount?-1:1);
		else acc.set(key, { time: new Date(key), total: current.price });
		return acc;
	}, new Map());
	data = Array.from(data.values());
	data = $filter('orderBy')(data, "time")
	
	let oldChart = Chart.getChart("Statistical-Chart");
	if (oldChart != undefined) oldChart.destroy();
	new Chart(document.getElementById("Statistical-Chart").getContext("2d"), {
		type: 'bar',
		data: {
			labels: data.map(e => $filter('date')(e.time)),
			datasets: [
				{
					label: $translate.instant($scope.Statistical.name.toLowerCase() + ".name"),
					data: data.map(e => e.total),
					maxBarThickness: 100,
					backgroundColor: "rgba(153, 102, 255, 0.2)",
					borderColor: "rgb(153, 102, 255)",
					borderWidth: 1
				}
			]
		}
	});
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);