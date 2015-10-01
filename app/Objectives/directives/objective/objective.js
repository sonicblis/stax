app.directive("objective", ['objectiveProvider', function(objectiveProvider){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            ngModel: '='
        },
        templateUrl: 'app/Objectives/directives/objective/objectiveTemplate.html',
        controller: ['$scope', function($scope){

        }]
    }
}]);