angular.module('starter.controllers', ['ngResource'])

    .controller('AppCtrl', function ($scope, $state, $ionicModal, $timeout) {

        $scope.logout = function () {
            $state.go('login');
        };
    })

    .controller('LoginCtrl', ['$scope', '$state', '$ionicPlatform', '$cordovaGeolocation', 'locationFactory',
        function ($scope, $state, $ionicPlatform, $cordovaGeolocation, locationFactory) {

        // $ionicPlatform.ready(function () { //if doesn't work try document.addEventlistener('deviceready')


        document.addEventListener('deviceready', function () {

            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            var timer = null;

            cordova.plugins.backgroundMode.enable();

            //when the app is in background
            cordova.plugins.backgroundMode.onactivate = function() {

                //this helps to keep GPS working in background - only Android !!!
                cordova.plugins.backgroundMode.disableWebViewOptimizations();

                timer = window.setInterval(function () {

                    // var locations = locationFactory.query(function () {
                    var locations = locationFactory.location().query(function () {

                        //every 12 hours delete the oldest 720 records
                        if (locations.length > 2159) {

                            locations.splice(0, 720);

                            // locationFactory.remove(function () {

                            locationFactory.location().remove(function () {

                                // locationFactory.save(locations, function () {
                                locationFactory.location().save(locations, function () {

                                    var location = {};

                                            $cordovaGeolocation
                                                .getCurrentPosition(posOptions)
                                                .then(
                                                    function (position) {

                                                        var latitude = position.coords.latitude;
                                                        var longitude = position.coords.longitude;

                                                        location.lat = latitude;
                                                        location.long = longitude;

                                                        // locationFactory.save(location);
                                                        locationFactory.location().save(location);

                                                    },
                                                    function (error) {
                                                        //handle error
                                                    }
                                                );
                                });
                            });

                        }
                        else {

                            var location = {};

                            $cordovaGeolocation
                                .getCurrentPosition(posOptions)
                                .then(
                                    function (position) {

                                        var latitude = position.coords.latitude;
                                        var longitude = position.coords.longitude;

                                        location.lat = latitude;
                                        location.long = longitude;

                                        // locationFactory.save(location);
                                        locationFactory.location().save(location);

                                    },
                                    function (error) {
                                        //handle error
                                    }
                                );
                        }

                    });

                }, 1000 * 60);

            };

            //when the app is in front end
            //GRS tracking is deactivated - improves performance and user experience
            cordova.plugins.backgroundMode.ondeactivate = function () {
                window.clearInterval(timer);
                timer = null;
            };
        // });

        }, false);

        $scope.login = function () {
            $state.go('app.tabs.current-position');
        };


    }])

    .controller('CreateAccountCtrl', ['$scope', 'userService', function ($scope, userService) {

        $scope.user = {};

        $scope.signUp = function () {
            userService.save($scope.user);
        };

    }])

    .controller('TabsCtrl', [function () {

    }])

    .controller('CurrentPositionCtrl', ['$scope', 'mapFactory', 'locationFactory', '$cordovaGeolocation', '$ionicPlatform', '$timeout',
        function ($scope, mapFactory, locationFactory, $cordovaGeolocation, $ionicPlatform, $timeout) {

        $scope.userList = false;
        $scope.showMap = true;
        $scope.userListToggleButton = 'ion-chevron-down';

        $scope.toggleUserList = function () {
            $scope.userList = !$scope.userList;
            $scope.showMap = !$scope.showMap;

            if ($scope.userListToggleButton === 'ion-chevron-down') {
                $scope.userListToggleButton = 'ion-chevron-up';
            } else {
                $scope.userListToggleButton = 'ion-chevron-down';
            }
        };

        $scope.locations = locationFactory.location('last').query(function () {
            mapFactory.getMap($scope.locations, 'map');
        });

        $scope.refresh = function () {

            $scope.locations = locationFactory.location('last').query(function () {
                mapFactory.getMap($scope.locations, 'map');
            });

        };

    }])

    .controller('HistoryCtrl', ['$scope', 'mapFactory', 'locationFactory', function ($scope, mapFactory, locationFactory) {

        $scope.periods = ['last-10-minutes', 'last-30-minutes', 'last-1-hour', 'last-2-hours', 'last-6-hours', 'last-12-hours', 'last-24-hours'];

        $scope.historyList = false;
        $scope.showMap = true;
        $scope.historyListToggleButton = 'ion-chevron-down';
        $scope.periodValue = {time : $scope.periods[0]};

        $scope.locations = locationFactory.location($scope.periodValue.time).query(function () {
            mapFactory.getMap($scope.locations, 'historyMap');
        });

        $scope.toggleHistoryList = function () {
            $scope.historyList = !$scope.historyList;
            $scope.showMap = !$scope.showMap;

            if ($scope.historyListToggleButton === 'ion-chevron-down') {
                $scope.historyListToggleButton = 'ion-chevron-up';
            } else {
                $scope.historyListToggleButton = 'ion-chevron-down';
            }
        };

        $scope.getMap = function (period) {

            $scope.locations = locationFactory.location(period).query(function () {
                mapFactory.getMap($scope.locations, 'historyMap');
            });
        };
    }])

    .controller('TrackedPersonCtrl', [function () {

    }])

    .controller('ProfileCtrl', [function () {

    }])

    .controller('NetworkCtrl', [function () {

    }])
;