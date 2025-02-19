/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';
import {hasProtocol} from './isInternalUrl';
import type {BaseUrlOptions, BaseUrlUtils} from '@docusaurus/useBaseUrl';

function addBaseUrl(
  siteUrl: string | undefined,
  baseUrl: string,
  url: string,
  {forcePrependBaseUrl = false, absolute = false}: BaseUrlOptions = {},
): string {
  if (!url) {
    return url;
  }

  // it never makes sense to add a base url to a local anchor url
  if (url.startsWith('#')) {
    return url;
  }

  // it never makes sense to add a base url to an url with a protocol
  if (hasProtocol(url)) {
    return url;
  }

  if (forcePrependBaseUrl) {
    return baseUrl + url.replace(/^\//, '');
  }

  // /baseUrl -> /baseUrl/
  // https://github.com/facebook/docusaurus/issues/6315
  if (url === baseUrl.replace(/\/$/, '')) {
    return baseUrl;
  }

  // We should avoid adding the baseurl twice if it's already there
  const shouldAddBaseUrl = !url.startsWith(baseUrl);

  const basePath = shouldAddBaseUrl ? baseUrl + url.replace(/^\//, '') : url;

  return absolute ? siteUrl + basePath : basePath;
}

export function useBaseUrlUtils(): BaseUrlUtils {
  const {
    siteConfig: {baseUrl, url: siteUrl},
  } = useDocusaurusContext();
  return {
    withBaseUrl: (url, options) => addBaseUrl(siteUrl, baseUrl, url, options),
  };
}

export default function useBaseUrl(
  url: string,
  options: BaseUrlOptions = {},
): string {
  const {withBaseUrl} = useBaseUrlUtils();
  return withBaseUrl(url, options);
}
