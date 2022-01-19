import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
  providers: [PostService,UserService]
})
export class DefaultComponent implements OnInit {

  public page_title: string;
  public url;
  public posts: any;
  public identity:any;
  public token :any;

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.page_title = 'Home'
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPosts();
    console.log('Valor de identity:'+this.identity);
    console.log('Valor de token:'+this.token);
  }

  getPosts(){
    this._postService.getPosts().subscribe(
      response => {
        if (response.status == 'success') {
          this.posts = response.posts;
          console.log(this.posts);
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
        this.getPosts();//Volver a cargar los posts
      },
      error => {
        console.log(error);
      }
    );    
  }

}
