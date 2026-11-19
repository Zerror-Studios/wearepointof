// The page a visitor was on before entering /universe; its Close button returns there.
// Falls back to the homepage when they landed on /universe directly.
let exitPath = "/";

export const rememberExitPath = (path) => {
  exitPath = path;
};

export const getExitPath = () => exitPath;
