app.directive("objective", ['objectiveProvider', function(objectiveProvider){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            objective: '=ngModel',
            collapsed: '@',
            onUpdate: '&'
        },
        templateUrl: 'app/Objectives/directives/objective/objectiveTemplate.html',
        controller: ['$scope', function($scope){

        }],
        link: function($scope, $el, $attr){
            $scope.collapsed = $attr.collapsed;
            if ($scope.collapsed){
                $el.addClass('collapsed');
            }
        }
    }
}]);