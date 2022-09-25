const Id = x => ({
  map: f => Id(f(x)),
  chain: f => f(x),
  tap: f => {
    f(x);
    return Id(x);
  },
  ['fantasy-land/map']: f => Id(f(x)),
  ['fantasy-land/ap']: f => 6,
  ['fantasy-land/chain']: f => f(x),
  extract: () => x,
  concat: o => Id(x.concat(o.extract())),
});
Id.of = x => Id(x);

export default Id;
