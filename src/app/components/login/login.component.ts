import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: any;
  public token: string;
  public identity: string;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { 
    this.page_title = 'Identify';
    this.user = new User(1,'','','ROLE_USER','','','','');
    this.status = '';
    this.token = '';
    this.identity = '';
  }

  ngOnInit(): void {
    this.logout();//Se ejecuta siempre y cierra sesion cuando llega el parametro
  }

  onSubmit(form:any){
    this._userService.signup(this.user).subscribe(
      response => {
        //console.log(response);
        //TOKEN
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          //Objeto usuario identificado
          this._userService.signup(this.user, this.status).subscribe(
            response => {

              this.identity = response;

              //Almacenar token y identoty en localstorage
              //console.log(this.token);
              //console.log(this.identity);

              localStorage.setItem('token',this.token);
              localStorage.setItem('identity',JSON.stringify(this.identity));

              this._router.navigate(['home']); ///reedireccion
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );

        }else{
          this.status = 'error'
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  logout(){
    this._route.params.subscribe(params => {
      let logout = +params['sure'];

      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = '';
        this.token = '';

        //Reedireccion a inicio
        this._router.navigate(['home']);
      }
    });
  }
}
