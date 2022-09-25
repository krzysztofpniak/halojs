import {connect, H, Link, mkComponent, mkEval} from '../../halo/halo';
import {assoc, map, mergeLeft, prop} from 'ramda';
import RemoteData from '../../halo/helpers/remoteData';
import Header from '../components/header';
import Footer from '../../footer';
import React from 'react';
import daggy from 'daggy';
import {A} from '../appM';
import go from '../../halo/helpers/go';
import {Free} from '../../halo/helpers/free';
import {Routes, safeHref} from '../../data/routes';
import classnames from 'classnames';
import ArticleList from '../components/articleList';

const Action = daggy.taggedSum('Action', {
  Initialize: [],
  Receive: ['input'],
  LoadAuthor: ['username'],
  LoadArticles: ['username'],
  LoadFavorites: ['username'],
});

const Relation = daggy.taggedSum('Relation', {
  Following: [],
  NotFollowing: [],
  You: [],
});

const mkAuthor = currentUser => author => ({
  ...author,
  relation:
    currentUser.map(prop('username')).fromMaybe('') === author.username
      ? Relation.You
      : author.following
      ? Relation.Following
      : Relation.NotFollowing,
});

const loadArticles = params =>
  go(function* () {
    yield H.modify(assoc('articles', RemoteData.Loading));
    const currentUser = (yield H.getStore()).getState().currentUser;
    const articles = yield A.getArticles(params);
    return H.modify(assoc('articles', articles));
  });

const handleAction = action =>
  action.cata({
    Initialize: () =>
      go(function* () {
        const {username} = yield H.get();
        yield H.fork(handleAction(Action.LoadAuthor(username)));
        return H.fork(handleAction(Action.LoadArticles(username)));
      }),

    Receive: input =>
      go(function* () {
        const {tab, username} = input;
        yield H.modify(mergeLeft(input));
        return tab.cata({
          ArticlesTab: () =>
            H.fork(handleAction(Action.LoadArticles(username))),
          FavoritesTab: () =>
            H.fork(handleAction(Action.LoadFavorites(username))),
        });
      }),
    LoadAuthor: username =>
      go(function* () {
        const currentUser = (yield H.getStore()).getState().currentUser;
        return A.getAuthor(username)
          .map(map(mkAuthor(currentUser)))
          .chain(author => H.modify(assoc('author', author)));
      }),
    LoadArticles: username => loadArticles({author: username}),
    LoadFavorites: username => loadArticles({favorited: username}),
  });

const UserInfo = ({username, bio, relation}) => (
  <div className="user-info">
    <div className="user-info">
      <div className="row">
        <div className="col-xs-12 col-md-10 offset-md-1">
          <h4>{username}</h4>
          {bio && <p>{bio}</p>}
        </div>
      </div>
    </div>
  </div>
);

const ProfileTabs = daggy.taggedSum('ProfileTabs', {
  ArticlesTab: [],
  FavoritesTab: [],
});

const Tab = ({tab, active, username}) => (
  <li className="nav-item">
    {tab.cata({
      ArticlesTab: () => (
        <Link
          className={classnames('nav-link', {active})}
          href={safeHref(Routes.Profile(username))}
        >
          My Articles
        </Link>
      ),
      FavoritesTab: () => (
        <Link
          className={classnames('nav-link', {active})}
          href={safeHref(Routes.Favorites(username))}
        >
          My Favorites
        </Link>
      ),
    })}
  </li>
);

const Profile = connect(s => s)(
  mkComponent({
    actionType: Action,
    initialState: ({currentUser, username, tab}) => ({
      author: RemoteData.NotAsked,
      articles: RemoteData.NotAsked,
      currentUser,
      username,
      tab,
    }),
    evalFn: mkEval({
      initialize: Action.Initialize,
      handleAction,
      receive: Action.Receive,
    }),
  })(({currentUser, username, author, tab, articles}) => (
    <div>
      <Header currentUser={currentUser} route={Routes.Profile(username)} />
      <div className="home-page">
        <div className="profile-page">
          <UserInfo
            username={username}
            bio={author.map(prop('bio')).fromSuccess('')}
            relation={author.map(prop('relation')).fromSuccess(Relation.You)}
          />
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <div className="articles-toggle">
                  <div className="nav nav-pills outline-active">
                    <Tab
                      tab={ProfileTabs.ArticlesTab}
                      username={username}
                      active={ProfileTabs.ArticlesTab.is(tab)}
                    />
                    <Tab
                      tab={ProfileTabs.FavoritesTab}
                      username={username}
                      active={ProfileTabs.FavoritesTab.is(tab)}
                    />
                  </div>
                  {tab.cata({
                    ArticlesTab: () => <ArticleList articles={articles} />,
                    FavoritesTab: () => <ArticleList articles={articles} />,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  ))
);

export default Profile;

export {ProfileTabs};
