app.service('taskProvider', ['objectiveProvider', function(objectiveProvider){
    var _this = this;
    var delegates = [];
    var selectedTask;

    this.onTaskSelected = function(delegate){
        delegates.push(delegate);
    };
    this.taskSelected = function(task, e){
        selectedTask = task;
        delegates.forEach(function(delegate){
            delegate(task, e);
        });
    };
    this.setSelectedTask = function(task, e){
        _this.taskSelected(task, e);
    };
    this.saveSelectedTask = function(){
        objectiveProvider.objectiveTasks.$save(selectedTask);
    };
    this.deleteSelectedTask = function(){
        objectiveProvider.objectiveTasks.$remove(selectedTask);
    }
}]);
