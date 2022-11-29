// pattern 1: props.theme.colors.palette.something and theme.colors.palette.something
const replacePaletteColorPattern1 = (root, j) => {
  root.find(j.MemberExpression).forEach((p) => {
    const expression = j(p).toSource();

    // regex to match pattern theme.colors.palette.something and get the the color value 'something'
    const colorMatch = /theme.colors.palette.(?<color>\w+)/g.exec(expression);

    if (!!colorMatch) {
      const colorVal = colorMatch.groups && colorMatch.groups.color;
      console.log("colorVal: ", colorVal);
    }
  });
};

const replaceThemeReference = (root, j) => {
  replacePaletteColorPattern1(root, j);
};

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  replaceThemeReference(root, j);

  return root.toSource({ quote: "single" });
};
