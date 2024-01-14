app.controller("IncomeCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$filter", "$translate", function ($scope, $rootScope, $location, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;

// AnLaVN - Update form changed status when data of Income change
$scope.$watch('M4M.Income', $scope.ChangeForm, true);

// AnLaVN - Add Income to list
$scope.AddIncome = function(){
	if($rootScope.M4M.Income.data.every(e => e && e.wallet && e.time && e.content && e.price))  {
		let last = angular.copy($rootScope.M4M.Income.data.slice(-1)[0]);
		last.time = $rootScope.viewTime(last.time).getDate() == new Date().getDate() ? last.time : new Date();
		$rootScope.M4M.Income.data.push(({...last, content: "", price: 0}));
	};
}

// AnLaVN - Delete Income from list
$scope.DelIncome = index => $rootScope.M4M.Income.data.splice(index, 1);

// AnLaVN - Save list Income to Firestore
$scope.SaveIncome = function(){
	const firestore = {name: $translate.instant('income.name')};
	const newData = {data: angular.copy($filter('orderBy')($rootScope.M4M.Income.data, "time").map(e => ({...e, price: Number(replaceCurrency(e.price || 0, false))}) )), time: new Date()};
	M4Mfs.collection(M4M.AppName).doc($rootScope.M4M.Income.name).update(newData).then(() => {
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_success', firestore), "success")}, 10);
		$scope.formChanged = false;
	}).catch(error => {	
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_error', firestore), "danger")}, 10);
		console.log(error);
	});
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);