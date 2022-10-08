
export class ResponseDto {
    constructor(object: any, token: string) {
        this.result = object
        this.token = token
    }

    result: any

    token: string
}