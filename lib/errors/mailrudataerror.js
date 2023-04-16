/**
 * `MailruDataAPIError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [type]
 * @param {number} [code]
 * @access public
 */
function MailruDataError(message, type, code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'MailruAPIError';
    this.message = message;
    this.type = type;
    this.code = code;
    this.status = 500;
}

/**
 * Inherit from `Error`.
 */
MailruDataError.prototype.__proto__ = Error.prototype;


/**
 * Expose `MailruDataError`.
 */
module.exports = MailruDataError;