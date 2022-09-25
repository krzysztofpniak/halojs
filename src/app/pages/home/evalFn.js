import {H, mkEval} from '../../../halo/halo';
import {assoc, equals, mergeLeft} from 'ramda';
import go from '../../../halo/helpers/go';
import {unit, when} from '../../../halo/helpers/fns';
import RemoteData from '../../../halo/helpers/remoteData';
import {A} from '../../appM';
import Action from './action';

const handleAction = action =>
  action.cata({
    Initialize: () =>
      go(function* () {
        yield H.fork(handleAction(Action.LoadTags));
        yield H.fork(handleAction(Action.LoadArticles({limit: 10, offset: 0})));
        return H.of('');
      }),
    Receive: input => H.modify(mergeLeft(input)),
    ShowTab: tab =>
      go(function* () {
        const st = yield H.get();

        return when(H.of)(!equals(tab, st.tab))(
          go(function* () {
            yield H.modify(assoc('tab', tab));
            return H.fork(
              handleAction(
                tab.cata({
                  Feed: () => Action.LoadFeed({limit: 10, offset: 0}),
                  Global: () => Action.LoadArticles({limit: 10, offset: 0}),
                  Tag: tag => Action.LoadArticles({limit: 10, tag}),
                })
              )
            );
          })
        );
      }),
    LoadTags: () =>
      H.modify(assoc('tags', RemoteData.Loading))
        .chain(() => A.getTags())
        .chain(tags => H.modify(assoc('tags', tags))),
    LoadArticles: params =>
      H.modify(assoc('articles', RemoteData.Loading))
        .chain(() => A.getArticles(params))
        .chain(articles => H.modify(assoc('articles', articles))),
    LoadFeed: params =>
      H.modify(assoc('articles', RemoteData.Loading))
        .chain(() => A.getCurrentUserFeed(params))
        .chain(articles => H.modify(assoc('articles', articles))),
  });

const evalFn = mkEval({
  handleAction,
  initialize: Action.Initialize,
  receive: Action.Receive,
});

export default evalFn;
