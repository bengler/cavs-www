/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: 'e5dtp8wy',
  dataset: 'production',
});

function createFetch() {
  return (query, params) => client.fetch(query, params);
}

export default createFetch;
