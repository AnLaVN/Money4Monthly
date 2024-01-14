app.controller("ConfigCtrl", ["$scope", "$rootScope", "$timeout", "$translate", function ($scope, $rootScope, $timeout, $translate) {
//-------------------------------------------------- Environment variable
let firestore;
$scope.config = null;
$scope.FirebaseConfig = decodeEntity(M4M.FirebaseConfigExample);
$(`#Modal_Config`).off("show.bs.modal");
$(`#Modal_Config`).on("show.bs.modal", async function () {
	$scope.$apply(() => {
		firestore = {name: $translate.instant('config.name')};
		$scope.getConfig();
		$scope.formChanged = false;
	})
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;

// AnLaVN - Get config firebase from local function
$scope.getConfig = () => $scope.config = localStorage.getItem(M4M.FirebaseConfig) || null;

// AnLaVN - Set config firebase to local function
$scope.setConfig = function(){
	localStorage.setItem(M4M.FirebaseConfig, JSON.stringify(JSON.parse($scope.config)));
	$scope.setUpConfig();
}

// AnLaVN - Setup config firebase function
$scope.setUpConfig = function(){
	$scope.getConfig();
	if($scope.config){
		firebase.initializeApp(JSON.parse($scope.config));	
		M4Mfs = firebase.firestore();
		$timeout(() => $rootScope.AddNotifis("notifi.fs_connect_success", "success"));

		for (let i in $rootScope.M4M) {
			let fireStore = $rootScope.M4M[i].name;
			let db = M4Mfs.collection(M4M.AppName).doc(fireStore);
			function onSnapshotFireStore(){
				db.onSnapshot(newData => {
					$scope.$apply(() => $rootScope.M4M[fireStore] = newData.data())
				});
			}
			db.get().then(data => {	
				if (data.exists) onSnapshotFireStore();
				else db.set({...($rootScope.M4M[fireStore]), data: [], time: new Date()}).then(() => {
					$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_create_success', firestore), "success")}, 10);
					onSnapshotFireStore();
				}).catch(error => {	
					$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_create_error', firestore), "danger")}, 10);
					console.log(error);
				});
			}).catch(error => {	
				$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_access_error', firestore), "warning")}, 10);
				console.log(error);
			});
		}
	} else $timeout(() => {$('#Modal_Config').modal("show")}, 300);
}

// AnLaVN - Exit modify list Wallet
$scope.ExitConfig = function(){
	if(!$scope.formChanged || confirm($translate.instant('notifi.fs_ignore_confirm', firestore)))  $('#Modal_Config').modal("hide");
	else return;
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
angular.element(() => $scope.setUpConfig());
}]);