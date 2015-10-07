app.controller("workSpaceController", ['$scope', 'userProvider', 'objectiveProvider', function($scope, userProvider, objectiveProvider){
    $scope.workspaces = userProvider.workspaces;
    $scope.newWorkspaceName = '';
    $scope.addWorkspace = function(){
        var workspace = {name: $scope.newWorkspaceName}
        userProvider.workspaceData.$add(workspace).then(function(addedSpace){
            workspace.key = addedSpace.key();
            $scope.workspaces.$add(workspace);
        });
    };
    $scope.key = function(event){
        if (event.which == 13){
            $scope.addWorkspace();
        }
    }
    $scope.loadWorkspace = function(key){
        objectiveProvider.loadWorkspaceRootObjective(key);
    }
}]);
