app.service("objectiveProvider", ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray){
    var _this = this;
    var keyChain = 'objectiveRoot';
    this.currentObjective = {};
    this.subObjectives = undefined;
    this.parentObjectives = [];
    this.objectiveTasks = undefined;

    // private functions
    function getFirstCharactersOfFirstTwoWords(name){
        var parts = name.split(' ');
        return parts[0].substring(0,1) + parts[1].substring(0,1);
    };
    function removeTrackedParents(keyChainOverwrite) {
        var selectedParent = _this.parentObjectives.find(function (parentObjective) {
            return parentObjective.key === keyChainOverwrite;
        });
        _this.parentObjectives.splice(_this.parentObjectives.indexOf(selectedParent), _this.parentObjectives.length);
    }
    function ensureRoot(){
        _this.currentObjective.$loaded(
            function(root){
                if (!root.name) {
                    _this.currentObjective.name = "Root";
                    _this.currentObjective.$save();
                }
            }
        );
    }

    // types
    this.objective = function(name, successDescription){
        this.name = name;
        this.abbreviation = (name.indexOf(' ') > -1) ? getFirstCharactersOfFirstTwoWords(name) : name.substring(0,2);
        this.successDescription = successDescription;
    };
    this.task = function(name){
        this.name = name;
    };

    // api
    this.loadObjective = function(objectiveKey, keyChainOverwrite){
        if (keyChainOverwrite){
            keyChain = keyChainOverwrite;
            removeTrackedParents(keyChain);
        }
        else if (keyChain.indexOf(objectiveKey) == -1){
            if (_this.currentObjective);
            _this.parentObjectives.push({key: keyChain, objective: _this.currentObjective});
            keyChain += '/subObjectives/' + objectiveKey;
        }
        var objective = new Firebase('https://stax.firebaseio.com/' + keyChain);
        _this.currentObjective = $firebaseObject(objective);
        if (objectiveKey === 'objectiveRoot'){
            ensureRoot();
        }
        _this.subObjectives = $firebaseArray(objective.child('subObjectives'));
        _this.objectiveTasks = $firebaseArray(objective.child('tasks'));

    }
    this.getKey = function(objective){
        return _this.subObjectives.$keyAt(objective);
    };
    this.addSubObjective = function(name, successDescription){
        var newSubObjective = _this.subObjectives.$add(new _this.objective(name, successDescription || null));
        return newSubObjective.$id;
    };
    this.addTask = function(name){
        var newTask = _this.objectiveTasks.$add((new task(name)));
        return newTask.$id;
    };

    //init
    this.loadObjective(keyChain);
}]);