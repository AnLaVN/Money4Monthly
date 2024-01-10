app.config(function ($translateProvider) {
	$translateProvider.preferredLanguage('vi_VN');
	$translateProvider.useLoader('loadLanguages');
	$translateProvider.useLocalStorage();
	$translateProvider.useSanitizeValueStrategy('escape');
});

app.factory('loadLanguages', function ($http, $q) {
	return function (options) {
		var deferred = $q.defer();
		db.collection("CMaster_Languages").doc(options.key).get().then(
			(data)=>{deferred.resolve(data.data())},
			()=>{deferred.reject(options.key)}
		);
		
		return deferred.promise;
	};
});