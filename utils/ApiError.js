class ApiError extends Error {
    constructor(status, message, errors = [], stack) {
        super(message)
        this.status = status
        this.data = null
        this.errors = errors
        this.message = message

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }