app.directive("user", function(){
    return {
        restrict: 'E',
        scope: {
            user: '=ngModel'
        },
        templateUrl: 'app/Users/directives/userTemplate.html'
    }
});