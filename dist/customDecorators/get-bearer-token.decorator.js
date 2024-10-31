"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBearerToken = void 0;
const common_1 = require("@nestjs/common");
exports.GetBearerToken = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
        throw new common_1.UnauthorizedException('Authorization header is missing');
    }
    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer' || !token) {
        throw new common_1.UnauthorizedException('Invalid authorization token');
    }
    return token;
});
//# sourceMappingURL=get-bearer-token.decorator.js.map