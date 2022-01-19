import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { UserService } from "./user.service";

@Injectable()
export class IdentityGuard implements CanActivate{

    constructor(
        private _router:Router,
        private _userService: UserService
    ){

    }

    canActivate(){
        //En el video se usa el identity pero aqui se cambio a gettoken
        let token = this._userService.getToken();

        if (token) {
            return true;
        }else{
            this._router.navigate(['/error']);
            return false;
        }
    }
}