app.directive("check", function(){
    return{
        restrict: 'E',
        scope: {
            checked: '=ngModel'
        },
        templateUrl: 'app/global/directives/check/check.html'
    }
});