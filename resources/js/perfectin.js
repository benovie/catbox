angular.module('perfectin',['ngMaterial','ngRoute']).run(['$rootScope', '$window', '$location', '$mdColorPalette', 'piToolbarTitle', function($rootScope, $window, $location, $mdColorPalette, toolbar) {
	$rootScope.$on('$routeChangeStart', function(event, next, previous) {
		var pageTransition = '';
		if (previous) {
			var previousLevel = previous.$$route ? previous.$$route.level : 0;
			var nextLevel = next.$$route ? next.$$route.level : 0;		
			if (nextLevel > previousLevel) {
				pageTransition = 'page-to-subpage';
			} else if (nextLevel < previousLevel) {
				pageTransition = 'subpage-to-page';
			} else if (nextLevel == previousLevel) {
				pageTransition = 'page-to-page';
			}
		}
		$rootScope.pageTransition = pageTransition;	
	});
	$rootScope.$on('$routeChangeSuccess', function(event, route) {
		$rootScope.currentRoute = route;
		toolbar.title = route.title || '';
	});	
	$rootScope.navigateTo = function(url) {
		$location.path(url);
	};
	$rootScope.goBack = function() {
		$window.history.back();
	};
}]).controller('piDialogController', ['$scope','$mdDialog', 'data', function($scope, $mdDialog, data) {
	$scope.data = data || {};    
    $scope.submit = function() {
        $mdDialog.hide($scope.data);
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.addNewArrayItem = function(property) {
    	function guid() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		  }
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
		if (typeof($scope.data[property]) == 'undefined') {
			$scope.data[property] = {};
		}
		$scope.data[property][guid()] = {};
    };
}]).directive('piDynamicWidth', function() {
	return {
		restrict : 'A',
		link : function(scope, element) {
			var input = element[0];
			scope.$watch(function() {
				console.log(input.value);
				return input.value
			}, function(value) {
				input.style.width = ((value.length + 1) * 11) + 'px';
			});
		}
	};
}).directive('piSearch', function() {
	return {
		restrict : 'E',
		scope :{
			placeholder :'@',
			data : '='
		},
		template :'<span layout="row" layout-align="start center" class="md-whiteframe-z3">'+
			'<input flex type="text" placeholder="{{placeholder}}" ng-model="data" />'+
			'<md-icon ng-click="data = null" ng-show="data">clear</md-icon>'+
		'</span>'
	};
}).directive('piAccordeon', function() {
	return {
		restrict : 'E',
		scope : {
			open : '@'
		},
		controller : ['$scope' ,function($scope) {
			var expanded = $scope.open;
			this.isExpanded = function(id) {
				return expanded == id;
			};
			this.expand = function(id) {
				expanded = id;
			};
			this.collapse = function() {
				expanded = null;
			};
		}]
	};
}).directive('piAccordeonItem', ['$compile', function($compile) {
	return {
		restrict : 'E',
		templateHolder: '<div>'+
				'<div ng-class="{\'expanded\': isExpanded()}" class="pi-accordeon-item-handle" layout="row" layout-align="space-around center" ng-click="toggle()">'+
					'<pi-accordeon-item-header flex></pi-accordeon-item-header>'+
					'<i ng-show="isExpanded()" class="material-icons">keyboard_arrow_up</i>'+
					'<i ng-show="!isExpanded()" class="material-icons">keyboard_arrow_down</i>'+
				'</div>'+
			'<md-divider></md-divider>'+
			'<div ng-if="isExpanded()">'+
				'<pi-accordeon-item-content></pi-accordeon-item-content>'+
				'<md-divider></md-divider>'+
			'</div>'+
		'</div>',
		require : '^piAccordeon',
		scope: true,
    	compile:  function (element, attr) {
    		var template = angular.element(this.templateHolder);
    		var label = attr.label ? attr.label : element.find('pi-accordeon-item-label').html();
    		element.find('pi-accordeon-item-label').remove();
    		var content = element.html();
			template.find('pi-accordeon-item-content').html(content);
			template.find('pi-accordeon-item-header').html(label);
    		element.html(template.html());

    		return function(scope, element, attr, controller) {
				scope.id =  Math.floor(Math.random() * 10000000);
				if (attr.active == 'true') {
					controller.expand(scope.id);
				}
				scope.toggle = function() {
					if (controller.isExpanded(scope.id)) {
						controller.collapse(scope.id);
					} else {
						controller.expand(scope.id);
					}
				};
				scope.expand = function() {
					controller.expand(scope.id);
				};
				scope.collapse = function() {
					controller.collapse(scope.id);
				};
				scope.isExpanded = function() {
					return controller.isExpanded(scope.id);
				};
			}
    	}
	};
}]).directive('piMaterialPalette', ['$mdColorPalette', function($mdColorPalette) {
	return {
		scope : {
			pp : '=',
			ap : '='
		},
		template : '<div>'+
			'<pi-material-palette-item palette="{{name}}" ng-click="select(name)" ng-repeat="(name,palette) in palettes"></pi-material-palette-item>'+
		'</div>',
		link: function(scope) {
			var newSelection = true
			
			scope.select = function(name) {
				if (newSelection) {
					scope.pp = name;
					newSelection = false;
				} else {
					scope.ap = name;
					newSelection = true;
				}
			};	
			scope.palettes = $mdColorPalette;
		}
	}
}]).directive('piMaterialPaletteItem', ['$mdColorPalette', function($mdColorPalette) {
	return {
		scope : {
			palette : '@'
		},
		template : '<span ng-style="style()">{{palette | limitTo: 5}}</span>',
		link: function(scope) {
			var palettes = $mdColorPalette;
			scope.style = function() {
				var color = palettes[scope.palette][500].value;
				return {
					'background-color' : 'rgb('+color[0]+','+color[1]+ ',' +color[2]+')'
				};
			}
		}
	}
}]).service('piToolbarTitle', function() {
	return {
		title :''
	};
}).directive('piToolbarTitle', ['piToolbarTitle', function(piToolbarTitle) {
	return {
		restrict : 'E',
		template : '<span>{{title}}</span>',
		link: function(scope, element) {
			scope.$watch(function() {
				return piToolbarTitle.title;
			}, function(newValue) {
				scope.title = newValue;
			});
		}
	};
}]).directive("piCompareTo", function() {
	return {
		restrict : 'A',
        require: "ngModel",
        scope: {
            otherModelValue: "=piCompareTo"
        },
        link: function(scope, element, attributes, ngModel) {           
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}).directive('piToolbar', ['$mdSidenav','$rootScope','$window',
    function($mdSidenav,$rootScope,$window) {
	return {
		restrict: 'E',
		scope: {
			sidebar : '@sidebar'
		},
		transclude: true,
		template : '<md-toolbar>'+
			'<div class="md-toolbar-tools">'+
				'<md-button ng-if="sidebar" type="button"  class="md-icon-button" aria-label="menu" ng-click="toggleSidebar()">'+
					'<md-icon class="material-icons">menu</md-icon>'+
				'</md-button>'+
				'<md-button ng-if="back" type="button" class="md-icon-button" aria-label="back" ng-click="goBack()">'+
					'<md-icon class="material-icons">keyboard_backspace</md-icon>'+
				'</md-button>'+
				'<h2>'+
					'<pi-toolbar-title></pi-toolbar-title>'+
				'</h2>'+
				'<span flex></span>'+
				'<span ng-transclude layout="row"></span>'+
			'</div>'+
		'</md-toolbar>',
		link : function(scope) {;
			scope.toggleSidebar = function() {
				$mdSidenav(scope.sidebar).toggle();
			};
			scope.goBack = function() {
				$window.history.back();
			};
			scope.$watch(function(){
				if ($rootScope.currentRoute) {
					return $rootScope.currentRoute.level > 1;
				}
			}, function(newValue) {
				scope.back = newValue;
			});
		}
	};
}]).provider('piMenu', function() {
	var menu = [];
	var self = this;
	this.addItem = function(title, path, config) {
		menuItem = config || {};
		menuItem.title = title;
		menuItem.path = path;
		menu.push(menuItem);
	};
	this.addMenu = function(title, children, config) {
		menuItem = config || {};	
		menuItem.title = title;
		menuItem.children = children;
		menu.push(menuItem);
	};
	this.$get = function() {
		return {
			getMenu : function() {
				return menu;
			},
			addMenu : self.addMenu,
			addItem : self.addItem
		};
	};
}).directive('piMenu', ['perfectInMenu','$location', '$mdSidenav', function(perfectInMenu, $location, $mdSidenav) {
	return {
		template :	'<ul>'+
				  	'<li layout="column" class="menuitem-{{menuitem.priority}}" ng-repeat="menuitem in menu | orderBy:[\'priority\',\'title\']">'+
				  		'<md-button ng-class="{\'md-primary\': isActive(menuitem), active : isActive(menuitem)}" class="link" ng-click="handle(menuitem)">'+
				  			'<md-icon class="material-icons">{{menuitem.icon}}</md-icon>'+
				  			'<span flex>{{menuitem.title}}</span>'+
				  			'<md-icon ng-show="menuitem.children && menuitem.showChildren">keyboard_arrow_up</md-icon>'+
				  			'<md-icon ng-show="menuitem.children && !menuitem.showChildren">keyboard_arrow_down</md-icon>'+
				  		'</md-button>'+
				  		'<div ng-show="menuitem.showChildren">'+
				  			'<md-divider></md-divider>'+
					  		'<ul>'+
							  	'<li ng-repeat="child in menuitem.children">'+
						  			'<md-button ng-class="{\'md-primary\': isActive(child), active : isActive(child)}" class="link" ng-click="handle(child)">'+
							  			'<md-icon class="material-icons">{{child.icon}}</md-icon>'+
					  					'<span flex>{{child.title}}</span>'+
							  		'</md-button>'+	
								  '</li>'+
					  		'</ul>'+
				  			'<md-divider></md-divider>'+
				  		'</div>'+
				  	'</li>'+
				  '</ul>',
		scope: {
			sidenav : '@?'
		},
		link: function(scope) {
			scope.menu = perfectInMenu.getMenu();
			scope.handle = function(item) {
				if (item.children) {
					item.showChildren = !item.showChildren;
				} else if(item.path) {
					if (scope.sidenav) {
						$mdSidenav(scope.sidenav).toggle();
					}
					$location.path(item.path);
				}
				
			};
			scope.isActive = function(item) {
				return item.path == $location.path() || $location.path().indexOf(item.path +'/') === 0;
			};
		}
	};
}]).directive('piFloating', ['$compile', function($compile) {
	return {
		restrict : 'E',
		compile: function(element, attr) {
			var html = element.html();
			element.html('');
			var floatingElement = angular.element('<span>'+html+'</span>');
				floatingElement.css('position', 'fixed');
				floatingElement.css('zIndex', '105');
			if (attr.type == 'bar') {
				floatingElement.css('width','100%');
				floatingElement.css('right', 0);
				floatingElement.css('bottom', 0);
			} else {
				floatingElement.css('right', 8);
				floatingElement.css('bottom', 8);
			}
			angular.element(document.body).append(floatingElement);		
			return function(scope, element) {
				$compile(floatingElement.contents())(scope);
				scope.$on('$destroy', function() {
			        floatingElement.remove();
			   });
			};
		}
	};
}]).directive('piCounter', function() {
	return {
		restrict : 'E',
		scope : {
			data :'='
		},
		template : '<span>'+
						'<md-button type="button" class="md-icon-button md-accent" ng-click="min()">'+
							'<md-icon>remove_circle</md-icon>'+
						'</md-button>'+
						'<input type="number" ng-model="data" />'+
						'<md-button type="button" class="md-icon-button md-accent" ng-click="plus()">'+
							'<md-icon>add_circle</md-icon>'+
						'</md-button>'+
					'</span>',
		link: function(scope) {
			scope.min = function() {
				if (!scope.data) {
					scope.data = 0;
				}
				scope.data--;
			};
			scope.plus = function() {
				if (!scope.data) {
					scope.data = 0;
				}
				scope.data++;
			};
		}
	};
}).directive('piData', ['$http', function($http) {
	return {
		restrict : 'E',
		template : '<div>'+
			'<div ng-show="state.loading" layout="row" layout-align="center center">'+
				'<md-progress-circular md-mode="indeterminate"></md-progress-circular>'+
			'</div>'+
			'<p ng-if="state.error">Data kan niet worden opgehaald</p>'+
		'</div>',
		scope: {
			url : '@',
			name : '@'
		},
		link: function(scope, element, attr) {
			var method = attr.method ? attr.method : 'get';	
			scope.state = {};
			scope.$watch('url', function(newUrl){
				scope.$parent[scope.name] = null;
				scope.state.loading = true;
				scope.state.error = false;
				$http[method](attr.url, {cache: true}).success(function(response) {
					scope.$parent[scope.name] = response;
					scope.state.loading = false;
				}).error(function() {
					scope.state.loading = false;
					scope.state.error = true;
				});
			});
		}
	};
}]);