import React from 'react';
import { useMoralis } from 'react-moralis';
import { ProfileType } from 'src/models';
import ActionsContainerMemberView from './ActionsContainerMemberView';
import ActionsContainerOrgaView from './ActionsContainerOrgaView';

const ActionsContainer = () => {
	const { user } = useMoralis();

	return user?.attributes?.type === ProfileType.Organization ? (
		<ActionsContainerOrgaView />
	) : (
		<ActionsContainerMemberView />
	);
};

export default ActionsContainer;
