// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Text } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { ExtendedTokenData } from '@petra/core/types';

function TokenDescription() {
  const { state } = useLocation();
  const tokenData = state as ExtendedTokenData;
  const { data: tokenMetadata } = useTokenMetadata(tokenData);
  const tokenDescription = tokenMetadata?.description || tokenData?.description;

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isCollapsible, setIsCollapsible] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // After the first render, we determine whether to show the "see more" toggle
  useEffect(() => {
    if (textRef.current) {
      const { clientHeight, scrollHeight } = textRef.current;
      setIsCollapsible(scrollHeight > clientHeight);
    }
  }, []);

  return (
    <>
      <Text
        width="100%"
        fontSize="md"
        overflow="hidden"
        textOverflow="ellipsis"
        overflowWrap="break-word"
        noOfLines={isCollapsed ? 3 : undefined}
        ref={textRef}
      >
        {`${tokenDescription}` || (
          <FormattedMessage defaultMessage="No description" />
        )}
      </Text>
      {tokenDescription && isCollapsible ? (
        <Text
          as="u"
          cursor="pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <FormattedMessage defaultMessage="See more" />
          ) : (
            <FormattedMessage defaultMessage="See less" />
          )}
        </Text>
      ) : null}
    </>
  );
}

export default TokenDescription;
