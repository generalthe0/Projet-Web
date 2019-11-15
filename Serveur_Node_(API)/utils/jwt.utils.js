// Imports

var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '415km64fboui4848tiuhc82za1d0x0vztra2ty215czaze9d'

// Exported function

module.exports = {
    generateTokenForUser: function(userID, userStatus) {
        return jwt.sign({
            userID,
            isAdmin: userStatus
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer', '') : null;
    },
    getUserID: function(authorization) {
        var userID_check = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null)
                    userID_check = jwtToken.userID;
                } catch(err) { }
            }
            return userID_check;
        }
}
