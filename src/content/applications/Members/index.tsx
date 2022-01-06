import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useContext, useEffect, useState } from 'react';

import Members from './Members';
import AddMemberModal from './AddMemberModal';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';

function OrganizationMembers() {
  const { Moralis, isAuthenticated, authenticate } = useMoralis();
  const { abi, contractAddress, currentUser } = useContext(AppContext);
  const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModalState = () => setIsModalOpen(!isModalOpen);
  const [newAddr, setNewAddr] = useState<any>(null);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      authenticate();
    }
    const subscribeFunc = async () => {
      const query = new Moralis.Query('Organisations');
      const subscription = await query.subscribe();
      subscription.on('update', (object) => {
        console.log('Organisations object updated', object);
      });
    };
    subscribeFunc();
  }, []);

  useEffect(() => {
    if (!(isLoading && isFetching && error) && newAddr) {
      const queryFunc = async () => {
        const addresses = (data as any)?.events?.ParticipantWhitelisted?.returnValues;
        if (addresses) {
          const memberAddr = addresses['addressParticipant'];
          const orgAddr = addresses['addressOrganization'];

          const Organisations = Moralis.Object.extend('Organisations');
          const query = new Moralis.Query(Organisations);
          query.equalTo('ethAddress', orgAddr.toLowerCase());
          const res = await query.first();
          console.log(memberAddr, orgAddr, res);
          res?.addUnique('whitelisted', newAddr.toLowerCase());
          res?.save();
          setNewAddr(null);
        }
      };
      queryFunc();
    }
  }, [data, isFetching, newAddr]);

  const handleSubmit = (addr: string) => {
    setIsModalOpen(false);
    setNewAddr(addr);
    const contractData: any = {
      abi,
      contractAddress,
      functionName: 'addParticipant',
      params: {
        _addrOrga: currentUser?.attributes?.ethAddress,
        _addrParticipant: addr
      }
    };
    fetch({ params: contractData });
  };

  console.log('add participant', data, isLoading, isFetching, error, newAddr);

  return (
    <>
      <PageTitleWrapper>
        <PageHeader onAddNewMember={toggleModalState} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <Members members={allMembers} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <AddMemberModal isOpen={isModalOpen} onClose={toggleModalState} onSubmit={handleSubmit} />
    </>
  );
}

export default OrganizationMembers;
