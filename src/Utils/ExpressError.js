class ExpressError extends Error {
    constructor(statusCode, from, message) {
        super(message);
        this.statusCode = statusCode;
        this.from = from;
        this.message = message;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ExpressError;