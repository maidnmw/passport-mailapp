/**
 * `MailruTokenError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [type]
 * @param {number} [code]
 * @access public
 */
function MailruTokenError(message, type, code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'MailruTokenError';
    this.message = message;
    this.type = type;
    this.code = code;
    this.status = 500;
}

/**
 * Inherit from `Error`.
 */
MailruTokenError.prototype.__proto__ = Error.prototype;


/**
 * Expose `MailruTokenError`.
 */
module.exports = MailruTokenError;
