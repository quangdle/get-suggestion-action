// pattern 1: props.theme.colors.palette.something and theme.colors.palette.something
const replacePaletteColorPattern1 = (root, j, report, stats) => {
  root.find(j.MemberExpression).forEach((p) => {
    const expression = j(p).toSource();

    // regex to match pattern theme.colors.palette.something and get the the color value 'something'
    const colorMatch = /theme.colors.palette.(?<color>\w+)/g.exec(expression);

    if (!!colorMatch) {
      const colorVal = colorMatch.groups && colorMatch.groups.color;
      report(`report: at ${p?.loc?.start?.line} ${colorVal}`);
      stats(`stats: at ${p?.loc?.start?.line} ${colorVal}`);
      console.log(`result: at ${p?.loc?.start?.line}`, colorVal);
    }
  });
};

const replaceThemeReference = (root, j, report, stats) => {
  replacePaletteColorPattern1(root, j, report, stats);
};

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const report = api.report;
  const stats = api.stats;
  const root = j(fileInfo.source);

  replaceThemeReference(root, j, report, stats);

  return root.toSource({ quote: "single" });
};
