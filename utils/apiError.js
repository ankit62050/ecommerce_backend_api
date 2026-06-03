class apiError extends Error {
    constructor(
        StatusCode,
        message = "something went wrong",
        Stack = "",
        errors = []
    ) {
        super(message);
        this.statusCode = StatusCode;
        this.errors = errors;
        this.data = null;

        if (Stack) {
            this.stack = Stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default apiError;