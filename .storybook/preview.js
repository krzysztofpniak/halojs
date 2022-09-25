export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// export const loaders = [
//   async () => {
//     return Promise.resolve({a: 1});
//   },
// ];
//
// export const decorators = [
//   (Story, {loaded}) =>
//     console.log(loaded) || (
//       <div style={{margin: '3em'}}>
//         <Story />
//       </div>
//     ),
// ];
