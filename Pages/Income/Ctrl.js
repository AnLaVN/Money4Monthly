app.controller("IncomeCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$filter", "$translate", function ($scope, $rootScope, $location, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
$scope.Income = [];
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;
$scope.Change = e => e.changed = true;

// AnLaVN - Update form changed status when data of Income change
$scope.$watch('M4M.Income', $scope.ChangeForm, true);

let index = 0
$scope.LoadMoreData = function(){
	var isChanged = $scope.formChanged;
	$scope.Income = $scope.Income.concat($rootScope.M4M.Income.data.slice(index, index + M4M.FirebaseRow));
	index += M4M.FirebaseRow;
	if(!isChanged) $timeout(() => $scope.formChanged = isChanged);
}

// AnLaVN - Add Income to list
$scope.AddIncome = () => {
	if($scope.Income.every(e => e && e.wallet && e.time && e.content && e.price))  {
		let last = angular.copy($scope.Income.slice(-1)[0]);
		last.id = uid();
		last.time = $rootScope.viewTime(last.time).getDate() == new Date().getDate() ? last.time : new Date();
		last.content = "";
		last.price = 0;
		$scope.Income.unshift(last);
		$rootScope.M4M.Income.data.unshift(last);
		$("#ScrollTop").click();
	};
}

// AnLaVN - Delete Income from list
$scope.DelIncome = index => {
	$scope.Income.splice(index, 1);
	$rootScope.M4M.Income.data.splice(index, 1);
}

// AnLaVN - Save list Income to Firestore
$scope.SaveIncome = function(){
	const firestore = {name: $translate.instant('income.name')};
	const changedData = $scope.Income.filter(e => e.changed);
	const newData = {
		time: new Date(),
		data: angular.copy($filter('orderBy')($rootScope.M4M.Income.data, "-time").map(e => {
			var item = changedData.find(i => i.id == e.id) || e;
			item.price = Number(replaceCurrency(item.price || 0, false));
			const {changed, ...itemWithoutChanged} = item;
			return itemWithoutChanged;
		}))
	};
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