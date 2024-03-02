// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import AuditIcon from '../AuditIcon';
import ControlsIcon from '../ControlsIcon';
import HardwareIcon from '../HardwareIcon';
import KeysWalletIcon from '../KeysWalletIcon';

const securityCardsContent = Object.freeze([
  {
    description:
      'Petra is a self-custodial wallet. We never have access to your assets, data, or private keys.',
    icon: <KeysWalletIcon />,
    title: 'Your keys, your wallet',
  },
  {
    description:
      'Our wallet has been independently audited by Halborn, a leader in security audits for the blockchain industry.',
    icon: <AuditIcon />,
    title: 'Industry-leading audits',
  },
  {
    description:
      'Clear visibility and control of all wallet activity with features like transaction simulation and gas customization.',
    icon: <ControlsIcon />,
    title: 'Complete user control',
  },
  {
    description:
      'Need more firepower? We support top hardware wallets like Ledger to give you an extra layer of control.',
    icon: <HardwareIcon />,
    title: 'Hardware wallet support',
  },
] as const);

interface SecurityCardProps {
  description: string;
  icon: React.ReactNode;
  title: string;
}

function SecurityCard({ description, icon, title }: SecurityCardProps) {
  return (
    <div className="flex flex-col gap-4 border-[2px] border-solid border-[#4EB1AA] rounded-3xl p-6 pb-12">
      <div className="w-16 pb-8">{icon}</div>
      <span className="sm:font-semibold sm:text-lg">{title}</span>
      <span className="font-light">{description}</span>
    </div>
  );
}

export default function LandingPageModule4() {
  return (
    <div className="flex flex-col items-center bg-[#F5F8FF] sm:px-4 md:px-16 lg:px-32">
      <div className="flex flex-col max-w-screen-2xl w-full">
        <div className="flex flex-col py-16 pb-24 md:order-first sm:order-first">
          <h2 className="text-4xl pb-16 w-full text-center sm:text-left">
            We take your security seriously
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityCardsContent.map((card) => (
              <SecurityCard
                key={card.title}
                description={card.description}
                icon={card.icon}
                title={card.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
