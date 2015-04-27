(function () {
    'use strict';

    angular.module('app').controller('tvCtrl', ['$http', TV]);
    function TV($http) {
        var vm = this;
        const KEY = '?api_key=1b1497adc03fb28cf8df7fa0cdaed980';
        const CONFIG_URL = 'https://api.themoviedb.org/3/discover/tv'+KEY+'&page=';
        const CONFIG_DESC = 'https://api.themoviedb.org/3/tv/';
        const CONFIG_SEARCH = 'http://api.themoviedb.org/3/search/tv'  + KEY +  '&page=';

       var $search = $('#search');
        $search.keypress(function (e) {
            console.log('ok');
            if (e.keyCode == 13) {
                loadData();
                vm.page = 1;
            }
        });

        vm.init = function () {
            vm.page = 1;
            vm.maxPage = 1;
            vm.tv = [];
            loadData();
        };

        vm.searchFilter = function (input) {
            if (input) {
                return input.name.indexOf(vm.search) >= 0;
            }
            return true;

        };

        function loadData() {
            var search = $search.val();
            if (search != '' && typeof search === 'string' && search.length < 64 ) {
                $http.get(CONFIG_SEARCH + vm.page + '&query='+search).success(function (data) {
                    vm.tv = data.results;
                    vm.maxPage = data.total_pages;
                    vm.page = data.page;
                    vm.totalResults = data.total_results;
                });
                 return;
            }
            $http.get(CONFIG_URL + vm.page).success(function (data) {
                    vm.tv = data.results;
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

        vm.getPosterBig = function (url) {
            if (url === null) {
                return '';
            }
            return 'http://image.tmdb.org/t/p/w500/' + url;
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

        // https://api.themoviedb.org/3/tv/12?api_key=1b1497adc03fb28cf8df7fa0cdaed980
        vm.getMoreInfo = function getMoreInfo(id) {
            $http.get(CONFIG_DESC + id + KEY).success(function (data) {
                vm.overview = data.overview;
                vm.tagline = data.tagline;
            });
        };

        vm.init();
    }
})();