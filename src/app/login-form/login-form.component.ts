import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  alertMessage!: string;


  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (emailControl && emailControl.errors && emailControl.errors['required']) {
      console.log('Email is required');
    }

    if (passwordControl && passwordControl.errors && passwordControl.errors['minlength']) {
      console.log('Password must be at least 6 characters');
    }

    if (this.loginForm.valid) {
      this.alertMessage = 'Te loggeaste exitosamente!';
    }
  }
}

