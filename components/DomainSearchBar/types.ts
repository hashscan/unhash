export enum SearchStatus {
  Idle, // nothing is happening, search query is empty
  Loading,
  Invalid, // search query has invalid format
  Error, // fetch error
  Duplicate, // already in order
  Available,
  NotAvailable
}
