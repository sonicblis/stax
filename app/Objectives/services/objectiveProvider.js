app.service("objectiveProvider", ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray){
    var _this = this;
    var ref = new Firebase("https://stax.firebaseio.com/objectiveRoot");
    this.currentObjective = $firebaseObject(ref);
    this.currentObjective.$loaded(
        function(root){
            if (!root.name){
                _this.currentObjective.name = "Root";
                _this.currentObjective.$save().then(_this.loadObjective);
            }
            else{
                _this.loadObjective(ref.key());
            }
        }
    );
    this.loadObjective = function(objectiveKey){
        var objective = new Firebase('https://stax.firebaseio.com/' + objectiveKey);
        var subObjectives = objective.child('subObjectives');
        var tasks = objective.child('tasks');
        _this.objectiveSubObjectives = $firebaseArray(subObjectives);
        _this.objectiveTasks = $firebaseArray(tasks);

    }
    this.objective = function(name, successDescription){
        this.name = name;
        this.successDescription = successDescription;
    };
    this.task = function(name){
        this.name = name;
    };
    this.addSubObjective = function(name, successDescription){
        var newSubObjective = _this.objectiveSubObjectives.$add(new _this.objective(name, successDescription));
        return newSubObjective.$id;
    }
    this.addTask = function(name){
        var newTask = _this.objectiveTasks.$add((new task(name)));
        return newTask.$id;
    }
}]);