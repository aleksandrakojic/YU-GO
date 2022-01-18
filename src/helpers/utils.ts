export const findCommentArrayElements = (arr1: Array<any>, arr2: Array<any>): boolean =>
	arr1?.some((item) => arr2?.includes(item));

export const getEligibleFormattedContests = (allContests, organization, account) => {
	if (allContests && organization) {
		const eligible = allContests?.filter(
			(c) =>
				(findCommentArrayElements(organization?.attributes?.thematics, c?.attributes?.thematics) &&
					c?.attributes?.countries?.includes(organization?.attributes?.country)) ||
				c?.attributes?.addrGrantOrga?.toLowerCase() === account?.toLowerCase()
		);
		return eligible?.map((c) => ({ id: c?.id, ...c?.attributes }));
	}
	return [];
};
