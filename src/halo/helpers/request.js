import {Endpoint, endpointCodec, noArticlesParams} from '../../data/endpoint';

// defaultRequest :: BaseURL -> Maybe Token -> RequestOptions -> Request Json
// defaultRequest (BaseURL baseUrl) auth { endpoint, method } =
//   { method: Left requestMethod
//   , url: baseUrl <> print endpointCodec endpoint
//   , headers: case auth of
//       Nothing -> []
//       Just (Token t) -> [ RequestHeader "Authorization" $ "Token " <> t ]
//   , content: RB.json <$> body
//   , username: Nothing
//   , password: Nothing
//   , timeout: Nothing
//   , withCredentials: false
//   , responseFormat: RF.json
//   }
//   where
//   Tuple requestMethod body = case method of
//     Get -> Tuple GET Nothing
//     Post b -> Tuple POST b
//     Put b -> Tuple PUT b
//     Delete -> Tuple DELETE Nothing

import {print} from './routeDuplex/routeduplex';
import daggy from 'daggy';
import {mergeRight} from 'ramda';
import Maybe from './maybe';

const defaultRequest = (baseUrl, auth, {endpoint, method}) => ({
  method,
  url: baseUrl + print(endpointCodec, endpoint),
});

const RequestMethod = daggy.taggedSum('RequestMethod', {
  Get: [],
  Post: ['content'],
  Put: ['content'],
  Delete: [],
});

const mkAuthRequest = opts => defaultRequest('baseUrl', 'token', opts);

console.log(
  'mkAuthRequest',
  mkAuthRequest({
    endpoint: Endpoint.Articles(
      mergeRight(noArticlesParams, {
        tag: Maybe.Just('asd'),
        offset: Maybe.Just('12'),
      })
    ),
    method: RequestMethod.Get,
  })
);
