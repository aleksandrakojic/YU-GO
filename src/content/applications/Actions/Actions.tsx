import React from 'react';
import { Card } from '@mui/material';
import { IAction } from 'src/models';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ActionCard from './ActionCard';

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
			style={{ display: 'flex' }}
			{...other}
		>
			{value === index && (
				<Box
					sx={{
						p: 2,
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-around',
						width: '100%',
					}}
				>
					<Typography
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-around',
							width: '100%',
						}}
					>
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
	currentUser?: any;
	actions?: any[];
}

function Actions({ currentUser, actions }: Props) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const orgContests = actions?.filter(
		(c) =>
			c?.attributes?.addrOrgaCreator?.toLowerCase() ===
			currentUser?.attributes?.ethAddress?.toLowerCase()
	);

	return (
		<Card>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', padding: 2 }}>
					<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
						<Tab label="All Actions" {...a11yProps(0)} />
						<Tab label="Your Actions" {...a11yProps(1)} />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					{actions?.length === 0 && <h3>No Actions</h3>}
					{actions?.map((c, i) => (
						<ActionCard key={c.id} action={c} index={i} />
					))}
				</TabPanel>
				<TabPanel value={value} index={1}>
					{orgContests?.length === 0 && <h3>No Actions</h3>}
					{orgContests?.map((c, i) => (
						<ActionCard key={c.id} action={c} index={i} />
					))}
				</TabPanel>
			</Box>
		</Card>
	);
}

export default Actions;
