app.directive("addField", ['$timeout', '$rootScope', function($timeout, $rootScope){
    return {
        restrict: 'A',
        link: function($scope, $el, $attrs){
            var notRendered = true;
            var widthOverride = $attrs.fieldWidth || 150;
            var heightOverride = $attrs.fieldHeight;
            //this should be dynamic
            $scope.$watch(function(){return $rootScope.objectiveLoaded;}, function(newVal){
                $timeout(function(){
                    if (newVal && notRendered){
                    var input = angular.element('<input class="dynamic-field" type="text" />');
                    var saveButton = angular.element('<button class="dynamic-field-save-button"><i class="fa fa-save"></i></button>');
                    var elWidth = $el[0].offsetWidth;
                    var elHeight = heightOverride || $el[0].offsetHeight;
                    var style = 'height: ' + (elHeight - 2) + 'px; top: -1px;'
                    switch ($attrs.addField) {
                        case 'left':
                            style += ' right:' + elWidth + 'px;'
                            break;
                        case 'right':
                            style += ' left:' + (elWidth + 1) + 'px;'
                            break;
                    }

                    function cleanup() {
                        input.removeClass('show');
                        input.val('');
                        saveButton.removeClass('show');
                        $el.attr('style', '');
                    }

                    input.attr('style', style);
                    input.bind('blur', function () {
                        cleanup();
                    });
                    input.bind('keypress', function ($event) {
                        if ($event.which == 13) {
                            var onAddFunctionName = $attrs.onAdd.replace(/\([^\)]*\)/, '');
                            var func = $scope[onAddFunctionName];
                            if (func) {
                                func(input.val());
                                input.val('');
                            }
                            else {
                                console.error("Couldn't find a function named " + onAddFunctionName + " on any scope");
                            }
                        }
                    });
                    $el.bind('click', function () {
                        $el.attr('style', 'opacity: 1;');
                        saveButton.addClass('show');
                        input.addClass('show');
                        $timeout(function () {
                            $el.find('input')[0].focus();
                        }, 250);
                    });
                    $el.append(input);
                    if ($scope.$eval($attrs.addIcon)) {
                        $el.append(saveButton);
                    }
                    notRendered = false;
                }
                }, 10);
            });
        }
    }
}]);
