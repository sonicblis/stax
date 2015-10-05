app.directive('progressbar', function(){
    return {
        restrict: 'E',
        scope:{
            progress: '='
        },
        templateUrl: 'app/global/directives/progressBar/progressBar.html',
        controller: ['$scope', function($scope){
            if (!$scope.progress){
                $scope.progress = 0;
            }
        }]
    }
});
