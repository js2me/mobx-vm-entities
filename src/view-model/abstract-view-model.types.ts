export interface AbstractViewModelParams<
  Payload extends AnyObject = EmptyObject,
> {
  id: string;
  payload: Payload;
  parentViewModelId?: Maybe<string>;
}
