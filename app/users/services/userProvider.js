app.service("userProvider", ['$rootScope', '$firebaseObject', '$firebaseArray', 'objectiveProvider', function($rootScope, $firebaseObject, $firebaseArray, objectiveProvider){
    //local
    var _this = this;
    var ref = new Firebase("https://stax.firebaseio.com/accounts");
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

    function loadUser(user){
        userRef = ref.child(user.uid);
        var _userInfo = new userInfo(user);
        _userInfo.lastLoggedIn = Firebase.ServerValue.TIMESTAMP;
        _this.collaborations = $firebaseArray(userRef.child('collaborating'));
        $rootScope.user = $firebaseObject(userRef);

        userRef.update(_userInfo, function(){
            objectiveProvider.loadObjectivesForUser();
        });
    };

    //exposed
    this.logout = function(){
        ref.unauth();
        objectiveProvider.clearUserData();
        userRef.update({logout: Firebase.ServerValue.TIMESTAMP});
        $rootScope.user = {authenticated: false};
    };
    this.login = function(){
        ref.authWithOAuthPopup("google", function (error, auth) {
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
