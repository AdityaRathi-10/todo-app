class ApiResponse {
    constructor(status, data, message, redirectUrl) {
        this.status = status
        this.data = data
        this.message = message
        this.redirectUrl = redirectUrl
    }
}

export { ApiResponse }