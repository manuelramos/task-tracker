import { catchError } from 'rxjs/operators';
import { TaskState } from './../model/task-state';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<TaskState[]> {
    return this.http.get<TaskState[]>('/api/tasks/states')
      .pipe(
        catchError(this.handleError<TaskState[]>('getAllStates', []))
      );
  }

  private handleError<T>(operation= 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
