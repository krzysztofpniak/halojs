import {H, mkComponent, mkEval} from '../../halo/halo';
import daggy from 'daggy';
import {assoc, mergeLeft} from 'ramda';
import go from '../../halo/helpers/go';
import {parse} from '../../halo/helpers/routeDuplex/routeduplex';

const Action = daggy.taggedSum('Action', {
  Initialize: [],
  Receive: ['input'],
  RouteChange: ['input'],
});

const handleAction = action =>
  action.cata({
    Initialize: () =>
      go(function* () {
        const {defaultRoute, routeCodec} = yield H.get();
        yield H.modify(
          assoc(
            'route',
            parse(routeCodec, window.location.pathname).cata({
              Left: () => defaultRoute,
              Right: x => x,
            })
          )
        );

        const navigator = yield H.getNavigator();
        console.log('defaultRoute', navigator, defaultRoute);
        return H.subscribe(navigator.emitter.map(Action.RouteChange));
      }),
    Receive: ({currentUser, routes, defaultRoute}) =>
      H.modify(mergeLeft({currentUser, routes, defaultRoute})),
    RouteChange: z =>
      go(function* () {
        const {routeCodec} = yield H.get();
        return H.modify(
          assoc(
            'route',
            parse(routeCodec, z).cata({
              Left: () => null,
              Right: x => x,
            })
          )
        );
      }),
  });

const Router = mkComponent({
  initialState: ({routes, routeCodec, defaultRoute}) => ({
    route: null,
    routes,
    routeCodec,
    defaultRoute,
  }),
  actionType: Action,
  evalFn: mkEval({initialize: Action.Initialize, handleAction}),
})(({route, routes}) => (route ? route.cata(routes) : null));

export default Router;
