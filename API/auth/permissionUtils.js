/**
 * Indicates whether the access token was issued to a user or an application.
 * @param {Object} accessTokenPayload 
 * @returns {boolean}
 */
const isAppOnlyToken = (accessTokenPayload) => {
     if (!accessTokenPayload.hasOwnProperty('idtyp')) {
        if (accessTokenPayload.hasOwnProperty('scp')) {
            return false;
        } else if (!accessTokenPayload.hasOwnProperty('scp') && accessTokenPayload.hasOwnProperty('roles')) {
            return true;
        }
    }

    return accessTokenPayload.idtyp === 'app';
};

/**
 * Ensures that the access token has the specified delegated permissions.
 * @param {Object} accessTokenPayload: Parsed access token payload
 * @param {Array} requiredPermission: list of required permissions
 * @returns {boolean}
 */
 const hasRequiredDelegatedPermissions = (accessTokenPayload, requiredPermission) => {
    const normalizedRequiredPermissions = requiredPermission.map(permission => permission.toUpperCase());

    if (accessTokenPayload.hasOwnProperty('scp') && accessTokenPayload.scp.split(' ')
        .some(claim => normalizedRequiredPermissions.includes(claim.toUpperCase()))) {
        return true;
    }

    return false;
}

/**
 * Ensures that the access token has the specified application permissions.
 * @param {Object} accessTokenPayload: Parsed access token payload
 * @param {Array} requiredPermission: list of required permissions
 * @returns {boolean}
 */
const hasRequiredApplicationPermissions = (accessTokenPayload, requiredPermission) => {
    const normalizedRequiredPermissions = requiredPermission.map(permission => permission.toUpperCase());

    if (accessTokenPayload.hasOwnProperty('roles') && accessTokenPayload.roles
        .some(claim => normalizedRequiredPermissions.includes(claim.toUpperCase()))) {
        return true;
    }

    return false;
}

module.exports = {
    isAppOnlyToken,
    hasRequiredDelegatedPermissions,
    hasRequiredApplicationPermissions,
}
