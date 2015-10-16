app.controller("objectiveListController", ['$scope', 'objectiveProvider', '$rootScope', function($scope, objectiveProvider, $rootScope){
    objectiveProvider.objectiveProvided(function(objective, tasks, subObjectives){
        $scope.objective = objective;
        $scope.tasks = tasks;
        $scope.subObjectives = subObjectives;
    });
    $scope.adding = false;
    $scope.addNewSubObjective = objectiveProvider.addSubObjective;
    $scope.parentObjectives = objectiveProvider.parentObjectives;
    $scope.loadObjective = function(key){
        objectiveProvider.loadObjective(key);
    };
    $scope.loadObjective = function(objective){
        objectiveProvider.loadObjective(objective);
    };
    $scope.updateObjective = function(objective){
        objectiveProvider.updateObjective(objective);
    };
    $scope.togglePublic = function(objective){
        objective.public = !objective.public;
        objectiveProvider.updateObjective(objective);
    };
    $scope.deleteObjective = function(){
        objectiveProvider.removeObjective($scope.objective.$id);
        $rootScope.objectiveLoaded = false;
    };
}]);