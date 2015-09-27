app.directive("objective", ['objectiveProvider', function(objectiveProvider){
    return {
        restrict: 'E',
        scope: {
            ngModel: '='
        },
        templateUrl: 'app/objectives/objectiveTemplate.html',
        controller: ['$scope', function($scope){

        }]
    }
}]);