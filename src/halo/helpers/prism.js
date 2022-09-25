import {identity} from 'ramda';
import Either from './either';

const either = (left, right) => e =>
  e.cata({
    Left: left,
    Right: right,
  });

//dimap fro (either identity identity) (right (rmap to pab));
//prism bt seta = dimap seta (either pure (fmap bt)) . right'
const prism = (to, fro) => pab => d =>
  pab.rmap(to).right().dimap(fro, either(identity, identity)).runWith(d);

//d |> fro |> cata({Left: First(Nothing), Right: x => to}) |> either(identity, identity);

export {prism};
