app.service("objectiveProvider", ['$firebaseObject', function($firebaseObject){
    var _that = this;
    var ref = new Firebase("https://stax.firebaseio.net/objectives");
    this.objectiveRoot = $firebaseObject(ref);
    if (this.objectiveRoot.name == null){
        this.objectiveRoot.name = 'Root';
        this.successDescription = '';
        this.subObjectives = [];
        this.tasks = [];
        this.addSubObjective = function(objective){
            _this.subObjectives.push(objective);
        }
    }
    var objective = function(name, successDescription){
        var _this = this;
        this.name = name;
        this.successDescription = successDescription;
        this.subObjectives = [];
        this.tasks = [];
        this.addSubObjective = function(objective){
            _this.subObjectives.push(objective);
        }
    };
    this.addSubObjective = function(name, successDescription){
        _that.objectives.push(new objective(name, successDescription));
    }
}]);