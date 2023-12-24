// movie-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Observable, Subject } from 'rxjs';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit {
  movies$!: Observable<Movie[]>;
  private destroy$ = new Subject<void>();

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
   this.movies$ =  this.movieService.getMovies();
  }

  viewMovieDetails(movie: Movie): void {
    this.movieService.updateCurrentMovie(movie)
    this.router.navigate(['/movie-details', movie.id]);
  }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
