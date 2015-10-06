var app = angular.module('stax',['firebase', 'ui.sortable', 'ngSanitize']);
app.run(['userProvider', function(userProvider){
    userProvider.auth();
}]);