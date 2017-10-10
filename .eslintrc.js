/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
    parser: 'babel-eslint',

    extends: [
      'bengler',
      'bengler/react',
      'plugin:css-modules/recommended'
    ],

    plugins: [
      'css-modules',
    ],

    globals: {
      __DEV__: true,
    },

    env: {
      browser: true,
    },

    rules: {
      'import/no-extraneous-dependencies': 'off',

      // Recommend not to leave any console.log in your code
      // Use console.error, console.warn and console.info instead
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],

      // Allow js files to use jsx syntax, too
      'react/jsx-filename-extension': 'off',
      'no-underscore-dangle': 'off',
      'camelcase': 'off',
      'id-length': 'off',
      'callback-return': 'off',
      'no-process-env': 'off',
      'no-mixed-operators': 'off',

      // https://github.com/kriasoft/react-starter-kit/pull/961
      // You can reopen this if you still want this rule
      'react/prefer-stateless-function': 'off',
    },
  };
