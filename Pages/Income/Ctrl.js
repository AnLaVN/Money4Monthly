app.controller("IncomeCtrl", ["$scope", "$rootScope", "$location", "$timeout", function ($scope, $rootScope, $location, $timeout) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = function(){
	$scope.formChanged = true;
}

// AnLaVN - Update form changed status when data of Income change
$scope.$watch('M4M.Income', $scope.ChangeForm, true);

// AnLaVN - Add Income to list
$scope.AddIncome = function(){
	if($rootScope.M4M.Income.data.every(e => e && e.wallet && e.time && e.content && e.price))  {
		$rootScope.M4M.Income.data.push({time: new Date()})
	};
}

// AnLaVN - Delete Income from list
$scope.DelIncome = function(index){
	$rootScope.M4M.Income.data.splice(index, 1);
}

// AnLaVN - Save list Income to Firestore
$scope.SaveIncome = function(){
	var fireStore = angular.copy($rootScope.M4M.Income.name);
	var newData = {name: fireStore, data: angular.copy($rootScope.M4M.Income.data), time: new Date()}
	M4Mfs.collection(M4M.AppName).doc(fireStore).set(newData).then(() => {
		$timeout(() => {$rootScope.AddNotifis(`Cập nhật kho lưu trữ ${fireStore} thành công.`, "success")}, 10);
		$scope.formChanged = false;
	}).catch(error => {	
		$timeout(() => {$rootScope.AddNotifis(`Không thể cập nhật kho lưu trữ ${fireStore} !`, "danger")}, 10);
		console.log(error);
	});
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);