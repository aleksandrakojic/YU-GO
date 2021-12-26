import { Button, Input, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import React, { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
// import { loadContract } from "./LoadContract";
import contract from '@truffle/contract';
import contractInfo from 'contracts/Main.json';

const styles = {
	card: {
		alignItems: 'center',
		width: '50%',
	},
	select: {
		marginTop: '20px',
		display: 'flex',
		alignItems: 'center',
	},
	textWrapper: { maxWidth: '80px', width: '100%' },
	row: {
		display: 'flex',
		alignItems: 'center',
		gap: '10px',
		flexDirection: 'row',
	},
	dropdown: {
		width: '50%',
		marginTop: '20px',
		display: 'flex',
		alignItems: 'center',
	},
};

export default function CreateProfile() {
	const { contractName, networks, abi } = contractInfo;
	const contractAddress = networks[1337].address; //1337
	// console.log('address contract', contractAddress )
	const [isWhitelisted, setIsWhitelisted] = useState(null);

	const whitelistMember = async (accounts) => {
		try {
			contract.methods
				.whitelistMember(
					'0x8AB4CBE82eFE7Eae2daDDD0436D333AFb3749f10',
					'0xc9605cD51d1dAbCA9CA0f37ea4Fe78C182498cD2',
					true
				)
				.send({ from: accounts[0] })
				.then(
					contract.events.IsWhitelisted().once('data', function (event) {
						console.log('event', event);
						setIsWhitelisted(event.returnValues.isWhitelisted);
					})
				);
		} catch (e) {
			console.log('e', e);
		}
	};

	const loadContract = async (name) => {
		const web3 = await Moralis.enableWeb3();
		const contract = new web3.eth.Contract(abi, contractAddress);
		console.log('contract', contract);
		const accounts = await web3.eth.getAccounts();
		setAccount(accounts[0]);
		console.log('account', accounts[0]);
		const testConnection = await contract.methods.testConnection().send({ from: accounts[0] });
		console.log('test connection', testConnection);
		whitelistMember(accounts);

		// contract.methods.whitelistMember('0x8AB4CBE82eFE7Eae2daDDD0436D333AFb3749f10', '0xc9605cD51d1dAbCA9CA0f37ea4Fe78C182498cD2', true).send({from: accounts[0]}) //from: account 4
		return contract;
	};

	const [contract, setContract] = useState(null);
	console.log('contract', contract);
	const [account, setAccount] = useState(null);
	const [userRegistered, setUserRegistered] = useState(false);

	useEffect(() => {
		const LoadContract = async () => {
			const _contract = await loadContract();
			setContract(_contract);
		};
		LoadContract();
	}, []);

	const { Moralis } = useMoralis();

	const initialValues = {
		lastname: '',
		firstname: '',
		email: '',
		tel: '',
		orga: '',
	};

	const orgList = {
		0: {
			className: 'Organisations',
			id: 'ZDOcTqfhWadYVU7vhn68qPsl',
			_objCount: 2,
			attributes: { name: 'orgaOne', ethAddress: '0x61962Ca1467A0e7ba06787784336DaBE792Be29b' },
			updatedAt: '',
		},
		1: {
			className: 'Organisations',
			id: 'ZDOcTqfhWadYVU7vhn68qPsl',
			_objCount: 2,
			attributes: { name: 'orgaTwo', ethAddress: '0x51dE42454f3A50848e65bEDE6141Db788a9bCc5D' },
			updatedAt: '',
		},
		2: {
			className: 'Organisations',
			id: 'ZDOcTqfhWadYVU7vhn68qPsl',
			_objCount: 2,
			attributes: { name: 'orgaThree' },
			updatedAt: '',
		},
	};

	const [values, setValues] = useState(initialValues);
	const [emailIsValid, setEmailIsValid] = useState(true);

	const onChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
		console.log(values);
	};

	//|::::: handling the Dropdown with Antd :::::
	const menus = Object.entries(orgList).map((item, i) => {
		// console.log('item[1]', item[1])
		return (
			<Menu.Item key={i}>
				{item[1].attributes.name}
				{/* {key[1].country} */}
			</Menu.Item>
		);
	});
	const menu = () => {
		return (
			<Menu onClick={handleMenuClick} mode="vertical">
				{menus}
			</Menu>
		);
	};

	const handleMenuClick = (e) => {
		console.log(orgList[e.key].attributes.ethAddress);
		setValues({
			...values,
			orga: orgList[e.key].attributes.ethAddress,
		});
	};

	//|::::::::::::::::::::::::::::::::::::::::::::

	const Submit = () => {
		var pattern = new RegExp(
			/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
		);
		if (!pattern.test(values.email)) {
			setEmailIsValid(false);
		} else {
			registerParticipant();
		}
	};

	const registerParticipant = async () => {
		const currentUser = Moralis.User.current();
		// if (currentUser) {
		//         setUserRegistered(true);
		// } else {
		//     const isWhitelisted = await contract.method.participantIsWhiteListed(initialValues.orga, account).send({from: account});
		//     console.log('whitelisted', isWhitelisted)
		// }
		// const isWhitelisted = await contract.methods.participantIsWhiteListed(
		//     '0x8AB4CBE82eFE7Eae2daDDD0436D333AFb3749f10',
		//     '0xc9605cD51d1dAbCA9CA0f37ea4Fe78C182498cD2')
		//     .send({from: account});
		console.log('whitelisted', isWhitelisted);

		// if address in whitelist save data Moralis DB
		// await Moralis.authenticate().then(function (user) {
		//     console.log(user.get('ethAddress'))
		//     participant.set("ethAddress", user.get('ethAddress'))
		//     participant.save();
		// })
		const organisations = Moralis.Object.extend('Organisations');
		const query = new Moralis.Query(organisations);
		const results = await query.find();
		console.log(results[0].attributes.name);
		console.log('results', results);
		Object.entries(results).map((item, i) => {
			console.log('item', item);
			// console.log('item[i]',item[i])
		});
		console.log('in registerParticipant', values);
	};

	return (
		<div style={styles.card}>
			<div style={styles.select}>
				<div style={styles.textWrapper}>
					<Text strong>Nom:</Text>
				</div>
				<Input
					size="medium"
					name="lastname" //IMPORTANT
					onChange={onChange}
				/>
			</div>

			<div style={styles.select}>
				<div style={styles.textWrapper}>
					<Text strong>Prénom:</Text>
				</div>
				<Input size="medium" name="firstname" onChange={onChange} />
			</div>

			<div style={styles.select}>
				<div style={styles.textWrapper}>
					<Text strong>E-mail:</Text>
				</div>
				<Input size="medium" name="email" onChange={onChange} />
			</div>
			{!emailIsValid ? <Text type="danger">adresse email invalide</Text> : <></>}

			<div style={styles.select}>
				<div style={styles.textWrapper}>
					<Text strong>Tel. (Optional):</Text>
				</div>
				<Input size="medium" name="tel" onChange={onChange} />
			</div>

			<Dropdown overlay={menu}>
				{/* <Button>
                    Select your organisation <DownOutlined />
                </Button> */}
				<a
					className="ant-dropdown-link"
					style={styles.dropdown}
					name="orga"
					onClick={handleMenuClick}
				>
					Select your organisation <DownOutlined />
				</a>
			</Dropdown>

			<div className="userRegistered">
				{!userRegistered ? <></> : <Text type="danger">You are already registered</Text>}
			</div>

			<Button
				type="primary"
				size="large"
				style={{ width: '100%', marginTop: '25px' }}
				onClick={() => Submit()}
			>
				Submit
			</Button>
		</div>
	);
}
