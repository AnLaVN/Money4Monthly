app.controller('SpendsCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', '$filter', '$translate', function ($scope, $rootScope, $location, $routeParams, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf('/'));
$scope.Spends = [];
const TutorialName = $translate.instant('spends.list'), TutorialCurrent= {name: TutorialName};
const TutorialSteps = [
	{element:'.bg-purple.text-center', popover:{title: TutorialName, description: $translate.instant('tutorial.header_descr', TutorialCurrent), side: 'bottom', align: 'center'}},
	{element:'.c-pointer.sticky-top', popover:{title: $translate.instant('tutorial.btn_add_title'), description: $translate.instant('tutorial.btn_add_descr', TutorialCurrent), side: 'bottom', align: 'center'}},
	{element:'.spends-gird', popover:{title: TutorialName, description: $translate.instant('tutorial.list_descr', TutorialCurrent), side: 'left', align: 'center'}},
	{element:'.btn-Purple', popover:{title: $translate.instant('tutorial.btn_save_title'), description: $translate.instant('tutorial.btn_save_descr'), side: 'left', align: 'center'}},
	{element:'.dropdown .position-fixed', popover:{title: $translate.instant('filter.name'), description: $translate.instant('tutorial.filter_descr'), side: 'left', align: 'center'}},
]
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;
$scope.Change = e => e.changed = true;

// AnLaVN - Update form changed status when data of Spends change
$scope.$watch('Spends', $scope.ChangeForm, true);

// AnLaVN - Load tutorial
$scope.LoadTutorial = () => $rootScope.Tutorial($routeParams.tutorial, $rootScope.M4M.Spends.name, TutorialSteps);

// AnLaVN - Load more data when scroll down
let index = 0
$scope.LoadMoreData = function(){
	var isChanged = $scope.formChanged;
	$scope.Spends = $scope.Spends.concat($rootScope.M4M.Spends.data.slice(index, index + M4M.FirebaseRow));
	if(index == 0) $timeout(() => $scope.formChanged = false);
	if(!isChanged) $timeout(() => $scope.formChanged = isChanged);
	index += M4M.FirebaseRow;
}

// AnLaVN - Add Spends to list
$scope.AddSpends = () => {
	if($scope.Spends.every(e => e && e.category && e.wallet && e.time && e.content && e.price))  {
		let last = angular.copy($scope.Spends.slice(-1)[0]);
		last.id = uid();
		last.time = $rootScope.viewTime(last.time).getDate() == new Date().getDate() ? last.time : new Date();
		last.content = '';
		last.price = 0;
		$scope.Spends.unshift(last);
		$rootScope.M4M.Spends.data.unshift(last);
		$('#ScrollTop').click();
	};
}

// AnLaVN - Delete Spends from list
$scope.DelSpends = id => {
	$scope.Spends.splice($scope.Spends.findIndex(e => e.id == id), 1);
	$rootScope.M4M.Spends.data.splice($rootScope.M4M.Spends.data.findIndex(e => e.id == id), 1);
}

// AnLaVN - Save list Spends to Firestore
$scope.SaveSpends = function(){
	const firestore = {name: $translate.instant('spends.name')};
	const changedData = $scope.Spends.filter(e => e.changed);
	const newData = {
		time: new Date(),
		data: angular.copy($filter('orderBy')($rootScope.M4M.Spends.data, '-time').map(e => {
			var item = changedData.find(i => i.id == e.id) || e;
			item.price = Number(replaceCurrency(item.price || 0, false));
			const {changed, ...itemWithoutChanged} = item;
			return itemWithoutChanged;
		}))
	};
	M4Mfs.collection(M4M.AppName).doc($rootScope.M4M.Spends.name).update(newData).then(() => {
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_success', firestore), 'success')}, 10);
		$scope.formChanged = false;
	}).catch(error => {	
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_error', firestore), 'danger')}, 10);
		console.log(error);
	});
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);