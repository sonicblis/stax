app.directive('taskInfoPanel', [function(){
    return{
        restrict: 'E',
        scope: {
            ngShow: '='
        },
        templateUrl: 'app/global/directives/taskInfoPanel/taskInfoPanel.html',
        controller: ['$scope', 'taskProvider', function($scope, taskProvider){
            taskProvider.onTaskSelected(function(task, e){
                $scope.task = task;
                $scope.top = e.top;
                $scope.left = e.left;
                $scope.height = e.height;
                $scope.ngShow = true;
            });
            $scope.save = function(){
                taskProvider.saveSelectedTask();
                $scope.ngShow = false;
            };
            $scope.delete = function(){
                taskProvider.deleteSelectedTask();
                $scope.ngShow = false;
            }
        }]
    }
}]);