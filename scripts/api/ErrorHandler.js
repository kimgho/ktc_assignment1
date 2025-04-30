export class ErrorHandler extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'API ERROR';
        this.details = details;
    }
}