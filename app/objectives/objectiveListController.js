app.controller("objectiveListController", ['$scope', 'objectiveProvider', function($scope, objectiveProvider){
    $scope.objective = objectiveProvider.currentObjective;
    $scope.adding = false;
    $scope.addNewSubObjective = objectiveProvider.addSubObjective;
    $scope.parentObjectives = objectiveProvider.parentObjectives;
    $scope.loadChildObjective = function(index){
        objectiveProvider.loadObjective(objectiveProvider.getKey(index));
        $scope.objective = objectiveProvider.currentObjective;
    }
    $scope.loadParentObjective = function(key){
        objectiveProvider.loadObjective(0, key);
        $scope.objective = objectiveProvider.currentObjective;
    }
    $scope.updateObjective = function(){
        objectiveProvider.currentObjective.$save();
    }
    $scope.deleteObjective = function(){
        objectiveProvider.removeCurrentObjective().then(function(){
            $scope.objective = objectiveProvider.currentObjective;
        });
    }
}]);