import type { Result } from "../helpers/errorHandling";

export type DatabaseKey = string;

export type DatabaseService<T, K extends DatabaseKey = string> = {
  addRecord: (value: T, key?: K) => Promise<void>;
  getRecord: (id: number | string) => Promise<T | undefined>;
  getAllRecords: () => Promise<T[]>;
  updateRecord: (value: T, key?: K) => Promise<void>;
  deleteRecord: (key: K) => Promise<void>;
};

export type ResultBasedDatabaseService<
  T,
  K extends DatabaseKey = string,
  R extends string = string,
> = {
  addRecord: (value: T, key?: K) => Promise<Result<void, R>>;
  getRecord: (id: number | string) => Promise<Result<T | undefined, R>>;
  getAllRecords: () => Promise<Result<T[], R>>;
  updateRecord: (value: T, key?: K) => Promise<Result<void, R>>;
  deleteRecord: (key: K) => Promise<Result<void, R>>;
};
