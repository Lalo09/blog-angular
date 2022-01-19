import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { global } from '../../services/global';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router,ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService,UserService]
})
export class ProfileComponent implements OnInit {

  public page_title: string;
  public url;
  public posts: any;
  public user: any;
  public identity:any;
  public token :any;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.page_title = 'User profile '
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getProfile();
    //console.log('Valor de identity:'+this.identity);
    //console.log('Valor de token:'+this.token);
  }

  getUser(userId:any){
    this._userService.getUser(userId).subscribe(
      response => {
        this.user = response.user;
        //console.log('el usuario es:'+this.user);
      },
      error => {
        console.log(error);
      }
    );  
  }

  getProfile(){
    //Sacar el id del post de la url
    this._route.params.subscribe(params =>{
      let id = +params['id'];
      this.getUser(id);
      this.getPosts(id);
    });
  }

  getPosts(userId:any){
    this._userService.getPosts(userId).subscribe(
      response => {
        if (response.status == 'success') {
          this.posts = response.posts;
          //console.log(this.posts);
        }
      },
      error => {
        console.log(error);
      }
    );  
  }

  deletePost(id:any){
    this._postService.delete(this.token,id).subscribe(
      response => {
        this.getProfile();
      },
      error => {
        console.log(error);
      }
    );    
  }


}
