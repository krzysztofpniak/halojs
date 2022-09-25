import daggy from 'daggy';
import {
  optional,
  print,
  RouteDuplex,
  sum,
  path,
  root,
  prefix,
} from '../halo/helpers/routeDuplex/routeduplex';
import Maybe from '../halo/helpers/maybe';
import {mergeRight} from 'ramda';

const Endpoint = daggy.taggedSum('Endpoint', {
  Articles: ['params'],
});

const noArticlesParams = {
  tag: Maybe.Nothing,
  author: Maybe.Nothing,
  favorited: Maybe.Nothing,
  offset: Maybe.Nothing,
  limit: Maybe.Nothing,
};

const endpointCodec = root(
  prefix(
    'api',
    sum(Endpoint)({
      Articles: path(
        'articles',
        RouteDuplex.params({
          tag: optional,
          author: optional,
          favorited: optional,
          offset: optional,
          limit: optional,
        })
      ),
    })
  )
);

console.log(
  'codec',
  print(
    endpointCodec,
    Endpoint.Articles(
      mergeRight(noArticlesParams, {
        tag: Maybe.Just('asd'),
        offset: Maybe.Just('12'),
      })
    )
  )
);

export {Endpoint, endpointCodec, noArticlesParams};
