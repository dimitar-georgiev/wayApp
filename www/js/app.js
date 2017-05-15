// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngResource'])

    .run(function ($ionicPlatform, $cordovaSplashscreen, $timeout) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            
            // $timeout(function () {
            //     $cordovaSplashscreen.hide();
            // }, 10000);
        });
    })

    //determines position of the tabs
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position("bottom");
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('login', {
                url : '/login',
                templateUrl : 'templates/login.html',
                controller : 'LoginCtrl'
            })

            .state('create-account', {
                url : '/create-account',
                templateUrl : 'templates/createAccount.html',
                controller : 'CreateAccountCtrl'
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/sidebar.html',
                controller: 'AppCtrl'
            })

            .state('app.tabs', {
                url : '/tabs',
                views : {
                    'menuContent' : {
                        templateUrl : 'templates/tabs.html',
                        controller : ''
                    }
                }
            })

            .state('app.tabs.current-position', {
                url : '/current-position',
                views : {
                    'tab-current-position' : {
                        templateUrl : 'templates/current-position.html',
                        controller : 'CurrentPositionCtrl'
                    }
                }
            })

            .state('app.tabs.history', {
                url : '/history',
                views : {
                    'tab-history' : {
                        templateUrl : 'templates/history.html',
                        controller : 'HistoryCtrl'
                    }
                }
            })

            // .state('app.tabs.tracked-person', {
            //     url : 'tracked-person',
            //     views : {
            //         'tab-tracked-person' : {
            //             templateUrl : 'templates/tracked-person.html',
            //             controller : ''
            //         }
            //     }
            // })

            .state('app.profile', {
                url : '/profile',
                views : {
                    'menuContent' : {
                        templateUrl : 'templates/profile.html',
                        controller : ''
                    }
                }
            })

            .state('app.network', {
                url : '/network',
                views : {
                    'menuContent' : {
                        templateUrl : 'templates/network.html',
                        controller : ''
                    }
                }
            })
        ;
        // if none of the above states are matched, use this as the fallback
        // $urlRouterProvider.when('', '/login').when('/', '/login').otherwise('/app/playlists');
        $urlRouterProvider.when('', '/login').when('/', '/login').otherwise('/app/tabs/current-position');
    });
