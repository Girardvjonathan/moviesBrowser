/**
 * Created by jgirard-viau on 2/4/15.
 */
(function () {
    angular.module('shared').directive('myPagination', Pagination);
    function Pagination(){
        return {
            restrict: 'E',
            transclude: false,
            scope: {
                page: '=',
                maxPage: '=',
                onChange: '&'
            },
            link: function (scope) {
                var adjust = function () {
                    if (scope.page < 3) {
                        scope.pageNumber1 = 1;
                        scope.pageNumber2 = 2;

                        scope.pageNumber3 = 3;
                        scope.pageNumber4 = 4;
                        scope.pageNumber5 = 5;
                    }
                    else if (scope.page > scope.maxPage - 2) {
                        scope.pageNumber1 = scope.maxPage - 4;
                        scope.pageNumber2 = scope.maxPage - 3;
                        scope.pageNumber3 = scope.maxPage - 2;
                        scope.pageNumber4 = scope.maxPage - 1;
                        scope.pageNumber5 = scope.maxPage;
                    }
                    else {
                        scope.pageNumber1 = scope.page - 2;
                        scope.pageNumber2 = scope.page - 1;
                        scope.pageNumber3 = scope.page;
                        scope.pageNumber4 = scope.page + 1;
                        scope.pageNumber5 = scope.page + 2;
                    }
                };
                adjust();
                scope.$watch('page', adjust);
            },
            templateUrl: 'assets/partials/shared/pagination/pagination.tpl.html',
            replace: true
        };
    }
})();