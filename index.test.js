const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }, expectedWarnings = 0) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(expectedWarnings)
}

// Type

it('generates a type scale using config values', async () => {
  await run(
    `:root { @utopia typeScale({
      minFontSize: 16,
      maxFontSize: 18,
      minTypeScale: 1.2,
      maxTypeScale: 1.25,
      positiveSteps: 5,
      negativeSteps: 2
    }); }`,
    `:root {--step-5: clamp(2.4883rem, 2.1597rem + 1.6433vi, 3.4332rem);--step-4: clamp(2.0736rem, 1.8395rem + 1.1704vi, 2.7466rem);--step-3: clamp(1.728rem, 1.5648rem + 0.8161vi, 2.1973rem);--step-2: clamp(1.44rem, 1.3295rem + 0.5527vi, 1.7578rem);--step-1: clamp(1.2rem, 1.1283rem + 0.3587vi, 1.4063rem);--step-0: clamp(1rem, 0.9565rem + 0.2174vi, 1.125rem);--step--1: clamp(0.8333rem, 0.8101rem + 0.1159vi, 0.9rem);--step--2: clamp(0.6944rem, 0.6856rem + 0.0444vi, 0.72rem); }`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

it('generates a type scale using supplied values', async () => {
  await run(
    `:root { @utopia typeScale({
      minWidth: 320,
      maxWidth: 1240,
      minFontSize: 16,
      maxFontSize: 18,
      minTypeScale: 1.2,
      maxTypeScale: 1.25,
      positiveSteps: 5,
      negativeSteps: 2,
      relativeTo: 'viewport'
    }); }`,
    `:root {--step-5: clamp(2.4883rem, 2.1597rem + 1.6433vi, 3.4332rem);--step-4: clamp(2.0736rem, 1.8395rem + 1.1704vi, 2.7466rem);--step-3: clamp(1.728rem, 1.5648rem + 0.8161vi, 2.1973rem);--step-2: clamp(1.44rem, 1.3295rem + 0.5527vi, 1.7578rem);--step-1: clamp(1.2rem, 1.1283rem + 0.3587vi, 1.4063rem);--step-0: clamp(1rem, 0.9565rem + 0.2174vi, 1.125rem);--step--1: clamp(0.8333rem, 0.8101rem + 0.1159vi, 0.9rem);--step--2: clamp(0.6944rem, 0.6856rem + 0.0444vi, 0.72rem); }`,
    {}
  )
})

it('generates a container query type scale using supplied values', async () => {
  await run(
    `:root { @utopia typeScale({
      minWidth: 320,
      maxWidth: 1240,
      minFontSize: 16,
      maxFontSize: 18,
      minTypeScale: 1.2,
      maxTypeScale: 1.25,
      positiveSteps: 5,
      negativeSteps: 2,
      relativeTo: 'container'
    }); }`,
    `:root {--step-5: clamp(2.4883rem, 2.1597rem + 1.6433cqi, 3.4332rem);--step-4: clamp(2.0736rem, 1.8395rem + 1.1704cqi, 2.7466rem);--step-3: clamp(1.728rem, 1.5648rem + 0.8161cqi, 2.1973rem);--step-2: clamp(1.44rem, 1.3295rem + 0.5527cqi, 1.7578rem);--step-1: clamp(1.2rem, 1.1283rem + 0.3587cqi, 1.4063rem);--step-0: clamp(1rem, 0.9565rem + 0.2174cqi, 1.125rem);--step--1: clamp(0.8333rem, 0.8101rem + 0.1159cqi, 0.9rem);--step--2: clamp(0.6944rem, 0.6856rem + 0.0444cqi, 0.72rem); }`,
    {}
  )
})

it('generates a type scale with no negative steps', async () => {
  await run(
    `:root { @utopia typeScale({
      minWidth: 320,
      maxWidth: 1240,
      minFontSize: 16,
      maxFontSize: 18,
      minTypeScale: 1.2,
      maxTypeScale: 1.25,
      positiveSteps: 5,
      negativeSteps: 0,
    }); }`,
    `:root {--step-5: clamp(2.4883rem, 2.1597rem + 1.6433vi, 3.4332rem);--step-4: clamp(2.0736rem, 1.8395rem + 1.1704vi, 2.7466rem);--step-3: clamp(1.728rem, 1.5648rem + 0.8161vi, 2.1973rem);--step-2: clamp(1.44rem, 1.3295rem + 0.5527vi, 1.7578rem);--step-1: clamp(1.2rem, 1.1283rem + 0.3587vi, 1.4063rem);--step-0: clamp(1rem, 0.9565rem + 0.2174vi, 1.125rem); }`,
    {}
  )
})

it('generates nothing with empty config', async () => {
  await run(
    `:root { @utopia typeScale(); }`,
    `:root { }`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

it('generates a type scale which violates WCAG SC 1.4.4', async () => {
  await run(
    `:root { @utopia typeScale({
        minWidth: 320,
        maxWidth: 1240,
        minFontSize: 16,
        maxFontSize: 48,
        minTypeScale: 1.2,
        maxTypeScale: 1.25,
        positiveSteps: 5,
        negativeSteps: 2,
      }); }`,
      `:root {--step-5: clamp(2.4883rem, 0.1694rem + 11.5947vi, 9.1553rem);--step-4: clamp(2.0736rem, 0.2473rem + 9.1315vi, 7.3242rem);--step-3: clamp(1.728rem, 0.291rem + 7.185vi, 5.8594rem);--step-2: clamp(1.44rem, 0.3104rem + 5.6478vi, 4.6875rem);--step-1: clamp(1.2rem, 0.313rem + 4.4348vi, 3.75rem);--step-0: clamp(1rem, 0.3043rem + 3.4783vi, 3rem);--step--1: clamp(0.8333rem, 0.2884rem + 2.7246vi, 2.4rem);--step--2: clamp(0.6944rem, 0.2682rem + 2.1314vi, 1.92rem); }`,
      {},
      1,
  )
})

// Space

it('generates a space scale using config values', async () => {
  await run(
    `:root {
        @utopia spaceScale({
        minSize: 16,
        maxSize: 18,
        positiveSteps: [1.5, 2, 3, 4, 5],
        negativeSteps: [0.75, 0.5, 0.25],
        customSizes: ['s-l', '3xl-s'],
      }); }`,
    `:root {--space-3xs: clamp(0.25rem, 0.2283rem + 0.1087vi, 0.3125rem);--space-2xs: clamp(0.5rem, 0.4783rem + 0.1087vi, 0.5625rem);--space-xs: clamp(0.75rem, 0.7065rem + 0.2174vi, 0.875rem);--space-s: clamp(1rem, 0.9565rem + 0.2174vi, 1.125rem);--space-m: clamp(1.5rem, 1.4348rem + 0.3261vi, 1.6875rem);--space-l: clamp(2rem, 1.913rem + 0.4348vi, 2.25rem);--space-xl: clamp(3rem, 2.8696rem + 0.6522vi, 3.375rem);--space-2xl: clamp(4rem, 3.8261rem + 0.8696vi, 4.5rem);--space-3xl: clamp(5rem, 4.7826rem + 1.087vi, 5.625rem);--space-3xs-2xs: clamp(0.25rem, 0.1413rem + 0.5435vi, 0.5625rem);--space-2xs-xs: clamp(0.5rem, 0.3696rem + 0.6522vi, 0.875rem);--space-xs-s: clamp(0.75rem, 0.6196rem + 0.6522vi, 1.125rem);--space-s-m: clamp(1rem, 0.7609rem + 1.1957vi, 1.6875rem);--space-m-l: clamp(1.5rem, 1.2391rem + 1.3043vi, 2.25rem);--space-l-xl: clamp(2rem, 1.5217rem + 2.3913vi, 3.375rem);--space-xl-2xl: clamp(3rem, 2.4783rem + 2.6087vi, 4.5rem);--space-2xl-3xl: clamp(4rem, 3.4348rem + 2.8261vi, 5.625rem);--space-s-l: clamp(1rem, 0.5652rem + 2.1739vi, 2.25rem);--space-3xl-s: clamp(1.125rem, 6.3478rem + -6.7391vi, 5rem); }`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

it('generates a container query space scale using supplied values', async () => {
  await run(
    `:root { @utopia spaceScale({
      minWidth: 320,
      maxWidth: 1240,
      minSize: 16,
      maxSize: 18,
      positiveSteps: [1.5, 2, 3, 4, 5],
      negativeSteps: [0.75, 0.5, 0.25],
      customSizes: ['s-l', '3xl-s'],
      usePx: 'true',
      relativeTo: 'container',
      prefix: 'test',
    }); }`,
    `:root {--test-3xs: clamp(4px, 3.6522px + 0.1087cqi, 5px);--test-2xs: clamp(8px, 7.6522px + 0.1087cqi, 9px);--test-xs: clamp(12px, 11.3043px + 0.2174cqi, 14px);--test-s: clamp(16px, 15.3043px + 0.2174cqi, 18px);--test-m: clamp(24px, 22.9565px + 0.3261cqi, 27px);--test-l: clamp(32px, 30.6087px + 0.4348cqi, 36px);--test-xl: clamp(48px, 45.913px + 0.6522cqi, 54px);--test-2xl: clamp(64px, 61.2174px + 0.8696cqi, 72px);--test-3xl: clamp(80px, 76.5217px + 1.087cqi, 90px);--test-3xs-2xs: clamp(4px, 2.2609px + 0.5435cqi, 9px);--test-2xs-xs: clamp(8px, 5.913px + 0.6522cqi, 14px);--test-xs-s: clamp(12px, 9.913px + 0.6522cqi, 18px);--test-s-m: clamp(16px, 12.1739px + 1.1957cqi, 27px);--test-m-l: clamp(24px, 19.8261px + 1.3043cqi, 36px);--test-l-xl: clamp(32px, 24.3478px + 2.3913cqi, 54px);--test-xl-2xl: clamp(48px, 39.6522px + 2.6087cqi, 72px);--test-2xl-3xl: clamp(64px, 54.9565px + 2.8261cqi, 90px);--test-s-l: clamp(16px, 9.0435px + 2.1739cqi, 36px);--test-3xl-s: clamp(18px, 101.5652px + -6.7391cqi, 80px); }`,
    {}
  )
})

it('generates nothing with empty config on a space scale', async () => {
  await run(
    `:root { @utopia spaceScale(); }`,
    `:root { }`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

// Clamps

it('generates a set of clamps using supplied values', async () => {
  await run(
    `.test{ @utopia clamps({
      minWidth: 320,
      maxWidth: 1240,
      pairs: [[16, 40], [48, 20]],
      usePx: true,
      prefix: 'test',
      relativeTo: 'container'
    }); }`,
    `.test{--test-16-40: clamp(16px, 7.6522px + 2.6087cqi, 40px);--test-48-20: clamp(20px, 57.7391px + -3.0435cqi, 48px); }`,
    {}
  )
})

it('generates nothing with empty config on a clamp scale', async () => {
  await run(
    `:root { @utopia clamps(); }`,
    `:root { }`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

// Clamp

it('generates a clamp using config values', async () => {
  await run(
    `.test{ background: red; padding: utopia.clamp(16, 40); }`,
    `.test{ background: red; padding: clamp(1rem, 0.4783rem + 2.6087vi, 2.5rem); }`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

it('generates a clamp using supplied values', async () => {
  await run(
    `.test{ background: red; padding: utopia.clamp(16, 40, 475, 1340); }`,
    `.test{ background: red; padding: clamp(1rem, 0.1763rem + 2.7746vi, 2.5rem); }`,
    {}
  )
})

it('generates a clamp in shorthand form using supplied values', async () => {
  await run(
    `.test{ background: red; padding: 1rem 0.5rem utopia.clamp(16, 40, 475, 1340); }`,
    `.test{ background: red; padding: 1rem 0.5rem clamp(1rem, 0.1763rem + 2.7746vi, 2.5rem); }`,
    {}
  )
})

it('generates a clamp in shorthand form', async () => {
  await run(
    `.test{ background: red; padding: 1rem utopia.clamp(16, 40, 475, 1340); }`,
    `.test{ background: red; padding: 1rem clamp(1rem, 0.1763rem + 2.7746vi, 2.5rem); }`,
    {}
  )
})

it('generates two clamps in shorthand form', async () => {
  await run(
    `.test{ background: red; padding: utopia.clamp(16, 40, 475, 1340) utopia.clamp(16, 40, 475, 1340); }`,
    `.test{ background: red; padding: clamp(1rem, 0.1763rem + 2.7746vi, 2.5rem) clamp(1rem, 0.1763rem + 2.7746vi, 2.5rem); }`,
    {}
  )
})

it('skips native clamp', async () => {
  await run(
    `.test{ background: red; margin: clamp(0.7813rem, 0.7747rem + 0.0326vi, 0.8rem);}`,
    `.test{ background: red; margin: clamp(0.7813rem, 0.7747rem + 0.0326vi, 0.8rem);}`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

it('skips declarations without utopia.clamp', async () => {
  await run(
    `.test{ background: red; }`,
    `.test{ background: red; }`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

it('works with empty declarations', async () => {
  await run(
    `.test{}`,
    `.test{}`,
    { minWidth: 320, maxWidth: 1240 }
  )
})

it('works with empty input', async () => {
  await run(
    ``,
    ``,
    { minWidth: 320, maxWidth: 1240 }
  )
})
