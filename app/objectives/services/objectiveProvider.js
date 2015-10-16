app.service("objectiveProvider", ['$firebaseObject', '$firebaseArray', '$q', '$rootScope', function($firebaseObject, $firebaseArray, $q, $rootScope) {
    var _this = this;
    var objectiveLoadedDelegates = [];
    var objectivesLoadedDelegates = [];
    var rootRef = new Firebase('https://stax.firebaseio.com');
    var ref = rootRef.child('objectives');

    this.currentRef = null;
    this.currentObjective = null;
    this.subObjectives = [];
    this.parentObjectives = [];
    this.collaborators = [];
    this.objectiveTasks = [];

    // private functions
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
    this.objectiveProvided = function(delegate){
        objectiveLoadedDelegates.push(delegate);
    };
    this.objectivesProvided = function(delegate){
        objectivesLoadedDelegates.push(delegate);
        if (_this.userObjectives){
            delegate(_this.userObjectives);
        }
    };

    this.addObjective = function(name){
        var newObjective = ref.push();
        var objectiveKey = newObjective.key();
        var updates = {};
        updates['objectives/' + objectiveKey] = {name: name, owner: $rootScope.user.id};
        rootRef.update(updates);
    };
    this.loadObjectivesForUser = function(){
        var userObjectivesRef = rootRef.child('objectives').orderByChild('owner').equalTo($rootScope.user.id);
        var publicObjectivesRef = rootRef.child('objectives').orderByChild('public').equalTo(true);
        _this.userObjectives = $firebaseArray(userObjectivesRef);
        var publicObjectives = $firebaseArray(publicObjectivesRef);
        objectivesLoadedDelegates.forEach(function(delegate){
            delegate(_this.userObjectives, publicObjectives);
        });
    };
    this.addSubObjective = function (name) {
        _this.subObjectives.$add({name: name, parent: _this.currentObjective.$id});
    };
    this.removeObjective = function(key){
        var updates = {};
        updates['accounts/' + $rootScope.user.id + '/objectives/' + key] = null;
        updates['objectives/' + key] = null;
        updates['objectiveInfo/' + key] = null;
        rootRef.update(updates);
    };
    this.loadObjective = function (objective, clearPrevious) {
        if (clearPrevious){
            _this.currentObjective = null;
            _this.parentObjectives.length = 0;
        }
        if (_this.currentObjective){ //an objective has already been loaded, so this is a child or a parent
            //check if parent
            var parentIndex = _this.parentObjectives.indexOf(objective);
            if (parentIndex > -1) { //this is a parent
                _this.parentObjectives.splice(parentIndex);
            }
            else //this is a child
            {
                _this.parentObjectives.push(_this.currentObjective);
            }
        }
        _this.currentObjective = objective;
        _this.objectiveTasks = $firebaseArray(rootRef.child('objectiveTasks').child(objective.$id));
        _this.subObjectives = $firebaseArray(rootRef.child('objectives').orderByChild('parent').equalTo(objective.$id));
        objectiveLoadedDelegates.forEach(function(delegate){
            delegate(_this.currentObjective, _this.objectiveTasks, _this.subObjectives);
        });
    };
    this.updateObjective = function(objective){
        ref.child(objective.$id).update({name: objective.name, public: objective.public});
    };
    this.addTask = function (name) {
        var newTask = _this.objectiveTasks.$add((new _this.task(name)));
        //updateCurrentObjectiveProgress();
        return newTask.$id;
    };
    this.updateTask = function (task) {
        _this.objectiveTasks.$save(task);
        updateCurrentObjectiveProgress();
    };
    this.addCollaborationRequestFromCurrentUser = function(objective){
        var deferred = $q.defer()
        var updates = {};
        updates['objectives/' + objective.$id + '/collaborators/' + $rootScope.user.id] = {status: 'pending'};
        updates['accounts/' + $rootScope.user.id + "/collaborating/" + objective.$id] = {status: 'pending'};
        rootRef.update(updates, deferred.resolve());
        return deferred.promise;
    };
    this.clearUserData = function(){
        _this.currentObjective = null;
        _this.userObjectives.length = 0;
        _this.objectiveTasks.length = 0;
        _this.subObjectives.length = 0;
        _this.parentObjectives.length = 0;
    }
}]);