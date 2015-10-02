app.directive("addField", ['$timeout', function($timeout){
    return {
        restrict: 'A',
        link: function($scope, $el, $attrs){
            var input = angular.element('<input class="dynamic-field" type="text" />');
            var saveButton = angular.element('<button class="dynamic-field-save-button"><i class="fa fa-save"></i></button>');
            var elWidth = $el[0].offsetWidth;
            var elHeight = $el[0].offsetHeight;
            var style = 'height: ' + (elHeight - 2) + 'px; top: -1px; right:' + elWidth + 'px;';

            function cleanup(){
                input.removeClass('show');
                input.val('');
                saveButton.removeClass('show');
            }

            input.attr('style', style);
            input.bind('blur', function(){
                cleanup();
            });
            input.bind('keypress', function($event){
                if ($event.which == 13){
                    var func = $scope[$attrs.onAdd.replace(/\([^\)]*\)/,'')];
                    func(input.val());
                    cleanup();
                }
            });
            $el.bind('click', function(){
                saveButton.addClass('show');
                input.addClass('show');
                $timeout(function(){
                    $el.find('input')[0].focus();
                }, 100);
            });
            $el.append(input);
            $el.append(saveButton);
        }
    }
}]);
