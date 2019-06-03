import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserData } from 'src/models/userData';
import { UserService } from 'src/services/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'user',
    templateUrl: 'user.component.html'
})
export class UserPage implements OnInit, OnDestroy {

  userForm : FormGroup;
  editingUserEmail: string;
  editMode = false;
  editUser: UserData;
  subscription: Subscription;
  itemAdd: Subscription;
  itemChange: Subscription;
  itemDelete: Subscription;
  allData = [];
  isSubmitted = false;
  em: any;
  
  genderOptions = ['Male', 'Female', 'Other'];
  qualificationOptions = ['10th', '12th', 'BTech', 'MTech'];

  post: UserData = new UserData();
  submitted = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscription = this.userService.startEdit.subscribe(
      (em: string) => {
        this.editingUserEmail = em;
        this.editMode = true;
        this.editUser = this.userService.getUser(em);
        this.initializeForm();
      }
    )
    this.initializeForm();
    this.allData = this.userService.getAllUsers();
    this.itemAdd = this.userService.itemAdded.subscribe(
      (data) => {
        if(data) {
          this.allData.length = 0;
          this.allData = this.userService.getAllUsers();
        }
      }
    )
    this.itemChange = this.userService.itemChanged.subscribe(
      (data) => {
        if(data) {
          this.allData.length = 0;
          this.allData = this.userService.getAllUsers();
        }
      }
    )
    this.itemDelete = this.userService.itemDeleted.subscribe(
      (data) => {
        if(data) {
          this.allData.length = 0;
          this.allData = this.userService.getAllUsers();
        }
      }
    )
  }
  
  onSubmit() {
    if(this.editMode) {
      this.isSubmitted = true;
      if(this.userForm.valid) {
        this.userService.updateUser(this.userForm.value.email, this.userForm.value);
        this.userService.itemChanged.next(this.userForm.value);
        this.userForm.reset();
        for( let i in this.userForm.controls ) {
          this.userForm.controls[i].setErrors(null);
        }
      }
    } else {
      this.isSubmitted = true;
      if(this.userForm.valid) {
        this.userService.createUser(this.userForm.value);
        this.userService.itemAdded.next(this.userForm.value)        
        this.userForm.reset();
        for( let i in this.userForm.controls ) {
          this.userForm.controls[i].setErrors(null);
        }
      }
    }
  }

  onEdit(email: string) {
    this.userService.startEdit.next(email);
  }

  onDelete(email: string) {
    this.userService.deleteUser(email);
    this.userService.itemDeleted.next(email);
  }

  private initializeForm() {
    let email = null;
    let url = null;
    let gender = null;
    let dob = null;
    let mobile = null;
    let qualification = null;
    let about = null;
    
    if(this.editMode) {
      email = this.editUser.email;
      url = this.editUser.url;
      gender = this.editUser.gender;
      dob = this.editUser.dob;
      mobile = this.editUser.mobile;
      qualification = this.editUser.qualification;
      about = this.editUser.about;
    }

    this.userForm = new FormGroup({
      'email': new FormControl(email, [Validators.required, Validators.email]),
      'url': new FormControl(url, [Validators.required, 
        Validators.pattern("^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$")]),
      'gender': new FormControl(gender, Validators.required),
      'dob': new FormControl(dob, Validators.required),
      'mobile': new FormControl(mobile, [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$')]),
      'qualification': new FormControl(qualification, Validators.required),
      'about': new FormControl(about, Validators.required)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.itemAdd.unsubscribe();
    this.itemChange.unsubscribe();
    this.itemDelete.unsubscribe();
  }
}