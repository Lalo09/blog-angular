import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers:[PostService, UserService]
})
export class PostDetailComponent implements OnInit {
  public post: any;
  public identity: any;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) { 
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(){
    //Sacar el id del post de la url
    this._route.params.subscribe(params =>{
      let id = +params['id'];
      //Peticion ajax para sacar los datos del post
      this._postService.getPost(id).subscribe(
        response => {
          if (response.status == "success") {
            this.post = response.posts;
            console.log(this.post);
          }
          else{
            this._router.navigate(['notfound']);
          }
        },error => {
          console.log(<any>error);
          this._router.navigate(['notfound']);
        }
      );
    });   

  }
}
