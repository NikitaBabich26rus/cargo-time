import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard {
    constructor(private readonly _jwtService: JwtService) {}

    public canActivate (context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()

        try {
            const headers = request.headers.authorization
            const bearer = headers.split(' ')[0]
            const token = headers.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException("Authorization error")
            }

            const user = this._jwtService.verify(token)
            request.user = user

            return true
        } catch (e) {
            throw new UnauthorizedException("Authorization error")
        }
    }
}