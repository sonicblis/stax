app.directive("objective", ['objectiveProvider', function(objectiveProvider){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            objective: '=ngModel',
            mode: '@',
            onUpdate: '&',
            onAddTask: '&',
            onDelete: '&',
            onComplete: '&'
        },
        templateUrl: 'app/objectives/directives/objective/objective.html',
        controller: ['$scope', function($scope){
            $scope.keyPress = function($event){
                if ($event.which == 13){
                    objectiveProvider.addTask($scope.newTaskText);
                }
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