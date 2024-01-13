app.controller("WalletCtrl", ["$scope", "$rootScope", "$timeout", "$translate", function ($scope, $rootScope, $timeout, $translate) {
//-------------------------------------------------- Environment variable
let firestore;
$(`#Modal_Wallet`).off("show.bs.modal");
$(`#Modal_Wallet`).on("show.bs.modal", async function () {
	$scope.$apply(() => {
		firestore = {name: $translate.instant('wallet.name')};
		$scope.Wallet = angular.copy($rootScope.M4M.Wallet.data);
		$scope.Currency = angular.copy($rootScope.M4M.Wallet.currency);
		$scope.Wallet.time = angular.copy($rootScope.M4M.Wallet.time);
		$timeout(() => $scope.formChanged = false);
		$scope.LoadGird();
	})
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;

// AnLaVN - Update form changed status when data of Wallet change
$scope.$watch('Wallet', $scope.ChangeForm, true);

// AnLaVN - Load Draggable gird
$scope.LoadGird = function(){
	$('.wallet-gird').packery('destroy');
	$timeout(() => {
		var $grid = $('.wallet-gird').packery({itemSelector: '.wallet-item'});
		var $items = $grid.find('.wallet-item').draggable();
		$grid.packery('bindUIDraggableEvents', $items);
		$grid.find('.wallet-item').each((i, itemElem) => {
			var menu = itemElem.querySelector('.row>div:nth-child(3)>div>div');
			$rootScope.LoadEmojiMenu(menu.id, $scope.Wallet[i]);
		});

		function orderItems() {
			if(!$scope.formChanged) $scope.$apply(() => $scope.ChangeForm())
			var Wallet = [];
			$($grid.packery('getItemElements')).each((i, itemElem) => {
				Wallet.push({
					id:   $(itemElem).find('.row>div:nth-child(2)>input').val(), 
					icon: $(itemElem).find('.row>div:nth-child(3)>div>button').html(),
					name: $(itemElem).find('.row>div:nth-child(4)>input').val()
				});
			});
			$scope.Wallet = angular.copy(Wallet);
			$scope.Wallet.time = angular.copy($rootScope.M4M.Wallet.time);
			$scope.LoadGird();
		}
		$grid.off('dragItemPositioned');
		$grid.on('dragItemPositioned', orderItems);
	}, 30);
}

// AnLaVN - Add Wallet to list
$scope.AddWallet = function(){
	if($scope.Wallet.every(e => e && e.id && e.name))  {
		$scope.Wallet.push({id:"", name:""})
		$scope.LoadGird();
	};
}

// AnLaVN - Delete Wallet from list
$scope.DelWallet = function(index){
	$scope.Wallet.splice(index, 1);
	$scope.LoadGird();
}

// AnLaVN - Save list Wallet to Firestore
$scope.SaveWallet = function(){
	let d = new Set(); let de;
	if($scope.Wallet.some(e => (d.has(e.id) && ((de = e), true)) || (d.add(e.id), false))) {
		$rootScope.AddNotifis($translate.instant('notifi.fs_update_duplicate', ({...firestore, dup: de.id})), "warning");
		return false;
	}
	const newData = {data: angular.copy($scope.Wallet), currency: $scope.Currency, time: new Date()}
	M4Mfs.collection(M4M.AppName).doc($rootScope.M4M.Wallet.name).update(newData).then(() => {
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_success', firestore), "success")}, 10);
		$('#Modal_Wallet').modal('hide');
	}).catch(error => {	
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_error', firestore), "danger")}, 10);
		console.log(error);
	});
}

// AnLaVN - Exit modify list Wallet
$scope.ExitWallet = function(){
	if(!$scope.formChanged || confirm($translate.instant('notifi.fs_ignore_confirm', firestore)))  $('#Modal_Wallet').modal("hide");
	else return;
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);