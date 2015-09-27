app.controller("UserInfoController",['$scope', 'userProvider',
    function($scope, userProvider){
        $scope.user = userProvider.getUser();
    }
]);