import {AuthGuard} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";

@Injectable()
export class RtGuards extends AuthGuard("jwt-refresh") {
    constructor(props) {
        super(props);
    }
}