app.directive('progressbar', function(){
    return {
        restrict: 'E',
        scope:{
            progress: '='
        },
        templateUrl: 'app/global/directives/progressBar/progressBar.html',
        controller: ['$scope', function($scope){

        }]
    }
});
