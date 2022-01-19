import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public identity;
  public token: any;
  public status: string;
  public url: string;

  ckeditorContent: string = '<p>Some html</p>';
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+'user/upload',
      headers: {
     "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Upload avatar'
  };

  constructor(
    private _userService: UserService
  ) { 
    this.page_title = 'User Settings';
    this.user = new User(1,'','','ROLE_USER','','','','');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    //Lllenar objeto de usuario
    this.identity.gettoken=null;
    this.user = new User(this.identity.sub,this.identity.name,this.identity.surname,this.identity.role,this.identity.email,'',this.identity.description,this.identity.image);
    this.status = '';
    this.url = global.url;
    }

  ngOnInit(): void {
    //console.log('El token: '+ this.token);
  }

  onSubmit(form:any){
    this._userService.update(this.token,this.user).subscribe(
      response => {
        if (response && response.status) {
          this.status = 'success';

          //Actualizacion del usuario en sesion
          if (response.changes.name) {
            this.user.name = response.changes.name;
          }
          if (response.changes.surname) {
            this.user.surname = response.changes.surname;
          }
          if (response.changes.email) {
            this.user.email = response.changes.email;
          }
          if (response.changes.description) {
            this.user.description = global.htmlEntities(this.user.description);
            this.user.description = response.changes.description;
          }
          if (response.changes.image) {
            this.user.image = response.changes.image;
          }
          this.identity = this.user;
          localStorage.setItem('identity',JSON.stringify(this.identity));
        }else{
          console.log('error');
        }
        //console.log(response);
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
  
  avatarUpload(datos :any){
    let data = JSON.parse(datos.response);
    this.user.image =  data.image;
  }
}
