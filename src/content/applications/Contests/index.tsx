import React from 'react';
import { useMoralis } from 'react-moralis';
import { ProfileType } from 'src/models';
import ContestsMemberContainer from './ContestsMemberContainer';
import ContestsOrgaContainer from './ContestsOrgaContainer';

const ContestsContainer = () => {
	const { user } = useMoralis();

	return user?.attributes?.type === ProfileType.Organization ? (
		<ContestsOrgaContainer />
	) : (
		<ContestsMemberContainer />
	);
};

export default ContestsContainer;
