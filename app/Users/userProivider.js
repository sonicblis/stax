app.service("userProvider", function(){
    var _this = this;
    var user = {
        name: '',
        id: '',
        icon: '',
        authenticated: false
    };
    this.getUser = function(){
        return user;
    };
    this.setUserInfo = function(name, id, icon, authenticated){
        user.name = name;
        user.id = id;
        user.icon = icon;
        user.authenticated = authenticated;
    };
});
