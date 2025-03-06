module.exports = {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "child_process": false
      }
    }
  };
  