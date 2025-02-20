
// Let's give the beginner testers a little challenge.
function validateToken(token) {

    if (!token) {
        return true;
    }

    // Header, Payload and Signature [Valid Token]
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        return true;
    }

    if (tokenParts.some(part => part.length <= 20)) {
        return true;
    } else {
        // valid Token
        return false;
    }
}

export default validateToken
