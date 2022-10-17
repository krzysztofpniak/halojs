import {taggedSum} from './daggy';

const RemoteData = taggedSum('RemoteData', {
  NotAsked: [],
  Loading: [],
  Failure: ['error'],
  Success: ['value'],
});

const remoteData$map = function (f) {
  return this.cata({
    NotAsked: () => this,
    Loading: () => this,
    Failure: () => this,
    Success: value => RemoteData.Success(f(value)),
  });
};

RemoteData.prototype.map = remoteData$map;
RemoteData.prototype['fantasy-land/map'] = remoteData$map;

RemoteData.prototype.fromSuccess = function (defaultValue) {
  return this.cata({
    NotAsked: () => defaultValue,
    Loading: () => defaultValue,
    Failure: () => defaultValue,
    Success: value => value,
  });
};

export default RemoteData;
