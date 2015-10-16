app.controller("ObjectiveListController", ['$scope', 'userProvider', 'objectiveProvider', '$rootScope', function($scope, userProvider, objectiveProvider, $rootScope){
    $scope.objectives = [];
    $scope.publicObjectives = [];
    $scope.collaborations = userProvider.collaborations;
    objectiveProvider.objectivesProvided(function(usersObjectives, publicObjectives){
        $scope.objectives = usersObjectives;
        $scope.publicObjectives = publicObjectives;
        $scope.publicObjectives.$loaded(function(){
            $scope.$watch('publicObjectives', $scope.modifyPublicObjectives);
            $scope.$watch('collaborations', $scope.modifyPublicObjectives, true);
        })
    });
    $scope.modifyPublicObjectives = function(){
        $scope.publicObjectives.forEach(function(objective){
            if ($rootScope.user.collaborating && $rootScope.user.collaborating[objective.$id]) {
                objective.requested = true;
                objective.status = $rootScope.user.collaborating[objective.$id].status;
            }
            else{
                delete objective.requested;
                delete objective.status;
            }
        });
    };
    $scope.newObjectiveName = '';
    $scope.addObjective = function(){
        objectiveProvider.addObjective($scope.newObjectiveName);
        $scope.newObjectiveName = '';
        $scope.adding = false;
    };
    $scope.key = function(event){
        if (event.which == 13){
            $scope.addObjective();
        }
    };
    $scope.loadObjective = function(objective){
        objectiveProvider.loadObjective(objective, true);
        sessionStorage.loadedObjective = objective.$id;
        $rootScope.objectiveLoaded = true;
    }
    $scope.requestAccessTo = function(objective){
        objectiveProvider.addCollaborationRequestFromCurrentUser(objective).then(function() {
            $scope.modifyPublicObjectives();
        });
    };
}]);