app.directive("slidePanel", [function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/global/directives/slidePanel/slidePanel.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {
            $scope.collapsed = !($scope.$eval($attr.expanded)) || true;
        }
    }
}]);