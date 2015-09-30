app.directive("objective", ['objectiveProvider', function(objectiveProvider){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            ngModel: '='
        },
        templateUrl: 'app/objectives/directives/objectiveTemplate.html',
        controller: ['$scope', function($scope){

        }]
    }
}]);