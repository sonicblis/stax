app.directive('task', ['objectiveProvider', function(objectiveProvider){
    return{
        restrict: 'E',
        templateUrl: 'app/Tasks/directives/task/task.html',
        controller: ['$scope', function($scope){
            $scope.toggleComplete = function(task){
                objectiveProvider.updateTaskCompletion(task);
            }
        }]
    }
}]);