import React, {Fragment} from 'react';
import {connect, H, Link, mkComponent, mkEval} from '../../halo/halo';
import Header from '../components/header';
import {Routes, safeHref} from '../../data/routes';
import {assoc, mergeLeft, prop} from 'ramda';
import Footer from '../../footer';
import daggy from 'daggy';
import RemoteData from '../../halo/helpers/remoteData';
import go from '../../halo/helpers/go';
import {A} from '../appM';

const Action = daggy.taggedSum('Action', {
  Initialize: [],
  Receive: ['input'],
  LoadArticle: [],
});

const handleAction = action =>
  action.cata({
    Initialize: () => H.fork(handleAction(Action.LoadArticle)),
    Receive: input => H.modify(mergeLeft(input)),
    LoadArticle: () =>
      go(function* () {
        const {slug} = yield H.modify(assoc('article', RemoteData.Loading));
        const article = yield A.getArticle(slug);
        return H.modify(assoc('article', article));
      }),
  });

const Banner = ({article}) => (
  <div className="banner">
    <div className="container">
      <h1>{article.title}</h1>
      <div className="article-meta">
        <Link href={safeHref(Routes.Profile(article.author.username))}>
          <img src={article.author.image} />
        </Link>
        <div className="info">
          <Link
            className="author"
            href={safeHref(Routes.Profile(article.author.username))}
          >
            {article.author.username}
          </Link>
          <span className="date">{article.createdAt}</span>
        </div>
        <span>
          <Link
            href={safeHref(Routes.EditArticle(article.slug))}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="ion-edit" />
            {' Edit Article'}
          </Link>{' '}
          <button className="btn btn-outline-danger btn-sm">
            <i className="ion-trash-a" />
            {' Delete Article'}
          </button>
        </span>
      </div>
    </div>
  </div>
);

const Content = ({article}) => (
  <div className="container page">
    <div className="col-xs-12">{article.body}</div>
  </div>
);

const ViewArticle = connect(s => s)(
  mkComponent({
    actionType: Action,
    initialState: ({currentUser}) => ({
      currentUser,
      article: RemoteData.NotAsked,
    }),
    evalFn: mkEval({
      initialize: Action.Initialize,
      handleAction,
      receive: Action.Receive,
    }),
  })(({currentUser, slug, article}) => (
    <div>
      <Header currentUser={currentUser} route={Routes.ViewArticle(slug)} />
      <div className="article-page">
        {article.cata({
          NotAsked: () => 'not asked',
          Loading: () => 'Loading',
          Success: article => (
            <Fragment>
              <Banner article={article} />
              <Content article={article} />
            </Fragment>
          ),
          Failure: () => 'error',
        })}
        <Footer />
      </div>
    </div>
  ))
);

export default ViewArticle;
