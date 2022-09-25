import daggy from 'daggy';
import {liftF} from '../halo/helpers/free';
import {fetchFuture, readJson} from '../fetch';
import Maybe from '../halo/helpers/maybe';
import Future from '../halo/helpers/future';
import go from '../halo/helpers/go';
import {always, prop} from 'ramda';
import RemoteData from '../halo/helpers/remoteData';
import toQuery from '../halo/helpers/toQuery';
import {safeHref} from '../data/routes';

const AppF = daggy.taggedSum('AppF', {
  GetTags: [],
  GetAuthor: ['username'],
  Authenticate: ['fields'],
  Notify: ['message'],
  Navigate: ['route'],
  GetArticles: ['params'],
  GetFeed: ['params'],
  GetCurrentUser: [],
  PutUser: ['fields'],
  GetArticle: ['slug'],
  CreateArticle: ['fields'],
  UpdateArticle: ['slug', 'fields'],
});

const A = {
  authenticate: fields => liftF(AppF.Authenticate(fields)),
  notify: message => liftF(AppF.Notify(message)),
  getTags: () => liftF(AppF.GetTags),
  navigate: route => liftF(AppF.Navigate(route)),
  getAuthor: username => liftF(AppF.GetAuthor(username)),
  getArticles: params => liftF(AppF.GetArticles(params)),
  getCurrentUserFeed: params => liftF(AppF.GetFeed(params)),
  getCurrentUser: () => liftF(AppF.GetCurrentUser),
  putUser: fields => liftF(AppF.PutUser(fields)),
  getArticle: slug => liftF(AppF.GetArticle(slug)),
  createArticle: fields => liftF(AppF.CreateArticle(fields)),
  updateArticle: (slug, fields) => liftF(AppF.UpdateArticle(slug, fields)),
};

const writeToken = Future.encase(token => {
  localStorage.token = token;
});

const interpretA = env => command =>
  command.cata({
    Authenticate: fields =>
      go(function* () {
        const response = yield fetchFuture({
          url: 'https://api.realworld.io/api/users/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({user: fields}),
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        const {token, ...user} = yield readJson(response).map(prop('user'));

        yield writeToken(token);

        return Future.of(user);
      }).coalesce(always(Maybe.Nothing), Maybe.Just),
    GetTags: () =>
      fetchFuture({url: 'https://api.realworld.io/api/tags'})
        .chain(readJson)
        .map(prop('tags'))
        .coalesce(RemoteData.Failure, RemoteData.Success),
    GetAuthor: username =>
      go(function* () {
        const response = yield fetchFuture({
          url: `https://api.realworld.io/api/profiles/${username}`,
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.token}`,
          },
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        const profile = yield readJson(response).map(prop('profile'));
        return Future.of(profile);
      }).coalesce(RemoteData.Failure, RemoteData.Success),
    GetArticles: params =>
      go(function* () {
        const response = yield fetchFuture({
          url: `https://api.realworld.io/api/articles${toQuery(params)}`,
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.token}`,
          },
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        const {articles: content, articlesCount: total} = yield readJson(
          response
        );

        return Future.of({content, total});
      }).coalesce(RemoteData.Failure, RemoteData.Success),
    GetFeed: params =>
      go(function* () {
        const response = yield fetchFuture({
          url: `https://api.realworld.io/api/articles/feed${toQuery(params)}`,
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.token}`,
          },
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        const {articles: content, articlesCount: total} = yield readJson(
          response
        );

        return Future.of({content, total});
      }).coalesce(RemoteData.Failure, RemoteData.Success),
    CreateArticle: fields =>
      go(function* () {
        const response = yield fetchFuture({
          url: `https://api.realworld.io/api/articles`,
          method: 'POST',
          headers: {
            Authorization: `Token ${localStorage.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({article: fields}),
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        return readJson(response).map(prop('article'));
      }).coalesce(RemoteData.Failure, RemoteData.Success),
    UpdateArticle: (slug, fields) =>
      go(function* () {
        const response = yield fetchFuture({
          url: `https://api.realworld.io/api/articles/${slug}`,
          method: 'PUT',
          headers: {
            Authorization: `Token ${localStorage.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({article: fields}),
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        return readJson(response).map(prop('article'));
      }).coalesce(RemoteData.Failure, RemoteData.Success),
    GetArticle: slug =>
      go(function* () {
        const response = yield fetchFuture({
          url: `https://api.realworld.io/api/articles/${slug}`,
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.token}`,
          },
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        const {article} = yield readJson(response);

        return Future.of(article);
      }).coalesce(RemoteData.Failure, RemoteData.Success),
    GetCurrentUser: () => Future.resolve({bio: 'asd'}),
    PutUser: fields =>
      go(function* () {
        const response = yield fetchFuture({
          url: `https://api.realworld.io/api/user`,
          method: 'PUT',
          headers: {
            Authorization: `Token ${localStorage.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({user: fields}),
        });
        yield response.status === 200
          ? Future.resolve(response)
          : Future.reject('źle');

        return readJson(response).map(prop('profile'));
      }).coalesce(RemoteData.Failure, RemoteData.Success),
    Notify: message => Future.attempt(() => alert(message)),
    Navigate: route =>
      Future.attempt(() => (window.location.href = safeHref(route))),
  });

export {A, AppF, interpretA};
