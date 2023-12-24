// movie.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/api';
  private currentMovieSub$ = new BehaviorSubject<Movie | null>(null);
  currentMovie$ = this.currentMovieSub$.asObservable()

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`).pipe(
      catchError(this.handleError))
  }

  getMovieBookings(movieId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/movies/booking/${movieId}`).pipe(
      catchError(this.handleError))
  }

  bookTickets(showId: number, tickets: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/booking`, { showId, tickets }).pipe(
      catchError(this.handleError))
  }

  getCurrentMovie() {
    return this.currentMovie$
  }

  updateCurrentMovie(movie: Movie) {
    return this.currentMovieSub$.next(movie);
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    // You can log the error or handle it in a way that suits your application
    switch (error.status) {
      case 200:
        return of(error.error.text)
      case 400:
        return of(error.error)
    }

    // Return an observable with a user-facing error message
    return throwError(error.error);
  }
}


