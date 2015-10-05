app.controller("UserListController", ['$scope', 'userProvider', function($scope, userProvider){
    $scope.users = userProvider.users;
}]);