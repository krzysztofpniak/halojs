import '../App.css';
import {useEffect, useMemo, useRef, useState} from 'react';
import {axisBottom, axisLeft, scaleBand, scaleLinear, scaleTime} from 'd3';
import {select} from 'd3-selection';
import {area, curveStepAfter} from 'd3-shape';
import {extent} from 'd3-array';
import {timeMonth, timeYear} from 'd3-time';
import {
  add,
  always,
  assoc,
  chain,
  concat,
  evolve,
  groupBy,
  map,
  mapAccum,
  nth,
  pipe,
  prop,
  reduce,
  sortBy,
  values,
} from 'ramda';
import daggy from 'daggy';
import {liftF} from '../halo/helpers/free';
import {after, attempt, Future, resolve} from 'fluture';
import Pair from '../halo/helpers/pair';
import {
  createSub,
  get,
  liftFuture,
  mkComponent,
  mkEval,
  modify,
  raise,
  subscribe,
} from '../halo/halo';
import Router from './components/router';
import ST from '../halo/helpers/ST';
import go from '../halo/helpers/go';
import Home from './pages/home';
import Login from '../login';
import Profile, {ProfileTabs} from './pages/profile';
import Settings from './pages/settings';
import Editor from './pages/editor';
import Maybe from '../halo/helpers/maybe';
import ViewArticle from './pages/viewArticle';
import {routeCodec, Routes} from '../data/routes';

console.log(
  go(function* () {
    const ref = yield ST.new('dupa');
    yield ST.write('jaśko', ref);
    return ST.read(ref);
  }).run()
);

const containers = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'auto auto auto',
  columnGap: '10px',
  rowGap: '15px',
  height: '400px',
};

const y = [
  {date: new Date('2022-01-01'), value: 104},
  {date: new Date('2022-01-02'), value: 12},
  {date: new Date('2022-01-03'), value: 34},
  {date: new Date('2022-03-01'), value: 44},
  {date: new Date('2022-02-01'), value: 74},
  {date: new Date('2022-04-01'), value: 12},
  {date: new Date('2022-02-01'), value: 101},
  {date: new Date('2022-01-01'), value: 54},
];

const z = [
  {date: new Date('2022-01-01'), value: 104},
  {date: new Date('2022-03-12'), value: 12},
  {date: new Date('2022-01-13'), value: 34},
  {date: new Date('2022-03-01'), value: 44},
  {date: new Date('2022-02-01'), value: 74},
  {date: new Date('2022-04-11'), value: 12},
  {date: new Date('2022-02-21'), value: 101},
  {date: new Date('2022-01-11'), value: 54},
];

var margin = {top: 20, right: 20, bottom: 70, left: 40},
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

const Axis = ({scale, x, y}) => {
  const axisRef = useRef();

  const xAxis = axisBottom(scale).ticks(5);

  useEffect(() => {
    select(axisRef.current)
      .attr('transform', `translate(${x},${y})`)
      .call(xAxis);
  }, [scale, x, y]);

  return <g ref={axisRef} />;
};

const zz = pipe(
  concat,
  groupBy(prop('date')),
  map(reduce((p, c) => ({...c, value: p.value + c.value}), {value: 0})),
  values,
  sortBy(prop('date')),
  mapAccum((acc, c) => [acc + c.value, {...c, value: c.value + acc}], 0),
  nth(1)
);

const data = zz(y, z);

const Chart = ({data}) => {
  const divRef = useRef();
  const svgRef = useRef();
  const xAxisRef = useRef();
  const yAxisRef = useRef();
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(400);

  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];

  const xScale = useMemo(
    () =>
      scaleTime()
        .range(xRange)
        .domain(extent(data, prop('date'))),
    [width]
  );

  const xBand = scaleBand()
    .domain(timeYear.range(...xScale.domain()))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

  console.log(
    xBand.bandwidth(),
    timeMonth.range(...xScale.domain()),
    xScale.domain()
  );

  useEffect(() => {
    //startSR();
  }, []);

  const yScale = useMemo(
    () =>
      scaleLinear()
        .range(yRange)
        .domain(extent(data, prop('value'))),
    [width]
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        console.log('entry', entry.contentRect.height);
        setWidth(entry.contentRect.width);
        //setHeight(entry.contentRect.height);
      }

      //console.log('Size changed');
    });

    resizeObserver.observe(divRef.current);

    //var	parseDate = d3.time.format("%Y-%m").parse;

    const yAxis = axisLeft(yScale).tickSizeOuter(0);

    //.tickFormat(d3.time.format("%Y-%m"));

    select(yAxisRef.current)
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);
  }, [width, height]);

  const d = area()
    .curve(curveStepAfter)
    .x(pipe(prop('date'), xScale))
    .y0(height - margin.bottom)
    .y1(pipe(prop('value'), yScale))(data);

  return (
    <div ref={divRef} style={{overflow: 'hidden'}}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{width: '100%', height: '100%'}}
      >
        {/*<g ref={xAxisRef} />*/}
        <Axis scale={xScale} x={0} y={height - margin.bottom} />
        <g ref={yAxisRef} />
        <path d={d} stroke="black" />
      </svg>
    </div>
  );
};

