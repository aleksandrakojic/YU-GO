import React from 'react';
import { Card } from '@mui/material';
import { subDays } from 'date-fns';
import { IMember, IMemberStatus } from 'src/models';
import MembersTable from './MembersTable';

interface Props {
	members: IMember[];
}

function Members({ members }: Props) {
	return (
		<Card>
			<MembersTable members={members} />
		</Card>
	);
}

export default Members;
