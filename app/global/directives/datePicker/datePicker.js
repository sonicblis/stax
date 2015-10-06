app.directive("datePicker", ['$compile', function ($compile) {
    var cal_days_labels = ['S','M','T','W','T','F','S'];
    var cal_months_labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var currentDate = new Date();
    var today = currentDate.getDate();
    var thisMonth = currentDate.getMonth();
    var thisYear = currentDate.getFullYear();
    var currentDisplayMonth;

    var getCalHTML = function(displayMonth, displayYear)
    {
        var displayDate = new Date(displayYear + '/' + displayMonth + '/' + today);
        currentDisplayMonth = displayDate;
        var firstDay = new Date(displayYear, displayMonth, 1);
        var startingDay = firstDay.getDay();
        var prevMonth = (displayMonth == 0) ? 12 : displayMonth - 1;
        var prevYear = (displayMonth == 0) ? displayYear - 1 : displayYear;
        var nextMonth = (displayMonth == 11) ? 0 : displayMonth + 1;
        var nextYear = (displayMonth == 11) ? displayYear + 1 : displayYear;

        var monthLength = cal_days_in_month[displayMonth];

        if (displayMonth == 1) {
            if((displayYear % 4 == 0 && displayYear % 100 != 0) || displayYear % 400 == 0){
                monthLength = 29;
            }
        }

        var monthName = cal_months_labels[displayMonth]
        var html = '<table class="calendar-table">';
        html += '<tr><th colspan="7">';
        html += '<span class="prevmonth clickable" ng-click="changeMonth(' + prevMonth + ',' + prevYear + ')"><</span>&nbsp;';
        html += monthName + '&nbsp;' + displayYear;
        html += '<span class="nextmonth clickable" ng-click="changeMonth(' + nextMonth + ',' + nextYear + ')">&nbsp;></span>';
        html += '</th></tr>';
        html += '<tr class="calendar-header">';
        for(var i = 0; i <= 6; i++ ){
            html += '<td class="calendar-header-day">';
            html += cal_days_labels[i];
            html += '</td>';
        }
        html += '</tr><tr>';

        var dayRendering = 1;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j <= 6; j++) {
                var dayclass = (dayRendering == today &&
                thisMonth == displayMonth &&
                thisYear == displayYear) ? 'calendar-today' : 'calendar-day';
                dayclass = (dayRendering < today &&
                thisMonth == displayMonth &&
                thisYear == displayYear) ? 'calendar-passedday' : dayclass;
                html += '<td ';
                html += 'class="' + dayclass + '" ';
                html += 'ng-click="setSelectedDate(' + (displayMonth+1) + ',' + dayRendering + ',' + displayYear + ');"';
                if (dayRendering <= monthLength && (i > 0 || j >= startingDay)) {
                    html += 'ng-class="{selectedDay:dateFromString.getDate() == ' + dayRendering + ' && dateFromString.getMonth() == ' + displayMonth + '}" >';
                    html += dayRendering;
                    dayRendering++;
                }
                else html+= '>';
                html += '</td>';
            }

            if (dayRendering > monthLength) break;
            else html += '</tr><tr>';
        }
        html += '</tr></table>';
        return html;
    }
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            dateSelected: '&'
        },
        template: getCalHTML(new Date().getMonth(), new Date().getFullYear()),
        link: function(scope, element, attrs){
            scope.dateFromString;
            scope.$watch('ngModel', function(newValue, oldValue) {
                if (newValue)
                {
                    scope.dateFromString = new Date(newValue);
                    if (scope.dateFromString.getMonth() - 1 != currentDisplayMonth.getMonth() || scope.dateFromString.getFullYear() != currentDisplayMonth.getFullYear())
                    {
                        scope.changeMonth(scope.dateFromString.getMonth(), scope.dateFromString.getFullYear());
                    }
                }
            });
            scope.setSelectedDate = function(month, day, year)
            {
                if ((day >= today || month > (thisMonth + 1)) || year > thisYear)
                {
                    scope.ngModel = new Date(month + "/" + day + "/" + year).getTime();
                    scope.dateSelected();
                }
            };
            scope.changeMonth = function(month, year){
                if (month >= thisMonth || year > thisYear)
                {
                    var compiled = $compile(getCalHTML(month, year))(scope);
                    var table = element.find('table');
                    table.replaceWith(compiled);
                    //table = compiled;
                }
            }
        }
    }
}]);
