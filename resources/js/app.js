angular.module('app',[
	'perfectin',
	'ngSanitize',
	'app.firebase'
]).constant('FBURL','https://leren.firebaseio.com/'
).config(['$routeProvider', '$mdThemingProvider',
	function($routeProvider, $mdThemingProvider) {
		$mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('orange');
		$routeProvider.whenAuthenticated('/',{
			templateUrl: 'resources/templates/home.html'
		}).whenAuthenticated('/les/:les',{
			templateUrl: 'resources/templates/les.html',
			level: 2
		}).whenAuthenticated('/les/:les/opdracht/:opdracht',{
			templateUrl: 'resources/templates/opdracht.html',
			level: 2
		}).whenAuthenticated('/admin',{
			templateUrl: 'resources/templates/admin.html',
			level: 1
		}).whenAuthenticated('/account',{
			templateUrl: 'resources/templates/account.html',
			level: 2
		}).when('/login',{
			templateUrl: 'resources/templates/login.html'
		}).otherwise({
			templateUrl: 'resources/templates/404.html'
		});
	}
]).controller('LesController', ['$scope' , '$mdDialog', 'AppFirebaseUtil', function($scope, $mdDialog, AppFirebaseUtil) {
	$scope.addOpdracht = function(lesId) {
		$mdDialog.show({
			templateUrl: 'resources/templates/les/opdracht-toevoegen.html',
			controller: 'piDialogController',
			locals: {
				data: {
					type: 'vraag'
				}
			}
		}).then(function(data) {
			var lesopdrachten = AppFirebaseUtil.array('lesopdracht/'+ lesId);
			lesopdrachten.$add(data);
		});
	};
	$scope.addLes = function() {
		$mdDialog.show({
			templateUrl: 'resources/templates/les/les-toevoegen.html',
			controller: 'piDialogController',
			locals: {
				data: {}
			}
		}).then(function(data) {
			var lesopdrachten = AppFirebaseUtil.array('les');
			lesopdrachten.$add(data);
		});
	}
}]).directive('datumSinds', ['$timeout', function($timeout) {
	return {
		scope : {
			datum: '@'
		},
		template : '<span>{{tekst}}</span>',
		link : function(scope) {
			function setText() {		
				var now = new Date();
				var date = new Date(scope.datum);
				var diff = now.getTime() - date.getTime();
				if (diff < 1000 * 60) {
					scope.tekst = 'zojuist';
				} else if (diff < 1000 * 60 * 60) {
					scope.tekst = parseInt(diff / (1000 * 60)) + ' min.';
				} else if (diff < 1000 * 60 * 60 * 24) {
					scope.tekst = parseInt(diff / (1000 * 60 * 60)) + ' uur.';
				} else {
					scope.tekst = parseInt(diff / (1000 * 60 * 60 * 24)) + ' dag.';
				}
				$timeout(setText, 30000);
			}
			setText();
		}
	}
}]).directive('opdracht', ['AppFirebaseUtil', 'AppFirebaseAuth', '$sce', '$http', '$compile', function(AppFirebaseUtil, AppFirebaseAuth, $sce, $http, $compile) {
	return {
		scope : {
			id : '@',
			les : '@'
		},
		link : function(scope, element) {
			var accountId = scope.accountId = AppFirebaseAuth.$getAuth().uid;
			AppFirebaseUtil.object('lesopdracht/'+ scope.les + '/'+ scope.id).$bindTo(scope, 'opdracht').then(function() {
				scope.beschrijving = $sce.trustAsHtml(scope.opdracht.beschrijving);
				$http.get('resources/templates/opdracht/'+scope.opdracht.type+'.html').success(function(template){
					element.html(template);
					$compile(element.contents())(scope);
				})
			});
			scope.antwoordInput = {};
			scope.reactieInput = {};
			scope.antwoord = function(form) {
				if (!scope.opdracht.antwoorden) {
					scope.opdracht.antwoorden =  {};
				};
				scope.opdracht.antwoorden[accountId] = {
					tekst : scope.antwoordInput.tekst,
					van: accountId
				};
				scope.antwoordInput = {};
				form.$setPristine();
			};
			scope.reageer = function(form) {
				if (!scope.opdracht.reacties) {
					scope.opdracht.reacties = [];
				};
				var date = new Date();
				scope.opdracht.reacties.push({
					tekst: scope.reactieInput.tekst,
					amountOfLikes : 0,
					van: accountId,
					datum: date.toJSON()
				});
				scope.reactieInput = {};
				form.$setPristine();
			};
			scope.like = function(antwoord) {
				if (!antwoord.likes) {
					antwoord.likes = {};
				}
				antwoord.likes[accountId] = true;
				antwoord.amountOfLikes = antwoord.amountOfLikes + 1;
			};
			scope.unlike = function(antwoord) {
				antwoord.likes[accountId] = false;
				antwoord.amountOfLikes = antwoord.amountOfLikes - 1;
			};
			scope.liked = function(antwoord) {
				return antwoord.likes && antwoord.likes[accountId];
			};
			scope.verwijderAntwoord = function(antwoord) {
				delete scope.opdracht.antwoorden[accountId];
			};
			scope.verwijderReactie = function(reactie, bovenLiggendeReacties) {
				bovenLiggendeReacties.splice(bovenLiggendeReacties.indexOf(reactie), 1);
			};
		}
	}
}]);