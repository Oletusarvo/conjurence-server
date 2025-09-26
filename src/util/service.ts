export abstract class Service<T> {
  public repo: T;
  constructor(repo: T) {
    this.repo = repo;
  }
}
