import React from 'react';
import { Card } from '@mui/material';
import { subDays } from 'date-fns';
import { IMember } from 'src/models';
import MembersTable from './MembersTable';

interface Props {
  members: IMember[];
}

function Members({ members }: Props) {
  const mockMembers: IMember[] = [
    {
      id: '1',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: new Date().getTime()
    },
    {
      id: '2',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 1).getTime()
    },
    {
      id: '3',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'pending',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 5).getTime()
    },
    {
      id: '4',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'canceled',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 55).getTime()
    },
    {
      id: '5',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 56).getTime()
    },
    {
      id: '6',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'canceled',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 33).getTime()
    },
    {
      id: '7',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: new Date().getTime()
    },
    {
      id: '8',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 22).getTime()
    },
    {
      id: '9',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 11).getTime()
    },
    {
      id: '10',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: subDays(new Date(), 123).getTime()
    }
  ];

  return (
    <Card>
      <MembersTable members={mockMembers} />
    </Card>
  );
}

export default Members;
