export interface UsersList {
  userId: String;
  moviesList: Array<{
    movieId: String;
    addedDate: Date;
  }>;
  tvShowsList: Array<{
    tvShowId: String;
    addedDate: Date;
  }>;
}
