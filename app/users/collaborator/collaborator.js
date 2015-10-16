app.directive("collaborator", [function () {
    return {
        restrict: 'E',
        scope: {
            user: '=ngModel',
            onStatusChange: '&'
        },
        templateUrl: 'app/users/collaborator/collaborator.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);