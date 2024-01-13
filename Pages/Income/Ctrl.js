app.controller("IncomeCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$translate", function ($scope, $rootScope, $location, $timeout, $translate) {
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
		$rootScope.M4M.Income.data.push({time: new Date()});
	};
}

// AnLaVN - Delete Income from list
$scope.DelIncome = index => $rootScope.M4M.Income.data.splice(index, 1);

// AnLaVN - Save list Income to Firestore
$scope.SaveIncome = function(){
	const firestore = {name: $translate.instant('m4m.income')};
	const newData = {data: angular.copy($rootScope.M4M.Income.data.map(e => ({...e, price: Number(replaceCurrency(e.price, false))}) )), time: new Date()};
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