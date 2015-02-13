(function () {
    'use strict';

    angular.module('contactsApp', ['ionic'])
        .factory('people', function ($http, $q) {
            var people = [];
            var n = 0;

            var add = function (count) {
                var qs = '?q=' + (n++) + '&results=' + count || 1;
                return $http.get('http://api.randomuser.me/' + qs)
                    .then(function (response) {
                        var newPeople = response.data.results
                            .map(function (value) {
                                return value.user;
                            });
                        people.push.apply(people, newPeople);
                    });
            };

            var all = function () {
                return people;
            };

            var init = function () {
                var promises = [];
                for (var i = 0; i < 5; i++) {
                    promises.push(add(5));
                }
                return $q.all(promises);
            };

            return {
                add: add,
                all: all,
                ready: init,
                total: function () {
                    return people.length;
                }
            };
        })
        .controller('MainCtrl', function ($ionicLoading, $ionicScrollDelegate, $scope, people) {
            var vm = this;

            $ionicLoading.show({
                template: '<i class="fa fa-spinner fa-spin"></i> Loading ...'
            });

            people.ready()
                .then(function () {
                    vm.contacts = people.all();
                    $ionicLoading.hide();
                });

            vm.scrollTop = function () {
                $ionicScrollDelegate.scrollTop(true);
            };

            vm.scrollBottom = function () {
                $ionicScrollDelegate.scrollBottom(true);
            };

            vm.total = (vm.contacts) ? vm.contacts.length : 0;

            $scope.$watch(function () {
                return people.total();
            }, function (item) {
                vm.total = item;
            }, true);
        });

})();
