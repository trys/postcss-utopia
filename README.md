# PostCSS Utopia

Generate fluid typopgraphy and space scales in PostCSS. Uses [utopia-core](https://github.com/trys/utopia-core) calculations under the hood.

### Configuration

Supplying `minWidth` and `maxWidth` when instantiating the plugin sets the default min/max viewports for all the methods below.

```js
// postcss.config.js

module.exports = {
  plugins: [
    require('postcss-utopia')({
      minWidth?: number; // Default minimum viewport
      maxWidth?: number; // Default maximum viewport
    })
  ]
}
```

## Declaration methods

Declaration methods output CSS values (in this case, a `clamp`), and follow the format of `utopia.METHOD_NAME()`.

### `utopia.clamp`

```css
h1 {
  padding: utopia.clamp(16, 40); /* Uses the plugin viewport defaults */
}

p {
  margin: utopia.clamp(16, 40, 320, 1440); /* Uses supplied viewports */
}
```

## AtRule methods

AtRule methods generate multiple lines of CSS (in the form of custom properties). They follow the format of `@utopia METHOD_NAME({})`.

### `@utopia typeScale`

Pass in any [utopia-core](https://github.com/trys/utopia-core) configuration and generate a set of fluid custom properties.

```css
:root {
  @utopia typeScale({
    minWidth: 320,          /* Defaults to plugin minWidth */
    maxWidth: 1240,         /* Defaults to plugin maxWidth */
    minFontSize: 16,
    maxFontSize: 18,
    minTypeScale: 1.2,
    maxTypeScale: 1.25,
    positiveSteps: 5,
    negativeSteps: 2,
    relativeTo: 'viewport', /* Optional */
    prefix: 'step'          /* Optional */
  });

  /* Generates
  --step--2: clamp(...);
  --step--1: clamp(...); etc.
  */
}
```

### `@utopia spaceScale`

Pass in any [utopia-core](https://github.com/trys/utopia-core) configuration and generate a set of fluid custom properties.

```css
:root {
  @utopia spaceScale({
    minWidth: 320,             /* Defaults to plugin minWidth */
    maxWidth: 1240,            /* Defaults to plugin maxWidth */
    minSize: 16,
    maxSize: 18,
    positiveSteps: [1.5, 2, 3],
    negativeSteps: [0.75, 0.5],
    customSizes: ['s-l'],
    relativeTo: 'viewport',    /* Optional */
    prefix: 'space',           /* Optional */
    usePx: false,              /* Optional */
  });

  /* Generates
  --space-2xs: clamp(...);
  --space-xs: clamp(...); etc.

  --space-2xs-xs: clamp(...); etc.

  --space-s-l: clamp(...); etc.
  */
}
```

### `@utopia clamps`

Pass in any [utopia-core](https://github.com/trys/utopia-core) configuration and generate a set of fluid custom properties.

```css
:root {
  @utopia clamps({
    minWidth: 320,         /* Defaults to plugin minWidth */
    maxWidth: 1240,        /* Defaults to plugin minWidth */
    pairs: [
      [16, 40]
    ],
    usePx: false,          /* Optional */
    prefix: 'space',       /* Optional */
    relativeTo: 'viewport' /* Optional */
  });
}
```