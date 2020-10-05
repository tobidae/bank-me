export class UnauthorizedError extends Error {
    private readonly status: number;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
        this.status = 401;
    }

    public get statusCode() {
        return this.status;
    }

    public get message(): string {
        return this.message;
    }
}

export class FailedActionError extends Error {
    private readonly status: number;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, FailedActionError.prototype);
        this.status = 400;
    }

    public get statusCode() {
        return this.status;
    }

    public get message(): string {
        return this.message;
    }
}


export class ResourceNotFoundError extends Error {
    private readonly status: number;
    constructor(message?: string) {
        if (!message) {
            message = 'The requested resource was not found, please try again later!';
        }
        super(message);
        Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
        this.status = 404;
    }

    public get statusCode() {
        return this.status;
    }

    public get message(): string {
        return this.message;
    }
}

export class ResourceInvalidError extends Error {
    private readonly status: number;
    constructor(message?: string) {
        if (!message) {
            message = 'The requested resource is invalid, please try again later!';
        }
        super(message);
        Object.setPrototypeOf(this, ResourceInvalidError.prototype);
        this.status = 422;
    }

    public get statusCode() {
        return this.status;
    }

    public get message(): string {
        return this.message;
    }
}


export class ForbiddenError extends Error {
    private status: number;
    constructor(message?: string) {
        if (!message) {
            message = 'The requested resource could not be accessed due to insufficient permissions!';
        }
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
        this.status = 403;
    }

    public get statusCode() {
        return this.status;
    }

    public get message(): string {
        return this.message;
    }
}

export interface ErrorInfo {
    code: string;
    message: string;
}
