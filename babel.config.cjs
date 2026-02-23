module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [
    function transformImportMetaEnv() {
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.parent.type === "MemberExpression" &&
              path.parent.property.name === "env"
            ) {
              path.parentPath.replaceWith({
                type: "MemberExpression",
                object: { type: "Identifier", name: "process" },
                property: { type: "Identifier", name: "env" },
                computed: false,
              });
            }
          },
        },
      };
    },
  ],
};
