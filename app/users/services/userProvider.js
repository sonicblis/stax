app.service("userProvider", ['$rootScope', '$firebaseObject', '$firebaseArray', 'objectiveProvider', function($rootScope, $firebaseObject, $firebaseArray, objectiveProvider){
    //local
    var _this = this;
    var rootRef = new Firebase("https://stax.firebaseio.com");
    var ref = rootRef.child('accounts');
    var userRef = null;
    var userInfo = function(authData){
        this.name = authData.google.displayName;
        this.id = authData.uid;
        this.icon = authData.google.profileImageURL;
        this.authenticated = true;
    }

    $rootScope.logout = function(){
        _this.logout();
    }
    $rootScope.login = function(){
        _this.login();
    }

    function addObjective(objective){
        _this.collaboratingObjectives.push($firebaseObject(rootRef.child('objectives').child(objective.key())));
    }
    function removeObjective(objective){
        _this.collaboratingObjectives.splice(
            _this.collaboratingObjectives.indexOf(
                _this.collaboratingObjectives.find(function(c){c.$id == objective.key()}), 1
            )
        );
    }
    function loadUser(user){
        userRef = ref.child(user.uid);
        var _userInfo = new userInfo(user);
        _userInfo.lastLoggedIn = Firebase.ServerValue.TIMESTAMP;
        _this.collaborations = $firebaseArray(userRef.child('collaborating'));
        $rootScope.user = $firebaseObject(userRef);

        userRef.update(_userInfo, function(){
            objectiveProvider.loadObjectivesForUser();
            if (sessionStorage.loadedObjective) {
                objectiveProvider.loadObjectiveFromKey(sessionStorage.loadedObjective);
            }
        });

        //subscribe to approved shared workspaces and load the workspace when changes happen
        rootRef
            .child('accounts')
            .child(user.uid)
            .child('collaborating')
            .orderByChild('status')
            .equalTo('approved')
            .on('child_added', addObjective);
        rootRef
            .child('accounts')
            .child(user.uid)
            .child('collaborating')
            .orderByChild('status')
            .equalTo('approved')
            .on('child_removed', removeObjective);
    }

    //exposed
    this.collaboratingObjectives = [];
    this.logout = function(){
        ref.unauth();
        objectiveProvider.clearUserData();
        userRef.update({logout: Firebase.ServerValue.TIMESTAMP});
        $rootScope.user = {authenticated: false};
        sessionStorage.loadedObjective = null;
    };
    this.login = function(){
        rootRef.authWithOAuthPopup("google", function (error, auth) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                loadUser(auth);
            }
        });
    };
    this.checkForAuth = function(){
        var auth = ref.getAuth();
        if (auth) {
            loadUser(auth);
        }
    };
}]);
