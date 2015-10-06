app.directive("weightPicker", function () {
    return {
        restrict: 'E',
        scope: {
            weight: '=ngModel'
        },
        templateUrl: 'app/global/directives/weightPicker/weightPicker.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {

        }
    }
});