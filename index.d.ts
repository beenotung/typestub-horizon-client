// Source: https://raw.githubusercontent.com/beenotung/typed-horizon/master/src/main.d.ts
import {Observable} from "rxjs";

export interface Horizon {
  find<A>(): Observable<A>;

  call<A>(_this: Horizon, table: string): TableObject<A>;

  <A> (name: string): TableObject<A>;

  currentUser(): TableQuery<any>;

  hasAuthToken(): boolean;

  connect(): void;

  onReady(f: Function): void;

  onDisconnected(f: Function): void;

  onSocketError(f: (error: any) => void): void;

  model<A>(query: (id: string) => AggregateObject): (id: string) => FinalQuery<A>;
}
export interface HorizonConstructorParam {
  host?: string;        // default to window.location
  secure?: boolean;     // default to true
  path?: string;        // default to "horizon"
  lazyWrites?: boolean; // default to false
  authType?: AuthType;  // default to "unauthenticated"
}
export interface HorizonConstructor {
  new(param?: HorizonConstructorParam): Horizon;
  clearAuthToken(): void;
}
export let Horizon: HorizonConstructor;

export type AuthType  = 'unauthenticated' | 'anonymous' | 'token';
export type AuthToken = {token: any, storeLocally: boolean};
export type OrderType = 'ascending' | 'descending';
export type RangeType = 'closed' | 'open';

export interface TableQuery<A> extends FinalQuery<A> {
  order(field: string, direction?: OrderType): OrderQuery<A>;     // default to "ascending"
  above(idOrObject: string|any, type?: RangeType): OrderQuery<A>; // default to "open" (exclusive)
}
export interface FinalQuery<A> extends LimitedFinalQuery<A> {
  limit(max: number): LimitedFinalQuery<A>;
}
export interface SingleFinalQuery<A> extends Observable<A> {
  defaultIfEmpty(): Observable<A>;
}
export interface LimitedFinalQuery<A> {
  fetch(): Observable<A[]>;
  watch(): Observable<A[]>;
}
export interface OrderQuery<A> extends FinalQuery<A> {
  below(idOrObject: string|any, type?: string): FinalQuery<A[]>; // default open(exclusive)
}
export interface FindQuery<A> {
  fetch(): SingleFinalQuery<A>;
}
export interface CreatedObject {
  id: string;
}
export interface JSONObject {
  [key: string]: DataType|JSONObject|Array<DataType>;
}
export type DataType = number|string|boolean|null|JSONObject
  |number[]|string[]|boolean[]|null[]|JSONObject[];
/* local record, not yet stored */
export interface NewRecord {
  id?: string;
  [key: string]: DataType;
}
/* get from database */
export interface OldRecord extends NewRecord {
  id: string;
}
export interface TableObject<A> extends TableQuery<A> {
  find(x: string|NewRecord): FindQuery<A>;
  findAll(x: string|NewRecord, ...xs: Array<string|NewRecord>): TableQuery<A>;
  insert(oneOrList: NewRecord|NewRecord[]): TableObject<CreatedObject>;
  remove(x: string|OldRecord): TableObject<CreatedObject>;
  removeAll(xs: Array<string|OldRecord>): Observable<CreatedObject>;
  replace(oneOrList: OldRecord|OldRecord[]): Observable<CreatedObject>;
  store(oneOrList: NewRecord|OldRecord|(NewRecord|OldRecord)[]): Observable<CreatedObject>;
  update(oneOrList: OldRecord|OldRecord[]): Observable<CreatedObject|CreatedObject[]>;
  upsert(oneOrList: NewRecord|OldRecord|(NewRecord|OldRecord)[]): TableQuery<CreatedObject>;
}
export interface AggregateObject {
  [key: string]: FindQuery<NewRecord>|DataType|Observable<NewRecord>|Promise<NewRecord>|AggregateObject[]
}
