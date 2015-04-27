(function () {
    'use strict';

    angular
        .module('app')
        .controller('mediaCtrl', ['$http', '$stateParams', '$state', '$modal','$q', Media]);

    function Media($http, $stateParams, $state, $modal, $q) {
        var vm = this;
        var search = $stateParams.query;
        var page = $stateParams.page;
        const KEY = '?api_key=1b1497adc03fb28cf8df7fa0cdaed980';

        var CONFIG_URL = '';
        var CONFIG_DESC = '';
        var CONFIG_SEARCH = '';

        if ($state.current.name == 'movie') {
            CONFIG_URL = 'https://api.themoviedb.org/3/discover/movie' + KEY + '&page=';
            CONFIG_DESC = 'https://api.themoviedb.org/3/movie/';
            CONFIG_SEARCH = 'http://api.themoviedb.org/3/search/movie' + KEY + '&page=';
        } else {
            CONFIG_URL = 'https://api.themoviedb.org/3/discover/tv' + KEY + '&page=';
            CONFIG_DESC = 'https://api.themoviedb.org/3/tv/';
            CONFIG_SEARCH = 'http://api.themoviedb.org/3/search/tv' + KEY + '&page=';
        }

        //voir avec angular si je peux juste pas le chercher
        var $search = $('#search');
        $search.keypress(function (e) {
            if (e.keyCode == 13) {
                search = $search.val();
                $state.go($state.current.name, {query: search});
            }
        });

        vm.init = function () {
            vm.page = 1;
            vm.maxPage = 1;
            vm.media = [];
            loadData();
        };

        vm.searchFilter = function (input) {
            if (input) {
                return input.title.toLowerCase().indexOf(vm.search.toLowerCase()) >= 0;
            }
            return true;

        };

        function loadData() {
            if (search != '' && typeof search === 'string' && search.length < 64) {
                $http.get(CONFIG_SEARCH + vm.page + '&query=' + search).success(function (data) {
                    vm.media = data.results;
                    vm.maxPage = data.total_pages;
                    vm.page = data.page;
                    vm.totalResults = data.total_results;
                });
                return;
            }
            $http.get(CONFIG_URL + vm.page).success(function (data) {
                vm.media = data.results;
                vm.maxPage = data.total_pages;
                vm.page = data.page;
                vm.totalResults = data.total_results;
            });
        }


        vm.getPosterMedium = function (url) {
            if (url === null) {
                return 'assets/img/cover-placeholder.jpg';
            }
            return 'http://image.tmdb.org/t/p/w300' + url;
        };

        vm.onChange = function (number) {
            //switch case
            switch (number) {
                case 0:
                    if (vm.page > 1) vm.page--;
                    loadData();
                    break;
                case 6:
                    if (vm.page < vm.maxPage) vm.page++;
                    loadData();
                    break;
                default:
                    if (number > 0 && number < vm.maxPage) {
                        vm.page = number;
                        loadData();
                    }
            }
        };

        // https://api.themoviedb.org/3/movie/12?api_key=1b1497adc03fb28cf8df7fa0cdaed980
        vm.getMoreInfo = function getMoreInfo(id) {
            var deferred = $q.defer();
            $http.get(CONFIG_DESC + id + KEY).success(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };

        vm.open = function (mediaId) {
            // We have to wait until the API call has been made
            vm.getMoreInfo(mediaId).then(function (data) {
                var modalInstance = $modal.open({
                    controller: "modalDescriptionCtrl as description",
                    templateUrl: 'assets/partials/components/movie/description/description.tpl.html',
                    resolve: {
                        media: function()
                        {
                            return data;
                        }
                    }
                });
            });
        };

        vm.init();

    }
})();