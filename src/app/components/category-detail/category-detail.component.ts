import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService,UserService,PostService]
})
export class CategoryDetailComponent implements OnInit {
  public page_title: string;
  public category: any;
  public posts: any;
  public url: string;
  public identity:any;
  public token :any;

  constructor(
    private _postService: PostService,
    private _route:ActivatedRoute,
    private _router:Router,
    private _categoryService: CategoryService,
    private _userService: UserService
  ) { 
    this.page_title = "Categories";
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPostsByCategory();
  }

  getPostsByCategory(){
    this._route.params.subscribe(params => {
      let id = +params['id']; //get param from url

      this._categoryService.getCategory(id).subscribe(
        response => {
          if (response.status == 'success') {
            //console.log(response);
            this.category = response.category;
            this._categoryService.getPosts(id).subscribe(
              response => {
                if (response.status == 'success') {
                  this.posts = response.posts;
                }
                else{
                  console.log('Error');
                }
              },
              error => {
                console.log('Error');
              }
            );
          }
          else{
            this._router.navigate(['/home']);
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    });    
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
