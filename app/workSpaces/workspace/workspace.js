app.directive("workspace", [function () {
    return {
        restrict: 'E',
        scope: {
            workspace: '=ngModel'
        },
        templateUrl: 'app/workSpaces/workspace/workspace.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);
