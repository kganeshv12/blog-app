import JWT from 'jsonwebtoken';

const secret = "$up3rMan"

function createTokenForUser(user){
    try {
        const payload = {
            _id: user._id, 
            email: user.email, 
            profileImageURL: user.profileImageURL,
            role:user.role,
            fullName: user.fullName,
        }
    
        const token = JWT.sign(payload, secret);
        console.log("creating token successfully ", token)
        return token;
    } catch (error) {
        console.log("error from services/auth is : ", error);
    }
}

function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

export default { createTokenForUser, validateToken};

// export default createTokenForUser;
// export validateToken;