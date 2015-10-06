app.directive("messageOverlay", function () {
    return {
        restrict: 'E',
        templateUrl: 'app/global/directives/messageOverlay/messageOverlay.html',
        scope: {
            message: '@',
            onOk: '&',
            onCancel: '&'
        },
        controller: ['$scope', function ($scope) {

        }],
        link: function (scope, el, attrs) {

        }
    }
});