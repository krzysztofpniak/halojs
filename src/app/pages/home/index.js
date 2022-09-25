import React from 'react';
import Header from '../../components/header';
import {connect, mkComponent} from '../../../halo/halo';
import {always, map} from 'ramda';
import classnames from 'classnames';
import RemoteData from '../../../halo/helpers/remoteData';
import ArticleList from '../../components/articleList';
import Footer from '../../../footer';
import {Routes} from '../../../data/routes';
import Action from './action';
import evalFn from './evalFn';
import Tabs from './tabs';
import initialState from './initialState';

const Banner = () => (
  <div className="banner">
    <div className="container">
      <h1 className="logo-font">
        conduit <p>A place to share your knowledge.</p>
      </h1>
    </div>
  </div>
);

const Tab = ({tab, active, ShowTab}) => (
  <li className="nav-item">
    <a
      className={classnames('nav-link', {active})}
      onClick={() => ShowTab(tab)}
      href="#"
    >
      {tab.cata({
        Feed: () => 'Your Feed',
        Global: () => 'Global Feed',
        Tag: tag => <i className="ion-pound">{tag}</i>,
      })}
    </a>
  </li>
);

const Tags = ({tags, ShowTab}) =>
  tags.cata({
    NotAsked: () => <div>Tags not loaded</div>,
    Loading: () => <div>Loading Tags</div>,
    Failure: error => <div>{`Failed loading tags: ${error}`}</div>,
    Success: tags => (
      <div className="tag-list">
        {map(
          tag => (
            <a
              key={tag}
              className="tag-default tag-pill"
              href="#"
              onClick={() => ShowTab(Tabs.Tag(tag))}
            >
              {tag}
            </a>
          ),
          tags
        )}
      </div>
    ),
  });

const Home = connect(s => s)(
  mkComponent({
    actionType: Action,
    initialState: always(initialState),
    evalFn,
  })(({tab, tags, articles, ShowTab, Slot, currentUser}) => (
    <div>
      <Header currentUser={currentUser} route={Routes.Home} />
      <div className="home-page">
        <Banner />
        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {currentUser.isJust() && (
                    <Tab
                      tab={Tabs.Feed}
                      active={Tabs.Feed.is(tab)}
                      ShowTab={ShowTab}
                    />
                  )}
                  <Tab
                    tab={Tabs.Global}
                    active={Tabs.Global.is(tab)}
                    ShowTab={ShowTab}
                  />
                  {Tabs.Tag.is(tab) && (
                    <Tab tab={tab} active ShowTab={ShowTab} />
                  )}
                </ul>
                <ArticleList articles={articles} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <Tags tags={tags} ShowTab={ShowTab} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  ))
);

export default Home;
