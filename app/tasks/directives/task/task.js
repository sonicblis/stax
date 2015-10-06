app.directive('task', ['objectiveProvider', 'taskProvider', function(objectiveProvider, taskProvider){
    return{
        restrict: 'E',
        templateUrl: 'app/Tasks/directives/task/task.html',
        controller: ['$scope', function($scope){
            $scope.toggleComplete = function(task){
                objectiveProvider.updateTaskCompletion(task);
            };
            $scope.clientRect = {};
            $scope.selectTask = function(task){
                taskProvider.setSelectedTask(taskProvider.selectedTask == task ? {} : task, $scope.clientRect);
            }
        }],
        link: function(scope, el){
            var rect = el[0].getBoundingClientRect();
            scope.clientRect = rect;
        }
    }
}]);