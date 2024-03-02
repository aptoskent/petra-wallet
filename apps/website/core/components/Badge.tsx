// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

interface BadgeProps {
  children: React.ReactNode;
  text: string;
}

export default function Badge({ children, text }: BadgeProps) {
  return (
    <div>
      <span className="bg-[#D8EEEC] text-gray-800 text-xs font-medium inline-flex items-center px-1 py-1 pr-1.5 rounded-full mr-2">
        <span className="text-[#D8EEEC] font-normal rounded-full px-2 py-0.5 bg-[#1C2B43] mr-2">
          {text}
        </span>
        {children}
      </span>
    </div>
  );
}
