import { Component, OnInit } from '@angular/core';

type Student = {
  name: string;
  grade: number;
  id: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CoderHouse-Angular_JCR';
  students: Student[] = [];
  isApproved(student: Student): boolean {
    return student.grade >= 6;
  }

  ngOnInit() {
    this.students = [
      { name: 'Alice', grade: 4, id: 1 },
      { name: 'Bob', grade: 6, id: 2 },
      { name: 'Charlie', grade: 7, id: 3 },
      { name: 'David', grade: 8, id: 4 },
      { name: 'Eve', grade: 10, id: 5 },
    ];
  }

}
