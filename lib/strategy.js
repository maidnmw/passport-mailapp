/**
 * Module dependencies.
 */
var OAuth2Strategy = require('passport-oauth2')
    , InternalOAuthError = require('passport-oauth2').InternalOAuthError
    , util = require('util')
    , crypto = require('crypto')
    , Profile = require('passport-mailapp/lib/profile')
    , MailruAuthorizationError = require('passport-mailapp/lib/errors/mailruauthorizationerror')
    , MailruTokenError = require('passport-mailapp/lib/errors/mailrutokenerror')
    , MailruDataError = require('passport-mailapp/lib/errors/mailrudataerror');


/**
 * `Strategy` constructor.
 *
 * Mail.ru using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Mail.ru application's App ID
 *   - `clientSecret`  your Mail.ru application's App Secret
 *   - `callbackURL`   URL to which Mailru will redirect the user after granting authorization
 *   - `prompt_force`  A sign that the user must be asked for permission to access the account
 *
 * Examples:
 *
 *     passport.use(new MailruStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/mail/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://oauth.mail.ru/login';
    options.tokenURL = options.tokenURL || 'https://oauth.mail.ru/token';
    options.scopeSeparator = options.scopeSeparator || ',';
    options.prompt_force = options.prompt_force || 1;

    OAuth2Strategy.call(this, options, verify);
    this.name = 'mailapp';
    this._profileURL = options.profileURL || 'https://oauth.mail.ru/userinfo';
    this._profileFields = options.profileFields || null;
    this._clientSecret = options.clientSecret;
    this._clientID = options.clientID;
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Return extra parameters to be included in the authorization request.
 *
 * Options:
 *  - `state`         Must be 256 bits long.
 *  - `prompt_force`  A sign that the user must be asked for permission to access the account.
 *                    Mail.ru OAuth will prompt the user to allow access to the application and select an account Mail.ru.
 *                    This parameter will be ignored for any value than 1.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
    var params = {
        state: crypto.createHash('sha256').digest('hex').toString('base64'),
        prompt_force: 1
    };

    if (options.prompt_force) {
        params.prompt_force = options.prompt_force
    }
  
    return params;
};


/**
 * Retrieve user profile from Mailru.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    var url = this._profileURL;
    
    this._oauth2.getProtectedResource(url, accessToken, function (err, body, res) {
        if (err) return done(new InternalOAuthError('Failed to fetch user profile', err));

        try {
            var json = JSON.parse(body);
            if (json.error) throw new MailruDataError(json.error, json.error_description, json.error_code);

            var profile = Profile.parse(json);
            profile.provider = 'mailru';
            profile._raw = body;
            profile._json = json;

            done(null, profile);
        } catch (e) {
            done(e);
        }
    })
};

/**
 * Parse error response from Mailru OAuth 2.0 token endpoint.
 *
 * @param {string} body
 * @param {number} status
 * @return {Error}
 * @access protected
 */
Strategy.prototype.parseErrorResponse = function (body, status) {
    var json = JSON.parse(body);
    if (json.error && typeof json.error == 'object') {
        return new MailruTokenError(json.error, json.error_description, json.error_code);
    }
    return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
