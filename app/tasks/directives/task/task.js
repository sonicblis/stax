app.directive('task', ['objectiveProvider', 'taskProvider', function(objectiveProvider, taskProvider){
    return{
        restrict: 'E',
        templateUrl: 'app/tasks/directives/task/task.html',
        controller: ['$scope', function($scope){
            $scope.save = function(task){
                objectiveProvider.updateTask(task);
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