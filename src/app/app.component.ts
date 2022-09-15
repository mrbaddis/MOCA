import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { User } from './models/user.model';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedIn = false;
  newUserForm: FormGroup;
  loginForm: FormGroup;

  users$ = this.apiService.findAll();

  constructor(
    private apiService: ApiService<User>,
    private fb: FormBuilder
  ) {
    this.newUserForm = this.fb.group({
      id: [null, []],
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      gender: [null, [Validators.required]],
      status: [null, [Validators.required]]
    })

    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, [Validators.required]]
    })
  }

  login() {
    const loginValues = this.loginForm.value;

    if (loginValues.username === 'root' && loginValues.password === 'password') {
      this.loggedIn = true;
    } else {
      alert("Login with root | password")
    }
  }

  clearForm() {
    this.newUserForm.reset();
  }

  submit() {
    if (!this.newUserForm.controls['id'].value) {
      this.createNewUser();
    } else {
      this.updateUser();
    }
  }

  createNewUser() {
    const newUserData = this.newUserForm.value;
    this.apiService.create(newUserData).subscribe((data) => {
      alert("User added successfully")
      this.users$ = this.apiService.findAll()
      this.clearForm()
    }, (err) => this.handleError(err.error))
  }

  updateUser() {
    const newUserData = this.newUserForm.value;
    this.apiService.update(newUserData.id, newUserData).subscribe((data) => {
      alert("User updated successfully")
      this.users$ = this.apiService.findAll()
      this.clearForm()
    },(err) => this.handleError(err))
  }

  selectUserForEdit(user: User) {
    this.newUserForm.controls['id'].setValue(user.id)
    this.newUserForm.controls['name'].setValue(user.name)
    this.newUserForm.controls['email'].setValue(user.email)
    this.newUserForm.controls['gender'].setValue(user.gender)
    this.newUserForm.controls['status'].setValue(user.status)
  }

  deleteUser(id: number) {
    this.apiService.delete(id).subscribe(() => {
      alert("User deleted successfully");
      this.users$ = this.apiService.findAll()
    },(err) => this.handleError(err))
  }

  handleError(err: any[]) {
    let errorMessage = '';

    err.forEach(error => {
      errorMessage += `${error.field} ${error.message} \n`
    });

    alert(errorMessage);
  }


}
