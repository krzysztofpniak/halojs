import setupEval from '../../../../halo/testing/setupEval';
import Pair from '../../../../halo/helpers/pair';
import evalFn from '../evalFn';
import Action from '../action';
import show from 'sanctuary-show';
import RemoteData from '../../../../halo/helpers/remoteData';
import Tabs from '../tabs';
import initialState from '../initialState';

const stateX = state => `State: ${show(state)}`;
const getArticlesDesc = args => `GetArticles: ${show(args)}`;

//TODO
const appEffects = {
  GetTags: () => Pair(['GetTags'], RemoteData.Success(['a', 'b', 'c'])),
  GetAuthor: () => Pair(['GetAuthor'], ['ads']),
  Authenticate: () => Pair(['Authenticate'], ['ads']),
  Notify: () => Pair(['asd'], ['ads']),
  GetArticles: args =>
    Pair([getArticlesDesc(args)], RemoteData.Success(['d', 'e', 'f'])),
  GetFeed: () => Pair(['GetFeed'], RemoteData.Success(['d', 'e', 'f'])),
  GetCurrentUser: () => Pair(['asd'], ['ads']),
  PutUser: () => Pair(['asd'], ['ads']),
  GetArticle: () => Pair(['GetArticle'], RemoteData.Success({a: 'hello'})),
  CreateArticle: () => Pair(['asd'], ['ads']),
  UpdateArticle: () => Pair(['asd'], ['ads']),
};

const tagsSuccess = RemoteData.Success(['a', 'b', 'c']);
const tagsFailed = RemoteData.Failure({message: 'failed to load'});
const articlesSuccess = RemoteData.Success(['d', 'e', 'f']);

describe('home', () => {
  describe('evalFn', () => {
    const {initialize, dispatch, putState, getState, addEffects} =
      setupEval(evalFn);
    beforeEach(() => {
      putState(initialState);
      addEffects(appEffects);
    });

    it('should initialize', () => {
      expect(initialize()).toEqual(
        Pair(
          [
            stateX({...initialState, tags: RemoteData.Loading}),
            'GetTags',
            stateX({
              ...initialState,
              tags: tagsSuccess,
            }),
            stateX({
              ...initialState,
              tags: tagsSuccess,
              articles: RemoteData.Loading,
            }),
            getArticlesDesc({limit: 10, offset: 0}),
            stateX({
              ...initialState,
              tags: tagsSuccess,
              articles: articlesSuccess,
            }),
          ],
          ''
        )
      );

      expect(getState()).toEqual({
        ...initialState,
        tags: tagsSuccess,
        articles: articlesSuccess,
      });
    });

    describe('handleAction', () => {
      it('GetTags', () => {
        expect(dispatch(Action.LoadTags).fst).toEqual([
          stateX({...initialState, tags: RemoteData.Loading}),
          'GetTags',
          stateX({...initialState, tags: tagsSuccess}),
        ]);
        expect(getState()).toEqual({...initialState, tags: tagsSuccess});
      });

      it('GetTags failed', () => {
        addEffects({
          GetTags: () => Pair(['GetTags'], tagsFailed),
        });
        expect(dispatch(Action.LoadTags).fst).toEqual([
          stateX({...initialState, tags: RemoteData.Loading}),
          'GetTags',
          stateX({...initialState, tags: tagsFailed}),
        ]);
        expect(getState()).toEqual({...initialState, tags: tagsFailed});
      });

      describe('ShowTab', () => {
        it('should handle ShowTab.Tag', () => {
          expect(dispatch(Action.ShowTab(Tabs.Tag('some-tag'))).fst).toEqual([
            stateX(initialState),
            stateX({...initialState, tab: Tabs.Tag('some-tag')}),
            stateX({
              ...initialState,
              tab: Tabs.Tag('some-tag'),
              articles: RemoteData.Loading,
            }),
            getArticlesDesc({limit: 10, tag: 'some-tag'}),
            stateX({
              ...initialState,
              tab: Tabs.Tag('some-tag'),
              articles: articlesSuccess,
            }),
          ]);
        });
        it('should handle ShowTab.Feed', () => {
          expect(dispatch(Action.ShowTab(Tabs.Feed)).fst).toEqual([
            stateX(initialState),
            stateX({...initialState, tab: Tabs.Feed}),
            stateX({
              ...initialState,
              tab: Tabs.Feed,
              articles: RemoteData.Loading,
            }),
            'GetFeed',
            stateX({
              ...initialState,
              tab: Tabs.Feed,
              articles: articlesSuccess,
            }),
          ]);
        });
        it('should handle ShowTab.Global (not changed)', () => {
          expect(dispatch(Action.ShowTab(Tabs.Global)).fst).toEqual([
            stateX(initialState),
          ]);
        });

        it('should handle ShowTab.Global', () => {
          putState({...initialState, tab: Tabs.Feed});
          expect(dispatch(Action.ShowTab(Tabs.Global)).fst).toEqual([
            stateX({...initialState, tab: Tabs.Feed}),
            stateX({...initialState, tab: Tabs.Global}),
            stateX({
              ...initialState,
              tab: Tabs.Global,
              articles: RemoteData.Loading,
            }),
            getArticlesDesc({limit: 10, offset: 0}),
            stateX({
              ...initialState,
              tab: Tabs.Global,
              articles: articlesSuccess,
            }),
          ]);
        });
      });
    });
  });
});
