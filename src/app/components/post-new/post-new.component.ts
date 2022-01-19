import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { Post } from 'src/app/models/post';
import { global } from '../../services/global';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService,CategoryService,PostService]
})
export class PostNewComponent implements OnInit {
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
    this.page_title = 'Create post';
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
  }

  onSubmit(form:any){
    //console.log(this.post);
    //console.log(this._postService.prueba());
    this._postService.create(this.token,this.post).subscribe(
      response => {
        if (response.status == 'success') {
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['/home']);
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
}
