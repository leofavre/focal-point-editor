export type DatabaseKey = string;

export type DatabaseService<T, K extends DatabaseKey = string> = {
  addRecord: (value: T, key?: K) => Promise<void>;
  getRecord: (id: number | string) => Promise<T | undefined>;
  getAllRecords: () => Promise<T[]>;
  updateRecord: (value: T, key?: K) => Promise<void>;
  deleteRecord: (key: K) => Promise<void>;
};
