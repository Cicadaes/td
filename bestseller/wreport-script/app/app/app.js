'use strict';

angular.module('wreport.app', ['ui.router', 'ngTable', 'restangular', 'ngDraggable', 'ngDraggableDialog', 'ngFileUpload', 'angular-sortable-view'])
    .config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
        $stateProvider.state('directBar', {
            'abstract': true,
            views: {
                'directBar@': {
                    templateUrl: 'app/common/directBar.html',
                    controller: 'DirectBarController'
                }
            },
        });
        $stateProvider.state('accordion', {
            'abstract': true,
            parent: 'directBar',
            views: {
                'accordion@': {
                    templateUrl: 'app/common/accordion.html',
                    controller: 'AccordionMenuController'
                }
            },
        });
        $stateProvider.state('topbar', {
            'abstract': true,
            parent: 'accordion',
            views: {
                'topbar@': {
                    templateUrl: 'app/common/topBar.html',
                    controller: 'TopBarController'
                }
            },
        });
        angular.forEach(states, function (item) {
            $stateProvider.state(item.state, {
                parent: 'topbar',
                url: item.url,
                views: {
                    'content@': {
                        templateUrl: item.templateUrl,
                        controller: item.controller
                    }
                },
            });
        })
        $urlRouterProvider.otherwise('/report/loading');
        RestangularProvider.setBaseUrl(appConfig.baseUrl);
    });

