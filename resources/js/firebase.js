var securedRoutes = [];
angular.module('app.firebase',[
	'ngRoute',
	'firebase'
]).factory("AppFirebaseUtil", ['FBURL','$firebaseArray','$firebaseObject',function(FBURL,$firebaseArray,$firebaseObject) {
	return {
		ref : function(path) {
			return new Firebase(FBURL + path);
		},
		object : function(path) {
			var object = $firebaseObject(this.ref(path));
			object.$fbArray = function(path) {
				return $firebaseArray(object.$ref().child(path));
			}
			object.$fbObject = function(path) {
				return $firebaseObject(object.$ref().child(path));
			};
			return object;
		},
		array : function(path) {
			return $firebaseArray(this.ref(path));
		}
	};
}]).factory("AppFirebaseAuth", ["$firebaseAuth","AppFirebaseUtil",
	function($firebaseAuth, AppFirebaseUtil) {
		return $firebaseAuth(AppFirebaseUtil.ref()); 
	}
]).service('AppFirebaseUser', ['AppFirebaseUtil','$q', function(firebaseUtil, $q) {
	return {
		createIfNotExisting: function(uid, data) {
			var defer = $q.defer();
			firebaseUtil.object('users/'+uid).$loaded(function(user) {
				if (user.$value !== null) {
					defer.resolve(user);
				} else {
					angular.forEach(data, function(value, key) {
						user[key] = value;
					});
					user.$save().then(function() {		
						defer.resolve(user);
					})['catch'](function() {
						defer.reject();
					});
				}
			});
			return defer.promise;
		},
		get: function(uid) {
			return firebaseUtil.object('users/'+uid);
		}
 	};
}]).controller('AppFirebaseAuthenticationController', [
	'$scope','AppFirebaseAuth','AppFirebaseUser','$location','$mdToast', 
	function($scope, Auth, AppFirebaseUser, $location, $mdToast) {
		$scope.login = function(email, password) {	
			$scope.loginActive = true;
			Auth.$authWithPassword({
			  email    : email,
			  password : password
			}).then(function(response){
				$scope.error = response;
				AppFirebaseUser.createIfNotExisting(response.uid, {
					username: response.password.email,
					profileImageURL : response.password.profileImageURL
				}).then(function() {
					$location.path('/');
				});
				$scope.loginActive = false;
			})['catch'](function(error) {
				$mdToast.show($mdToast.simple().content('Uw gebruikersnaam en/of wachtwoord zijn verkeerd'));
				$scope.loginActive = false;
			});
		};
		$scope.loginWithFacebook = function() {	
			Auth.$authWithOAuthPopup("facebook").then(function(response) {
				AppFirebaseUser.createIfNotExisting(response.uid, {
					username: response.facebook.displayName, 
					profileImageURL : response.facebook.profileImageURL,
					voornaam: response.facebook.cachedUserProfile.first_name,
					achternaam: response.facebook.cachedUserProfile.last_name
				}).then(function() {
					$location.path('/');
				});
			})['catch'](function(error) {
			  $mdToast.show($mdToast.simple().content('U kon niet worden ingelogd'));
			});
		};
		$scope.logoff = function() {	
			Auth.$unauth();
		};
	}
]).controller('AppFirebaseAccountController', ['$scope','$mdToast','AppFirebaseAuth', 
	function($scope, $mdToast, AppFirebaseAuth) {
		$scope.nieuwwachtwoord = {};
		$scope.canChangePassword = $scope.account.provider == 'password';
		$scope.changePassword = function(form) {
			AppFirebaseAuth.$changePassword({
				  email       : $scope.account.password.email,
				  oldPassword : $scope.nieuwwachtwoord.huidigWachtwoord,
				  newPassword : $scope.nieuwwachtwoord.wachtwoord
			}).then(function() {
				$scope.nieuwwachtwoord = {};
				form.$setPristine();
				$mdToast.show($mdToast.simple().content('Wachtwoord gewijzigd'));
			}, function(response) {
				$mdToast.show($mdToast.simple().content('Wachtwoord kon niet worden gewijzigd'));
			});
		};
	}
]).directive('fbUser', ['AppFirebaseUtil', function(AppFirebaseUtil) {
	return {
		scope: {
			uid: '@'
		},
		template : '<span ng-if="user.achternaam">{{user.voornaam}} {{user.achternaam}}</span>'+
			'<span ng-if="!user.voornaam">{{user.username}}</span>',
		link: function(scope) {
			scope.user = AppFirebaseUtil.object('users/'+ scope.uid);
		}
	}
}]).directive('fbData', ['AppFirebaseUtil', function(AppFirebaseUtil) {
	return {
		restrict: 'E',
		template : '<div>'+
			'<div ng-show="state.loading" layout="row" layout-align="center center">'+
				'<md-progress-circular md-mode="indeterminate"></md-progress-circular>'+
			'</div>'+
			'<p ng-if="state.error">Data kan niet worden opgehaald</p>'+
		'</div>',
		link: function(scope, element, attr) {
			var unbindCallback = null;
			scope.state = {};
			scope.$watch(function(){
				return attr.path;
			}, function(newValue) {
				scope.state.loading = true;
				scope.state.error = false;
				if (unbindCallback) {
					unbindCallback();
				}
				var dataObject;
				if (attr.type =='object') {
					dataObject= AppFirebaseUtil.object(newValue);
					if (attr.name) {
						scope[attr.name] = dataObject;
					} else if (attr.bindTo) {
						dataObject.$bindTo(scope, attr.bindTo).then(function(unbind) {
							unbindCallback = unbind;
						});
					}
				} else if (attr.type =='array') {
					scope[attr.name] = dataObject = AppFirebaseUtil.array(newValue);
				}
				dataObject.$loaded(function() {
					scope.state.loading = false;
				}, function() {
					scope.state.loading = false;
					scope.state.error = true;
				});
			});
		}
	};
}]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.whenAuthenticated = function (path, route) {
    	securedRoutes.push(path);
    	route.resolve = route.resolve || {};
    	route.resolve.account = ['AppFirebaseAuth','AppFirebaseUser','$q', '$rootScope', function (Auth, User, $q, $rootScope) {
    		var defer = $q.defer();
    		var promise = Auth.$requireAuth();
    		promise.then(function(account) {
				User.get(account.uid).$loaded(function(user) {
					account.user = user;
					$rootScope.$broadcast('fb-authenticated', account);
					defer.resolve(account);
				});
			})['catch'](function() {
				defer.reject('AUTH_REQUIRED');
			});
    		return defer.promise;
    	}];
    	$routeProvider.when(path, route);
    	return this;
    };
}]).run(['$rootScope', '$location', 'AppFirebaseAuth', function ($rootScope, $location, Auth) {
		Auth.$onAuth(function(account) {
			if (account) {
				$rootScope.account = account;
			} else if (securedRoutes.indexOf($location.path())  !== -1) {
				$rootScope.account = null;
				$location.path('/login');
			}
		});
		$rootScope.$on("$routeChangeError", function (e, next, prev, err) {
			if (err === "AUTH_REQUIRED") {
				$location.path('/login');
			}
		});	
		$rootScope.hasPermission = function(resource, permission) {
			return $rootScope.account && $rootScope.account.user.role == 'admin';
		};
	}
]);