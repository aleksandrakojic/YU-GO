import React from 'react';
import { Card } from '@mui/material';
import { subDays } from 'date-fns';
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
      style={{ display: 'flex' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

interface Props {
  currentUser?: any;
}

function Contests({ currentUser }: Props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const contests: IContest[] = [
    {
      id: '1',
      name: 'Contest 1',
      createdAt: 'September 12, 2022',
      description:
        '"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
      applicationEndDate: new Date().getTime(),
      addrGrantOrga: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      themes: [0, 3],
      countries: [1, 3],
      votingEndDate: subDays(new Date(), 1).getTime(),
      availableFunds: 5,
      actionsIds: []
    },
    {
      id: '2',
      name: 'Contest 2',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',
      applicationEndDate: new Date().getTime(),
      themes: [0, 3],
      addrGrantOrga: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      countries: [1, 3],
      votingEndDate: subDays(new Date(), 1).getTime(),
      availableFunds: 5,
      actionsIds: [],
      imageUrl: 'https://www.impactplus.com/hubfs/social-media-contest.jpg'
    },
    {
      id: '3',
      name: 'Contest 3',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',
      applicationEndDate: new Date().getTime(),
      themes: [0, 3],
      addrGrantOrga: '0x98989898989',
      countries: [1, 3],
      votingEndDate: subDays(new Date(), 5).getTime(),
      availableFunds: 5,
      actionsIds: []
    },
    {
      id: '4',
      name: 'Contest 4',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',
      applicationEndDate: new Date().getTime(),
      themes: [0, 3],
      addrGrantOrga: '0x98989898989',
      countries: [1, 3],
      votingEndDate: subDays(new Date(), 55).getTime(),
      availableFunds: 5,
      actionsIds: [],
      imageUrl: 'https://www.impactplus.com/hubfs/social-media-contest.jpg'
    },
    {
      id: '5',
      name: 'Contest 5',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',
      applicationEndDate: new Date().getTime(),
      themes: [0, 3],
      addrGrantOrga: '0x98989898989',
      countries: [1, 3],
      votingEndDate: subDays(new Date(), 56).getTime(),
      availableFunds: 5,
      actionsIds: []
    }
  ];
  const orgContests = contests.filter((c) => c.addrGrantOrga.toLowerCase() === currentUser?.attributes?.ethAddress);

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
          {contests.map((c) => (
            <ContestCard key={c.id} contest={c} />
          ))}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {orgContests?.map((c) => (
            <ContestCard key={c.id} contest={c} />
          ))}
        </TabPanel>
      </Box>
    </Card>
  );
}

export default Contests;
