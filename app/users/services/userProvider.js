app.service("userProvider", ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray){
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
    function addUser(user){
        _this.users.$loaded().then(function(){
            var existingUser = _this.users.find(function(existingUser){
                return existingUser.id == user.id
            });
            if (!existingUser) {
                _this.users[id] = user;
                _this.users.$save();
            }
        });
    };

    //exposed
    this.workspaces = [];
    this.workspaceData = [];
    this.auth = function(){
        var auth = ref.getAuth();
        if (auth) {
            currentUser = $firebaseObject(ref.child('users').child(auth.google.id));
            _this.workspaces = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaces'));
            _this.workspaceData = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaceData'));
        }
        else{
            ref.authWithOAuthPopup("google", function (error, auth) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    currentUser = $firebaseObject(ref.child('users').child(auth.google.id));
                    _this.workspaces = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaces'));
                    _this.workspaceData = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaceData'));
                    addUser(new user(auth));
                }
            });
        }
    };
    this.users = $firebaseObject(ref.child('users'));
    this.getUser = function(){
        return currentUser;
    };
}]);