const Console = daggy.taggedSum('Console', {Print: ['s'], Read: []});

const interpret = x =>
  x.cata({
    Print: x => attempt(() => console.log(x)),
    Read: () => resolve('jasko'),
  });

const print = x => liftF(Console.Print(x));
const read = liftF(Console.Read);

const app = print('a')
  .chain(() => read)
  .chain(x => print('b' + x))
  .chain(() => print('c'))
  .chain(() => print('d'))
  .chain(() => print('e'));

const interpret2 = x =>
  x.cata({
    Print: s => Pair([`contents for ${s}`])(''),
    Read: () => Pair([`read`])('some result'),
  });

//const res = app.foldMap(interpret2, Pair([]));
//console.log(res);

//console.log('Future');

const forever = f =>
  Future['fantasy-land/chainRec']((next, done, value) => {
    return chain(() => resolve(next(value + 10)), f);
  }, 1);

const x = chain(
  z => attempt(() => console.log('qqq', z)),
  after(10000)('jasko')
);

//example

const Action = daggy.taggedSum('Action', {
  init: [],
  inc: [],
  dec: [],
  incBy: ['step'],
  tick: [],
  rec: ['input'],
});

const Output = daggy.taggedSum('Output', {Tick: []});

const timer = data =>
  chain(({emitter, listener}) => {
    setInterval(() => listener(data), 1000);

    return resolve(emitter);
  })(createSub);

const timer1 = data =>
  chain(({emitter, listener}) => forever(after(1000)(data)))(createSub);

const handleAction = action =>
  action.cata({
    init: () => subscribe(timer(Action.tick)),
    inc: () =>
      modify(evolve({counter: add(1)}))
        .chain(() => get())
        .chain(q => liftFuture(after(2000)('Hi')))
        .chain(t => modify(evolve({counter: add(1)}))),
    dec: () => modify(evolve({counter: add(-1)})),
    incBy: step => modify(evolve({counter: add(step)})),
    tick: () =>
      modify(evolve({counter: add(-1)})).chain(() => raise(Output.Tick)),
    rec: ({label}) => modify(assoc('innerLabel', label)),
  });

const Test = mkComponent({
  initialState: always({counter: 0, innerLabel: 'Go'}),
  actionType: Action,
  evalFn: mkEval({
    handleAction,
    initialize: Action.init,
    receive: Action.rec,
  }),
})(({counter, innerLabel, inc, incBy}) => (
  <div>
    <pre>{counter}</pre>
    <button onClick={inc}>{innerLabel}</button>
    <button onClick={() => incBy(5)}>Inc by 5</button>
  </div>
));

const Host = mkComponent({actionType: Action, evalFn: mkEval({handleAction})})(
  ({Slot}) => (
    <div>
      <div>Host:</div>
      <div>
        <Slot component={Test} label="sd" />
      </div>
    </div>
  )
);

const routes = {
  Home: () => <Home />,
  Login: () => <Login />,
  Register: () => <div>register</div>,
  Profile: username => (
    <Profile username={username} tab={ProfileTabs.ArticlesTab} />
  ),
  Favorites: username => (
    <Profile username={username} tab={ProfileTabs.FavoritesTab} />
  ),
  Settings: () => <Settings />,
  Editor: () => <Editor slug={Maybe.Nothing} />,
  EditArticle: slug => <Editor slug={Maybe.Just(slug)} />,
  ViewArticle: slug => <ViewArticle slug={slug} />,
};

function App() {
  return (
    <Router
      routes={routes}
      routeCodec={routeCodec}
      defaultRoute={Routes.Home}
    />
  );

  return (
    <div className="App">
      <Chart width={200} height={300} data={data} />

      <div style={containers}>
        <div>A</div>
        <div>
          <Chart data={data} />
        </div>
        <div>C</div>
        <div>D</div>
      </div>
    </div>
  );
}

export default App;
