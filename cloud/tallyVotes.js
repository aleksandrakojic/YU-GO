Moralis.Cloud.job('tallyVote', async (request) => {
	const abi = [
		{
			inputs: [
				{
					internalType: 'address',
					name: '_creatorOfContest',
					type: 'address',
				},
			],
			name: 'tallyVotes',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address',
				},
				{
					internalType: 'address',
					name: '',
					type: 'address',
				},
				{
					internalType: 'string',
					name: '',
					type: 'string',
				},
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
			constant: true,
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_creatorOfContest',
					type: 'address',
				},
			],
			name: 'getContestWinner',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address',
				},
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
			constant: true,
		},
	];

	const web3 = Moralis.web3ByChain('0x539');
	const address = '0x1b454C5A6E7fFd0C2624f801ecAAC7f92264c703';
	const contract = new web3.eth.Contract(abi, address);
	const logger = Moralis.Cloud.getLogger();

	const Transactions = Moralis.Object.extend('Transactions');
	const queryTransactions = new Moralis.Query(Transactions);

	const query = new Moralis.Query('Contests');
	const response = await query.find();
	const currentDate = Date.now();
	let winners = [];

	for (let i = 0; i < response.length; i++) {
		let endDate = new Date(response[i].get('votingEndDate')).getTime();

		if (currentDate > endDate) {
			logger.info(JSON.stringify(response[i].get('addrGrantOrga')));
			let winner = await contract.methods
				.tallyVotes(response[i].get('addrGrantOrga'))
				.call()
				.catch((err) => {
					logger.info(JSON.stringify(err));
				});

			if (winner) {
				winners.push(winner);
			}
		}
	}

	if (winners.length > 0) {
		for (let i = 0; i < winners.length; i++) {
			const winnerValues = Object.values(winners[i]);
			const tr = await queryTransactions
				.equalTo('addrGrantOrga', winnerValues[0].toLowerCase())
				.find();

			if (tr.length === 0) {
				const newTransaction = {
					addrGrantOrga: winnerValues[0].toLowerCase(),
					addrWinner: winnerValues[1].toLowerCase(),
					actionName: winnerValues[2],
					votes: winnerValues[3],
					requiredFunds: winnerValues[4],
					agreement:
						'This transfer agreement is entered as of ' +
						new Date(Date.now()).toJSON() +
						' by and between Grant organization : ' +
						winnerValues[0] +
						' and winner organization: ' +
						winnerValues[1] +
						'. The agreed amount to be transfered to ' +
						winnerValues[1] +
						' is ' +
						winnerValues[4] +
						' ETH.',
					status: 'pending',
				};
				const t = new Transactions();
				t.save(newTransaction);
			}
		}
	}
});
