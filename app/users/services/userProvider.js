app.service("userProvider", ['$rootScope', '$firebaseObject', '$firebaseArray', '$injector', function($rootScope, $firebaseObject, $firebaseArray, $injector){
    //local
    var _this = this;
    var currentUser = {authenticated: false};
    var ref = new Firebase("https://stax.firebaseio.com");
    var user = function(authData){
        this.name = authData.google.displayName;
        this.id = authData.google.id;
        this.icon = authData.google.profileImageURL;
        this.authenticated = true;
    }
    $rootScope.logout = function(){
        _this.logout();
    }
    function loadUserData(auth){
        currentUser = $firebaseObject(ref.child('users').child(auth.google.id));
        _this.workspaces = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaces'));
        _this.workspaceData = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaceData'));
        _this.invitationList = $firebaseArray(ref.child('invitations'));
        if (sessionStorage.loadedWorkspace)
        {
            var objectiveProvider = $injector.get("objectiveProvider");
            objectiveProvider.loadWorkspaceObjective(sessionStorage.loadedWorkspace);
        }
        $rootScope.user = currentUser;
    };
    function addUser(user){
        _this.accounts.$loaded().then(function(){
            if (!_this.accounts[user.id]) {
                _this.accounts[user.id] = user;
                _this.accounts.$save();
            }
        });
    };

    //exposed
    this.workspaces = [];
    this.workspaceData = [];
    this.invitationList = [];
    this.addInvitation = function(email, key){

        _this.invitationList.$add({email: email, key: key, invitedOn: new Date().getTime()});
        var objectiveProvider = $injector.get("objectiveProvider");
        objectiveProvider.collaborators.$add({email: email, invitedOn: new Date().getTime(), status: 'pending'});
    };
    this.logout = function(){
        ref.unauth();
        _this.currentUser = null;
        $rootScope.workspaceLoaded = false;
    };
    this.auth = function(){
        var auth = ref.getAuth();
        if (auth) {
            loadUserData(auth);
        }
        else{
            ref.authWithOAuthPopup("google", function (error, auth) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    loadUserData(auth);
                    addUser(new user(auth));
                }
            });
        }
    };
    this.accounts = $firebaseObject(ref.child('accounts'));
    this.getUser = function(){
        return currentUser;
    };
}]);
