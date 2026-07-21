import ycs77, { GLOB_ASTRO, GLOB_SRC, GLOB_VUE } from '@ycs77/eslint-config'

export default ycs77({
  astro: true,
  typescript: true,
  vue: true,
  ignores: [
    'src/layouts/scripts/*.astro',
  ],
})
  .append({
    files: [GLOB_ASTRO, GLOB_SRC, GLOB_VUE],
    rules: {
      'no-alert': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',

      'unused-imports/no-unused-vars': 'off',
    },
  })
  .append({
    files: [GLOB_ASTRO],
    rules: {
      'style/indent': 'off',
    },
  })
