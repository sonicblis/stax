app.directive("objective", ['objectiveProvider', function(objectiveProvider){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            objective: '=ngModel',
            mode: '@',
            tasks: '=',
            onDelete: '&',
            onUpdate: '&',
            legend: '='
        },
        templateUrl: 'app/objectives/directives/objective/objective.html',
        controller: ['$scope', function($scope){
            $scope.tools = {show: false};
            $scope.taskIsSelected = false;
            $scope.addTask = function(text){
                objectiveProvider.addTask(text);
            };
            $scope.taskSortOptions = {
                stop: function(e, ui){
                    var i = 0;
                    objectiveProvider.objectiveTasks.forEach(function(task){
                        task.$priority = i++;
                        objectiveProvider.objectiveTasks.$save(task);
                    });
                },
                axis: 'y'
            }
        }],
        link: function($scope, $el, $attr){
            if ($scope.mode == 'mini'){
                $el.addClass('mini');
            }
            else if ($scope.mode == 'expanded'){
                $el.addClass('expanded');
            }
            else if ($scope.mode == 'collapsed'){
                $el.addClass('collapsed');
            }
        }
    }
}]);