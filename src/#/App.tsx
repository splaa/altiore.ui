import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import LoadingPage from '@components/LoadingPage';

import NestedRoute from '#/@common/#NestedRoute';
import NotFound from '#/@common/NotFoundPage';

import { ROLES } from './@store/roles';

import { useAllowedRoutes } from '../@utils/useAllowedRoutes';

import { IRoute, ROLE } from '@types';

interface IAppProps {
  userRole: ROLE;
}

export const APP_MAIN_ROUTES: IRoute[] = [
  {
    access: [ROLES.ALL],
    component: lazy(() => import('./#p/#-projectId')),
    path: '/p/:projectId',
  },
  {
    access: [ROLES.ALL],
    component: lazy(() => import('./#start/#-identifier')),
    path: '/start/:identifier',
  },
  {
    access: [ROLES.ALL],
    component: lazy(() => import('./#hi')),
    path: '/hi',
  },
  {
    access: [ROLES.GUESTS],
    component: lazy(() => import('./#login')),
    path: '/login',
  },
  {
    access: [ROLES.USERS],
    component: lazy(() => import('./#')),
    getReducers: import('./#/@store/reducers'),
    path: '/',
  },
];

export const AppJsx: React.FC<IAppProps> = ({ userRole }) => {
  const preparedRoutes = useAllowedRoutes(APP_MAIN_ROUTES, userRole);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        {preparedRoutes.map((route: IRoute) => (
          <NestedRoute key={route.path} {...route} />
        ))}
        <Redirect from="/index.html" to="/" exact />
        <Redirect from="/" to="/hi" exact />
        <Redirect to="/login" />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};
