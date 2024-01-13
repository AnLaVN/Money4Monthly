app.controller("StatisticalCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$filter", "$translate", function ($scope, $rootScope, $location, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
$scope.drawChart = function(e, color, groupBy){
	let data = e.data.reduce((acc, current) => {
		const date = $rootScope.viewTime(current.time);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const key = groupBy == "year" ? year : (groupBy == "month" ? `${year}-${month}` : `${year}-${month}-${day}`);

		if (acc.has(key)) acc.get(key).total += current.price * (current.category==M4M.CategoryDiscount?-1:1);
		else acc.set(key, { time: new Date(key), total: current.price });
		return acc;
	}, new Map());
	data = Array.from(data.values());
	data = $filter('orderBy')(data, "time")
	
	new Chart(document.getElementById("Chart-" + e.name).getContext("2d"), {
		type: 'bar',
		data: {
			labels: data.map(e => $filter('date')(e.time, "dd/MM/yyyy")),
			datasets: [
				{
					label: $translate.instant(e.name.toLowerCase() + ".name"),
					data: data.map(e => e.total),
					maxBarThickness: 100,
					backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`,
					borderColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
					borderWidth: 1
				}
			]
		}
	});
}

$scope.AvgSending = function(){
	$scope.drawChart($rootScope.M4M.Income, [153, 102, 255]);
	$scope.drawChart($rootScope.M4M.Sending, [153, 102, 255]);
}





//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
$timeout(()=>{$scope.AvgSending()}, 1000)
}]);