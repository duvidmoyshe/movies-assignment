// movie-details.component.ts

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Booking } from '../models/booking.model';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  movieId!: number;
  movie!: Movie;
  bookings$ = new Observable<Booking[]>
  movie$ = new Observable<Movie | null>
  numOfTickets = 1;

  constructor(private route: ActivatedRoute, private movieService: MovieService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.movieId = +params['id'];
      this.loadMovieDetails();
    });
  }

  loadMovieDetails(): void {

    this.movie$ = this.movieService.getCurrentMovie();


    this.bookings$ = this.movieService.getMovieBookings(this.movieId).pipe(
      map((book: Booking[]) => {
        return book.map(b => ({ ...b, 'left': 0 }))
      }
      )
    )

  }

  bookTickets(booking: Booking): void {
    this.movieService.bookTickets(booking.id, booking.left).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe((res) => {
        this._snackBar.open(res, '', { duration: 1000 });
        this.bookings$ = this.movieService.getMovieBookings(this.movieId).pipe(
          map((book: Booking[]) => {
            return book.map(b => ({ ...b, 'left': 0 }))
          }
          )
        )
      })

  }

  plusOrMinus(isAdd: boolean, booking: Booking) {
    let left = booking.capacity - booking.booked;
    if (isAdd) {

      if (left && (booking.left + 1 <= left))
        booking.left += 1
    }
    else {
      if (left && booking.left > 0) {
        if (booking.left == 1) {
          booking.left = 0;
        }
        else if ((booking.left - 1) >= 1) {
          booking.left -= 1;
        }
      }
    }
    return booking.left;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

