import { TaskState } from './../../model/task-state';
import { TaskStateService } from './../../services/task-state.service';
import { Component, OnInit } from '@angular/core';
import { Task } from '../../model/task';
import { TaskService } from '../../services/task.service';
import { faTrashAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css'],
})
export class TrackerComponent implements OnInit {

  title: string;
  btnNewTaskText: string;
  iconTrash = faTrash;
  showNewTask = false;

  tasks = new Array<Task>();
  states = new Array<TaskState>();
  message: string;

  constructor(private taskService: TaskService,
      private router: Router,
      private toastr: ToastrService) {
    this.btnNewTaskText = 'New Task';
    this.title = 'Task Tracker';
  }

  ngOnInit() {
    this.taskService.getAll().subscribe(
      resp => this.taskService.updateListOfTasks(resp),
      error => this.toastr.error('There was an error trying to retrive all the tasks from the server.')
    );

    this.taskService.getStates().subscribe(
      resp => this.states = resp,
      err => console.error(err)
    );

    this.taskService.tasks.subscribe( tasks => this.tasks = tasks);
  }

  onDeleteClick(task) {
    this.taskService.delete(task.id).subscribe(
      res => this.toastr.info('Task removed successfully'),
      err => this.toastr.error('There was an error trying to delete the task')
    );
    const index = this.tasks.findIndex(function(t) {
      return t.id === task.id;
    });
    if (index > -1) {
      this.tasks.splice(index, 1);
      this.taskService.updateListOfTasks(this.tasks);
    }

  }

  onNewTaskClick() {
    this.showNewTask = true;
  }

  onNewTaskSubmittedEvent(submmited) {
    if (submmited) {
      this.showNewTask = false;
      this.router.navigate([TrackerComponent]);
    }
  }

  onSelectNewState(taskId, newState) {
    this.taskService.updateState(taskId, newState).subscribe(
      response => {
        this.taskService.updateListOfTasks(response);
        this.toastr.success('State updated successfully');
    },
      err => this.toastr.error('There was an error trying to update the state of the task')
    );
  }

  onNewTaskCreatedEvent(task) {
    if (task) {
      this.tasks.push(task);
      this.taskService.updateListOfTasks(this.tasks);
    }
  }

  onCancelNewTaskEvent(canceled) {
    this.showNewTask = !canceled;
  }
}
