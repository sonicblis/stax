app.service("objectiveProvider", function(){
    var _that = this;
    var objective = function(name, successDescription){
        var _this = this;
        this.name = name;
        this.successDescription = successDescription;
        this.subObjectives = [];
        this.addSubObjective = function(objective){
            _this.subObjectives.push(objective);
        }
    };
    this.objectives = [];
    this.addObjective = function(name, successDescription){
        _that.objectives.push(new objective(name, successDescription));
    }
});