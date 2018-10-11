import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  total: number;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.totalHours.subscribe(totalHs => this.total = totalHs);
  }

}
