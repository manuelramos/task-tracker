import { TaskState } from './../model/task-state';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, ObservableLike, of, BehaviorSubject } from 'rxjs';
import { Task } from '../model/task';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _tasks = new BehaviorSubject<Task[]>([]);
  tasks = this._tasks.asObservable();

  private _totalHours = new BehaviorSubject<number>(0);
  totalHours = this._totalHours.asObservable();

  constructor(private http: HttpClient) { }

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks/all')
      .pipe(
        catchError(this.handleError<Task[]>('getAll', []))
      );
  }

  create(values): Observable<Task> {
    const newTask = new Task(values.name, values.description, values.estimatedTime, values.state);
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<Task>('api/tasks/create', newTask, options)
      .pipe(
        catchError(this.handleError<Task>('create'))
      );
  }

  delete(taskId: number): Observable<{}> {
    return this.http.delete(`/api/tasks/delete/${taskId}`)
      .pipe(
        catchError(this.handleError<Task>('delete'))
      );
  }

  updateState(taskId, newState): Observable<Task[]> {
    const body = {'id': taskId, 'state': newState};
    return this.http.put<Task[]>('/api/tasks/update', body)
      .pipe(
        catchError(this.handleError<Task[]>('update'))
      );
  }

  getStates(): Observable<TaskState[]> {
    return this.http.get<TaskState[]>('/api/tasks/states')
      .pipe(
        catchError(this.handleError<TaskState[]>('getAllStates', []))
      );
  }

  updateListOfTasks(newListOfTasks: Array<Task>) {
    this._tasks.next(newListOfTasks);
    this.calculateTotalHours(newListOfTasks);
  }

  private calculateTotalHours(listOfTasks: Array<Task>) {
    let total = 0;
    listOfTasks.forEach(t => total += t.estimate);
    this._totalHours.next(total);
  }

  private handleError<T>(operation= 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
