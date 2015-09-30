app.directive("user", function(){
    return {
        restrict: 'E',
        scope: {
            user: '=ngModel'
        },
        templateUrl: 'app/users/directives/userTemplate.html'
    }
});