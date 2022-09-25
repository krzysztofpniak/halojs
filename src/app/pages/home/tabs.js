import daggy from 'daggy';

const Tabs = daggy.taggedSum('Tabs', {
  Feed: [],
  Global: [],
  Tag: ['tag'],
});

export default Tabs;
