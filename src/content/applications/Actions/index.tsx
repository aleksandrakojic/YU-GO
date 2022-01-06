import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useContext, useEffect, useState } from 'react';

import Contests from './Actions';
import AddActionModal from './AddActionModal';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';
import { IContest } from 'src/models';

function ActionsContainer() {
  const { Moralis, isAuthenticated, authenticate } = useMoralis();
  const { abi, contractAddress, currentUser, thematics, countries } = useContext(AppContext);
  const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModalState = () => setIsModalOpen(!isModalOpen);
  const [newAction, setNewAction] = useState<any>(null);
  const [eligibleContests, setEligibleContests] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      authenticate();
    } else {
      const query = new Moralis.Query('Organisations');
      query
        .equalTo('ethAddress', currentUser?.attributes?.ethAddress)
        .first()
        .then((organization) => {
          const country = organization?.attributes?.country;
          const contestMatchCountry = new Moralis.Query('Contests');
          contestMatchCountry
            .containedIn('countries', [country])
            .find()
            .then((contests) => {
              console.log('contests', contests);
              setEligibleContests(contests);
            });
        });
    }
    // const subscribeFunc = async () => {
    //   const query = new Moralis.Query('Contests');
    //   const subscription = await query.subscribe();
    //   subscription.on('update', (object) => {
    //     console.log('object updated', object);
    //   });
    // };
    // subscribeFunc();
  }, []);

  useEffect(() => {
    const addrGrantOrga = (data as any)?.events?.ActionCreated?.returnValues?.addressContestCreator;
    if (!(isLoading && isFetching && error) && newAction?.name && addrGrantOrga) {
      const queryFunc = async () => {
        console.log('inside async', addrGrantOrga, data);

        const contestId = eligibleContests.find((c) => c.attributes.addrGrantOrga === addrGrantOrga)?.id;

        const Actions = Moralis.Object.extend('Actions');
        const actionInstance = new Actions();
        console.log('resultat action', actionInstance);
        actionInstance?.save({ ...newAction, contestId, nbOfVotes: 0 });
      };
      queryFunc();
      setNewAction(null);
    }
  }, [data, newAction]);

  const handleSubmit = (action: any) => {
    console.log('action', action);
    const contractData: any = {
      abi,
      contractAddress,
      functionName: 'createAction',
      params: {
        _name: action.name,
        _creatorOfContest: action.addrGrantOrga,
        _requiredFunds: action.requiredFunds
      }
    };
    fetch({ params: contractData }).then((res) => console.log('then after fetch', res, data));
    setNewAction(action);
  };

  console.log('create contest', data, isLoading, isFetching, error);

  return (
    <>
      <PageTitleWrapper>
        <PageHeader onAddNewAction={toggleModalState} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <Contests currentUser={currentUser} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <AddActionModal
        isOpen={isModalOpen}
        onClose={toggleModalState}
        onSubmit={handleSubmit}
        eligibleContests={eligibleContests}
      />
    </>
  );
}

export default ActionsContainer;
