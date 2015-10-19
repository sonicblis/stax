app.service("objectiveProvider", ['$firebaseObject', '$firebaseArray', '$q', '$rootScope', function($firebaseObject, $firebaseArray, $q, $rootScope) {
    var _this = this;
    var objectiveLoadedDelegates = [];
    var objectivesLoadedDelegates = [];
    var rootRef = new Firebase('https://stax.firebaseio.com');
    var ref = rootRef.child('objectives');
    var collaboratorRecord = {};

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
            _this.collaborators.length = 0;
            _this.collaborators.push($firebaseObject(rootRef.child('accounts').child(objective.owner)));
        }
        if (_this.currentObjective){ //an objective has already been loaded, so this is a child or a parent

            // create a record of what collaborators were added from all parents at this level to remove anyone added later
            //if a parent is selected
            collaboratorRecord[_this.currentObjective.$id] = _this.collaborators.map(function(collaborator){return collaborator.$id;});

            //check if parent
            var parentIndex = _this.parentObjectives.indexOf(objective);
            if (parentIndex > -1) { //this is a parent, we need to remove any collaborators added from children
                _this.parentObjectives.splice(parentIndex);
                _this.collaborators = _this.collaborators.filter(function(collaborator){
                    var collaboratorKeyArray = collaboratorRecord[objective.$id];
                    var keyInRecord = collaboratorKeyArray.find(function(key){
                        return key == collaborator.$id;
                    });
                    return (keyInRecord);
                });
            }
            else //this is a child, okay to add collaborators to the list
            {
                _this.parentObjectives.push(_this.currentObjective);
            }
        }
        else if (!clearPrevious && objective && objective.owner) {
            _this.collaborators.push($firebaseObject(rootRef.child('accounts').child(objective.owner)));
        }
        _this.currentObjective = objective;
        _this.objectiveTasks = $firebaseArray(rootRef.child('objectiveTasks').child(objective.$id));
        _this.subObjectives = $firebaseArray(ref.orderByChild('parent').equalTo(objective.$id));
        ref.child(objective.$id).child('collaborators').on('child_added', function(collaborator){
            var _collaborator = _this.collaborators.find(function(existingCollaborator){return existingCollaborator.$id == collaborator.key()});
            if (!_collaborator) {
                var firebaseCollaborator = $firebaseObject(rootRef.child('accounts').child(collaborator.key()))
                firebaseCollaborator.$loaded(function(){firebaseCollaborator.objectiveKey = objective.$id;});
                _this.collaborators.push(firebaseCollaborator);
            }
        });
        ref.child(objective.$id).child('collaborators').on('child_removed', function(collaborator){
            var _collaborator = _this.collaborators.find(function(existingCollaborator){return existingCollaborator.key() == collaborator.key()});
            _this.collaborators.splice(_this.collaborators.indexOf(_collaborator), 1);
        });
        objectiveLoadedDelegates.forEach(function(delegate){
            delegate(_this.currentObjective, _this.objectiveTasks, _this.subObjectives, _this.collaborators);
        });
        $rootScope.objectiveLoaded = true;
    };
    this.loadObjectiveFromKey = function(key){
        $firebaseObject(ref.child(key)).$loaded(
            function(objective){
                _this.loadObjective(objective, true);
            }
        );
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
    this.setCollaboratorStatus = function(collaborator, status){
        var updates = {};
        updates['accounts/' + collaborator.$id + '/collaborating/' + collaborator.objectiveKey + '/status'] = status;
        updates['objectives/' + collaborator.objectiveKey + '/collaborators/' + collaborator.$id + '/status'] = status;
        rootRef.update(updates);
    };
}]);