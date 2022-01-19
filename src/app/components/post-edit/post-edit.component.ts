import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { Post } from 'src/app/models/post';
import { global } from '../../services/global';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
  providers: [UserService,CategoryService,PostService]
})
export class PostEditComponent implements OnInit {
  public page_title: string;
  public identity: any;
  public token: any;
  public post: Post;
  public url: string;
  ckeditorContent: string = '<p>Some html</p>';
  public categories:any;
  public status: string;
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+'post/upload',
      headers: {
     "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Upload an image'
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) { 
    this.page_title = 'Edit post';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1,this.identity.sub,1,'','','',null);//Crear objeto
    this.url = global.url;
    this.status = '';
  }

  ngOnInit(): void {
    //console.log(this.identity);
    //console.log(this.post);    
    this.getCategories();
    this.getPost();
  }

  onSubmit(form:any){
    this._postService.update(this.token,this.post, this.post.id).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success';
          //this.post = response.post;
          //Reedirigir a la pagina del post
          this._router.navigate(['/post',this.post.id]);
        }else{
          this.status = 'error';
        }
      },error => {
        console.log(<any>error);
        this.status = 'error';
      }
    );

  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if (response.status=='success') {
          this.categories = response.categories;
          console.log(this.categories);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  imageUpload(data :any){
    let image_data = JSON.parse(data.response);
    this.post.image =  image_data.image;
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
            //console.log(this.post);
            if (this.post.user_id != this.identity.sub) {
              this._router.navigate(['notfound']);
            }
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
