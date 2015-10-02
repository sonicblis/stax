app.controller("objectiveListController", ['$scope', 'objectiveProvider', function($scope, objectiveProvider){
    objectiveProvider.currentObjective.$bindTo($scope, 'objective');
    $scope.addNewSubObjective = function(){
        objectiveProvider.addSubObjective('','');
    }
}]);