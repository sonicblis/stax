app.directive("addField", function(){
    return {
        restrict: 'A',
        link: function($scope, $el, $attrs){
            var input = angular.element('<input class="dynamic-field" type="text" />');
            var elWidth = $el[0].offsetWidth;
            var elHeight = $el[0].offsetHeight;
            input.attr('style','top:0;left:' + elWidth + ';');
            $el.append(input);
        }
    }
});
