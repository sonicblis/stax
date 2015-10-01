app.service("userProvider", ['$firebaseObject', function($firebaseObject){
    var _this = this;
    var ref = new Firebase("https://stax.firebaseio.com/users");
    var user = {
        name: '',
        id: '',
        icon: '',
        authenticated: false
    };
    this.users = $firebaseObject(ref);
    this.getUser = function(){
        return user;
    };
    this.setUserInfo = function(name, id, icon, authenticated){
        var user = {};
        user.name = name;
        user.id = id;
        user.icon = icon;
        user.authenticated = authenticated;
        _this.users.$loaded().then(function(){
            _this.users[id] = user;
            _this.users.$save();
        });
        _this.user = user;
    };
}]);
