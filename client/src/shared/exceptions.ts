export class BaseException implements Error {
    name: string;
    message: string | any;
    stackTrace: any;

    constructor(message: string | any, stackTrace: any = null) {
        this.message = message;
        if (!!message && !!message.data) {
            this.message = message.data;
        }
        this.stackTrace = stackTrace;
    }
}

export class LoginException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'LoginException';
    }
}

export class PersistenceException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'PersistenceException';
    }
}

export class HttpServiceException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'HttpServiceException';
    }
}

export class ValidationException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'ValidationException';
    }
}

export class GlobalSettingException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'GlobalSettingException';
    }
}

export class DbConnectionException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'DbConnectionException';
    }
}

export class ConsoleOnlyException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'ConsoleOnlyException';
    }
}

export class WarningException extends BaseException {

    private IsWarning: boolean;

    constructor(message: string | any) {
        super(message, null);
        this.name = 'WarningException';
        this.IsWarning = true;
    }
}

export class AuthorizationException extends BaseException {
    constructor(message: string | any, stackTrace: any = null) {
        super(message, stackTrace);
        this.name = 'AuthorizationException';
    }
}
