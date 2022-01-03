import React from 'react';
import { Card } from '@mui/material';
import MembbersTable from './MembersTable';
import { subDays } from 'date-fns';
import { IMember } from 'src/models';

/* 
  id: string;
  status: IMemberStatus;
  firstname: string;
  lastname: string;
  status: MemberStatust,
  email: string;
  ethAddress: string;
  orgEthAddress: string;
*/

function Members() {
  const members: IMember[] = [
    {
      id: '1',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
      orgEthAddress: '0x90909000sdf0',
      registrationDate: new Date().getTime()
    },
    {
      id: '2',
      firstname: 'Aleks',
      lastname: 'Kojic',
      status: 'registered',
      email: 'test@test.com',
      ethAddress: '0x98989898989',
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
      <MembbersTable members={members} />
    </Card>
  );
}

export default Members;
