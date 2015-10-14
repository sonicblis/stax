app.service("objectiveProvider", ['userProvider', '$firebaseObject', '$firebaseArray', '$q', '$rootScope', function(userProvider, $firebaseObject, $firebaseArray, $q, $rootScope) {
    var _this = this;
    var objectiveLoadedDelegates = [];
    var keyChain = '';
    this.currentRef = null;
    this.currentObjective = null;
    this.subObjectives = undefined;
    this.parentObjectives = [];
    this.objectiveTasks = undefined;

    // private functions
    function getFirstCharactersOfFirstTwoWords(name) {
        var parts = name.split(' ');
        return parts[0].substring(0, 1) + parts[1].substring(0, 1);
    }
    function removeTrackedParents(keyChainOverwrite) {
        var selectedParent = _this.parentObjectives.find(function (parentObjective) {
            return parentObjective.key === keyChainOverwrite;
        });
        _this.parentObjectives.splice(_this.parentObjectives.indexOf(selectedParent), _this.parentObjectives.length);
    }
    function updateCurrentObjectiveProgress() {
        var totalTasksCount = _this.objectiveTasks.length;
        if (totalTasksCount > 0) {
            var completedTasksCount = 0;
            _this.objectiveTasks.forEach(function (task) {
                if (task.completed) completedTasksCount++;
            });
            var percentComplete = completedTasksCount / totalTasksCount * 100;
            _this.currentObjective.progress = percentComplete;
            _this.currentRef.update({progress: percentComplete});
        }
    }
    function ensureParentKeys(){
        if (parentObjectives.length == 0){
            var keys = keyChain.split('/subObjectives/');
            keys.forEach(function(key){
                //I have to get the name of the parent objective.  =[
                //parentObjectives.push
            });
        }
    }

    // types
    this.objective = function (name, successDescription) {
        this.name = name;
        this.abbreviation = (name.indexOf(' ') > -1) ? getFirstCharactersOfFirstTwoWords(name) : name.substring(0, 2);
        this.successDescription = successDescription;
    };
    this.task = function (name) {
        this.text = name;
    };

    // api
    this.objectiveLoaded = function(delegate){
        objectiveLoadedDelegates.push(delegate);
    };
    this.getKeychain = function(){
        return keyChain;
    };
    this.loadObjective = function (objectiveKey, keyChainOverwrite) {
        if (keyChainOverwrite) {
            keyChain = keyChainOverwrite;
            removeTrackedParents(keyChain);
        }
        else if (keyChain.indexOf(objectiveKey) == -1) {
            if (_this.currentObjective);
            _this.parentObjectives.push({key: keyChain, objective: _this.currentObjective});
            keyChain += '/subObjectives/' + objectiveKey;
        }
        var objective = _this.currentRef = new Firebase('https://stax.firebaseio.com/' + keyChain);
        _this.currentObjective = $firebaseObject(objective);
        _this.subObjectives = $firebaseArray(objective.child('subObjectives'));
        _this.objectiveTasks = $firebaseArray(objective.child('tasks'));
        _this.collaborators = $firebaseArray(objective.child('collaborators'));
        objectiveLoadedDelegates.forEach(function(delegate){
            delegate(_this.currentObjective);
        });
    };
    this.loadWorkspaceObjective = function(key){
        if (key.indexOf('users/') == -1){
            key = 'users/' + userProvider.getUser().$id + '/workspaceData/' + key;
        }
        _this.loadObjective(0, key);
        $rootScope.workspaceLoaded = true;
    };
    this.getKey = function (objective) {
        return _this.subObjectives.$keyAt(objective);
    };
    this.addSubObjective = function (name, successDescription) {
        var newSubObjective = _this.subObjectives.$add(new _this.objective(name, successDescription || null));
        return newSubObjective.$id;
    };
    this.addTask = function (name) {
        var newTask = _this.objectiveTasks.$add((new _this.task(name)));
        updateCurrentObjectiveProgress();
        return newTask.$id;
    };
    this.updateTask = function (task) {
        _this.objectiveTasks.$save(task);
        updateCurrentObjectiveProgress();
    };
    this.removeCurrentObjective = function(){
        var deferred = $q.defer();
        _this.currentObjective.$remove().then(function(){
            _this.loadObjective(0, _this.parentObjectives[_this.parentObjectives.length - 1].key);
            deferred.resolve();
        });
        return deferred.promise;
    };
}]);