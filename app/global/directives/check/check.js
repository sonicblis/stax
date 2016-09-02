app.directive("check", function(){
    return{
        restrict: 'E',
        scope: {
            task: '=ngModel',
            checkOptions: '=',
            checkSet: '&'
        },
        templateUrl: 'app/global/directives/check/check.html'
    }
});