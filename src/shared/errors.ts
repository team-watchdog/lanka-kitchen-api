export class CustomError extends Error {
    type = "";

    constructor(message: string, type: string = "CUSTOM") {
        super(message);
        this.name = "CustomError";
        this.type = type;
    }
}