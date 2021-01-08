module.exports =  {
  "*.{ts,tsx}": [
    "prettier --write",
    "xo --fix",
    "git add"
  ],
  "*.json": [
    "prettier --write",
    "git add"
  ],
  "*.{md,mdx}": [
    "prettier --write",
    "git add"
  ],
  "*.scss": [
    "prettier --write",
    "stylelint '**/src/**/*.scss' --fix",
    "git add"
  ]
}
