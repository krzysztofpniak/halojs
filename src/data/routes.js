import daggy from 'daggy';
import {equals} from 'ramda';
import {
  noArgs,
  parse,
  path,
  print,
  root,
  segment,
  suffix,
  sum,
} from '../halo/helpers/routeDuplex/routeduplex';

const Routes = daggy.taggedSum('Routes', {
  Home: [],
  Login: [],
  Register: [],
  Settings: [],
  Editor: [],
  EditArticle: ['slug'],
  Profile: ['username'],
  Favorites: ['username'],
  ViewArticle: ['slug'],
});

Routes.prototype.equals = function (other) {
  return (
    other &&
    other['@@tag'] === this['@@tag'] &&
    equals(this['@@values'], other['@@values'])
  );
};

const routeCodec = root(
  sum(Routes)({
    Home: noArgs,
    Login: path('login', noArgs),
    Register: path('register', noArgs),
    Settings: path('settings', noArgs),
    Editor: path('editor', noArgs),
    EditArticle: path('editor', segment),
    Profile: path('profile', segment),
    Favorites: suffix(path('profile', segment), 'favorites'),
    ViewArticle: path('article', segment),
  })
);

const safeHref = o => print(routeCodec, o);

export {Routes, safeHref, routeCodec};
