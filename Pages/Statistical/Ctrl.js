app.controller("StatisticalCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$filter", "$translate", function ($scope, $rootScope, $location, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
$scope.Statistical = {name: "sending", groupBy: "day"}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
function getGroupBy(arr, groupBy){
	let data = arr.reduce((acc, current) => {
		const date = $rootScope.viewTime(current.time),
			year = date.getFullYear(), 
			month = date.getMonth() + 1, 
			day = date.getDate(),
			key = groupBy == "year" ? `${year}-1` : (groupBy == "month" ? `${year}-${month}` : `${year}-${month}-${day}`);
		
		if (acc.has(key)) acc.get(key).data.push(current);
		else acc.set(key, { time: new Date(key), data: [current] });
		return acc;
	}, new Map());
	data = Array.from(data.values());
	data = $filter('orderBy')(data, "time");
	data.forEach(e => e.total = $rootScope.getTotal(e.data)); 
	return data;
}
function getGroupByCategory(arr, groupBy){
	let data = arr.filter(e => e.category === groupBy);
	return data ? Math.abs($rootScope.getTotal(data)) : 0;
}
function drawChart(config){
	let oldChart = Chart.getChart("Statistical-Chart");
	if (oldChart != undefined) oldChart.destroy();
	new Chart(document.getElementById("Statistical-Chart").getContext("2d"), config);
}

$scope.isLoadedData = () => $rootScope.M4M.Income.data && $rootScope.M4M.Sending.data;
$scope.drawChartMonthly = function(){
	let income = getGroupBy($rootScope.M4M.Income.data, "month");
	let sending = getGroupBy($rootScope.M4M.Sending.data, "month");
	let residual = income.map(i => ({...i, total: i.total - sending.find(s => s.time.seconds == i.time.seconds).total }) );
	const config = {
		type: 'bar',
		data: {
			labels: residual.map(e => $filter('date')(e.time)),
			datasets: [{
				type: 'line',
				label: $translate.instant("income.name"),
				data: income.map(e => e.total),
				pointRadius: 10,
				pointHoverRadius: 20,
				backgroundColor: M4M.ChartColor[0]+'33',
				borderColor: M4M.ChartColor[0],
				borderWidth: 2,
			}, {
				type: 'bar',
				label: $translate.instant("sending.name"),
				data: sending.map(e => e.total),
				maxBarThickness: 100,
				backgroundColor: M4M.ChartColor[1]+'33',
				borderColor: M4M.ChartColor[1],
				borderWidth: 2,
				stack: 'Sending-Residual',
			}, {
				type: 'bar',
				label: $translate.instant("statistical.residual"),
				data: residual.map(e => e.total),
				maxBarThickness: 100,
				backgroundColor: M4M.ChartColor[2]+'33',
				borderColor: M4M.ChartColor[2],
				borderWidth: 2,
				stack: 'Sending-Residual',
			},
			...$rootScope.M4M.Category.data.map((c, index) => ({
				type: 'line',
				label: c.icon + ' ' + c.name,
				data: sending.map(e => getGroupByCategory(e.data, c.id)),
				pointRadius: 10,
				pointHoverRadius: 20,
				backgroundColor: M4M.ChartColor[index+3]+'33',
				borderColor: M4M.ChartColor[index+3],
				borderWidth: 2,
			}))]
		},
		options: {
			scales: {
				x: {
					stacked: true
				}
			}
		}
	}
	drawChart(config);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);