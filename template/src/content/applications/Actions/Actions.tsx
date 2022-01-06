import React from 'react';
import { Card } from '@mui/material';
import { subDays } from 'date-fns';
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

function Actions({ currentUser }: Props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const actions: IAction[] = [
    {
      id: '1',
      name: 'Action 1',
      createdAt: 'September 12, 2022',
      description:
        '"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. ',
      addrOrgaCreator: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      hasVoted: [],
      requiredFunds: 1,
      contestId: '',
      imageUrl: 'https://selflovewarrior.files.wordpress.com/2013/03/rosie-the-riveter.jpg',
      votes: 0
    },
    {
      id: '2',
      name: 'Action 2',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',

      addrOrgaCreator: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      hasVoted: [],
      requiredFunds: 5,
      contestId: '',
      imageUrl: 'https://vitamine-v.fr/wp-content/uploads/2021/02/PAC4-2.jpg',
      votes: 0
    },
    {
      id: '3',
      name: 'Action 3',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',
      addrOrgaCreator: '0x98989898989',
      hasVoted: [],
      requiredFunds: 5,
      contestId: '',
      votes: 0,
      imageUrl:
        'https://urgentactionfund.org/wp-content/uploads/2021/08/02_Primary-Logotype-horizontal-e1629302094969.png'
    },
    {
      id: '4',
      name: 'Action 4',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',

      addrOrgaCreator: '0x98989898989',
      hasVoted: [],
      requiredFunds: 5,
      contestId: '',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlkh2R8MxHiL8BMcejeInUXVv36FJLBiuaA&usqp=CAU',
      votes: 0
    },
    {
      id: '5',
      name: 'Action 5',
      createdAt: 'September 12, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ',

      addrOrgaCreator: '0x98989898989',
      hasVoted: [],
      requiredFunds: 5,
      contestId: '',
      votes: 0,
      imageUrl:
        'https://i1.wp.com/localheadlinenews.com/wp-content/uploads/2021/02/Social-Activism-Club-Logo-NRHS_web.jpg?ssl=1'
    }
  ];
  const orgContests = actions.filter((c) => c.addrOrgaCreator.toLowerCase() === currentUser?.attributes?.ethAddress);

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
          {actions.map((c) => (
            <ActionCard key={c.id} action={c} />
          ))}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {orgContests?.map((c) => (
            <ActionCard key={c.id} action={c} />
          ))}
        </TabPanel>
      </Box>
    </Card>
  );
}

export default Actions;
