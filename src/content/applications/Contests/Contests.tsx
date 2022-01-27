import React from 'react';
import { Card } from '@mui/material';
import { IContest } from 'src/models';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ContestCard from './ContestCard';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
						
						{children}
					</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

interface Props {
	account?: any;
	contests?: IContest[];
}

function Contests({ account, contests }: Props) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const orgContests = contests?.filter(
		(c) => c?.addrGrantOrga?.toLowerCase() === account?.toLowerCase()
	);

	return (
		<Card>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', padding: 2 }}>
					<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
						<Tab label="All Contests" {...a11yProps(0)} />
						<Tab label="Your Contests" {...a11yProps(1)} />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					{contests?.length === 0 && <h3>No Contests</h3>}
					{contests?.map((c, i) => (
						<ContestCard
							index={i}
							key={c.id}
							contest={c}
							isCreator={account?.toLowerCase() === c?.addrGrantOrga?.toLowerCase()}
						/>
					))}
				</TabPanel>
				<TabPanel value={value} index={1}>
					{orgContests?.length === 0 && <h3>No Contests</h3>}
					{orgContests?.map((c, i) => (
						<ContestCard key={c.id} contest={c} isCreator={true} index={i} />
					))}
				</TabPanel>
			</Box>
		</Card>
	);
}

export default Contests;
