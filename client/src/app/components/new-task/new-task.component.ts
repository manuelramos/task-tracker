import { TaskService } from './../../services/task.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from '../../model/task';
import { TaskState } from 'src/app/model/task-state';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  newTaskForm: FormGroup;
  states = new Array<TaskState>();

  @Output()
  submitted = new EventEmitter<boolean>();

  @Output()
  taskCreated = new EventEmitter<Task>();

  @Output()
  canceled = new EventEmitter<boolean>();

  constructor(private taskService: TaskService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.taskService.getStates().subscribe(
      response => this.states = response,
      err => console.error(err)
    );

    this.newTaskForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(),
      estimatedTime: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required)
    });
  }

  createTask(newTaskValues) {
    if (this.newTaskForm.valid) {
      this.taskService.create(newTaskValues).subscribe(
        response => {
          this.submitted.emit(true);
          this.taskCreated.emit(response);
          this.toastr.success('Trask ' + response.name + ' was created successfully');
        },
        err => {
          this.submitted.emit(false);
          this.toastr.error('There was an error creating the new task');
        }
      );
    } else {
      console.log('Invalid form, please check it out.');
      this.toastr.error('You must complete required fields.');
    }
  }

  onCancelNewTaskClick() {
    this.canceled.emit(true);
    this.submitted.emit(false);
  }

}
