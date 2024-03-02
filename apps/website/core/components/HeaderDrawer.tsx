// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useState } from 'react';
import { MdClose } from 'react-icons/md/index';
import Drawer from './Drawer';
import HamburgerIcon from './HamburgerIcon';

interface HeaderDrawerProps {
  children?: React.ReactNode;
  title?: string;
}

export default function HeaderDrawer({ children, title }: HeaderDrawerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const buttonOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="justify-center sm:flex md:hidden">
      <button
        type="button"
        aria-label="Open drawer"
        className="flex items-center w-[50px] h-[50px] flex justify-center items-center"
        onClick={buttonOnClick}
      >
        {isOpen ? (
          <div className="pt-1">
            <MdClose fontSize="x-large" />
          </div>
        ) : (
          <HamburgerIcon />
        )}
      </button>
      <Drawer title={title} isOpen={isOpen} setIsOpen={setIsOpen}>
        {children}
      </Drawer>
    </div>
  );
}
