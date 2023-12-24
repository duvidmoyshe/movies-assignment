export interface Booking {
    id: number;
    showTime: Date;
    hallId: number;
    movieId: number
    booked: number;
    capacity: number;
    left: number;
  }