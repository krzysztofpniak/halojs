import {invoker} from 'ramda';
import Future from './halo/helpers/future';

const fetchFuture = options => {
  const {url, ...rest} = options;
  return Future((reject, resolve) => {
    const controller = new AbortController();

    fetch(url, {...rest, signal: controller.signal}).then(resolve, reject);
    return () => controller.abort();
  });
};

const readJson = Future.encaseP(x => invoker(0, 'json')(x));

export {fetchFuture, readJson};
