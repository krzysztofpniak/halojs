import React, {Fragment} from 'react';
import cx from 'classnames';
import {Routes, safeHref} from '../../data/routes';
import {Link} from '../../halo/halo';

const NavItem = ({route, currentRoute, children}) => (
  <li className="nav-item">
    <Link
      className={cx('nav-link', {active: route.equals(currentRoute)})}
      href={safeHref(route)}
    >
      {children}
    </Link>
  </li>
);

const Header = ({currentUser, route}) => (
  <nav className="navbar navbar-light">
    <div className="container">
      <Link className="navbar-brand" href={safeHref(Routes.Home)}>
        conduit
      </Link>
      <ul className="nav navbar-nav pull-xs-right">
        <NavItem route={Routes.Home} currentRoute={route}>
          Home
        </NavItem>
        {currentUser.cata({
          Nothing: () => (
            <NavItem route={Routes.Login} currentRoute={route}>
              Log in
            </NavItem>
          ),
          Just: user => (
            <Fragment>
              <NavItem route={Routes.Editor} currentRoute={route}>
                <i className="ion-compose">New Post</i>
              </NavItem>
              <NavItem route={Routes.Settings} currentRoute={route}>
                <i className="ion-gear-a">Settings</i>
              </NavItem>
              <NavItem
                route={Routes.Profile(user.username)}
                currentRoute={route}
              >
                {user.username}
              </NavItem>
            </Fragment>
          ),
        })}
      </ul>
    </div>
  </nav>
);

export default Header;
