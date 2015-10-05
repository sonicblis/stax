var app = angular.module('stax',['firebase', 'ui.sortable']);
app.run(['userProvider', function(userProvider){
    userProvider.auth();
}]);