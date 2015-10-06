app.controller("UserListController", ['$scope', 'userProvider', function($scope, userProvider){
    $scope.content = 'editable';
    $scope.users = userProvider.users;
}]);