var app = angular.module("stax",["firebase"]);
app.run(['userProvider', function(userProvider){
    userProvider.auth();
}]);