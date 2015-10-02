app.controller("objectiveListController", ['$scope', 'objectiveProvider', function($scope, objectiveProvider){
    objectiveProvider.currentObjective.$bindTo($scope, 'objective');
    $scope.adding = false;
    $scope.addNewSubObjective = function(name){
        objectiveProvider.addSubObjective(name,'');
        $scope.adding = false;
    }
}]);