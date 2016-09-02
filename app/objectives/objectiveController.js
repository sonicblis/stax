app.controller("objectiveListController", ['$scope', 'objectiveProvider', '$rootScope', function($scope, objectiveProvider, $rootScope){
    $scope.objective = [];
    objectiveProvider.objectiveProvided(function(objective, tasks, subObjectives, collaborators, legendItems){
        $scope.objective = objective;
        $scope.tasks = tasks;
        $scope.subObjectives = subObjectives;
        $scope.collaborators = collaborators;
        if (!$scope.legend){
            $scope.legend = legendItems;
        }
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
    $scope.saveLegend = function(){
        $scope.legend.$save();
    };
    $scope.updateObjective = function(objective){
        objectiveProvider.updateObjective(objective);
    };
    $scope.legendSortOptions = {
        stop: function(){
            var i = 0;
            $scope.legend.forEach(function(legendItem){
                legendItem.$priority = i++;
                $scope.legend.$save(legendItem);
            });
        },
        axis: 'y',
        handle: 'img'
    };
    $scope.childObjectiveSortOptions = {
        stop: function(e, ui){
            var i = 0;
            $scope.subObjectives.forEach(function(subObjective){
                subObjective.$priority = i++;
                $scope.subObjectives.$save(subObjective);
            });
        },
        axis: 'y'
    };
    $scope.updateCollaboratorStatus = function(collaborator, status){
        objectiveProvider.setCollaboratorStatus(collaborator, status);
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