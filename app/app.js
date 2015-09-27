var app = angular.module("stax",["firebase"]);
app.run(['userProvider', function(userProvider){
    var ref = new Firebase("https://stax.firebaseio.com");
    var auth = ref.getAuth();
    if (!auth) {
        ref.authWithOAuthPopup("google", function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                auth = authData;
            }
        });
    }
    if (auth) {
        userProvider.setUserInfo(auth.google.displayName, auth.google.id, auth.google.profileImageURL, true);
    }
}]);