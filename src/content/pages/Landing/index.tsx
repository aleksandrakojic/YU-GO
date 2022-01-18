import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { OrganizationSignup } from "./OrganizationSignup";
import MemberSignup from "./MemberSignup";
import EnableWeb3 from "src/components/EnableWeb3";
import { MainContent, PaperItem, Wrapper, AppBar } from "./styles";
import { AppContext } from "src/contexts/AppContext";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import { useNavigate } from "react-router-dom";
import Logo from "src/components/Logo";

const Moralis = require("moralis");


enum SignupType {
  None,
  Organization,
  Member,
}
function LandingPage() {

  const navigate = useNavigate();
  const {
    enableWeb3,
    authenticate,
    isWeb3Enabled,
    isAuthenticated,
    isAuthenticating,
    user,
    logout,
    refetchUserData,
    isUserUpdating,
    setUserData,
    web3
  } = useMoralis();
  const [signup, setSignup] = useState(SignupType.None);
  const { thematics, countries, abi, contractAddress, currentUser } =
    useContext(AppContext);
  const { data, isLoading, isFetching, fetch, error } =
    useWeb3ExecuteFunction();
  const [newOrganistation, setNewOrganisation] = useState<any>(null);
  const [newParticipant, setNewParticipant] = useState<any>(null);


 

  useEffect(() => {
    // console.log("user newParticipant", user, newParticipant);
    // if (isAuthenticated && user && newParticipant) {
    //   setUserData(newParticipant);
    //   if (newParticipant.type === 1) {
    //     navigate("/dashboards/profile/settings");
    //   }
    //   setNewParticipant(null);
    // }
  }, [isAuthenticated, user, newParticipant]);


  useEffect(() => {
    if (
      data &&
      newOrganistation?.name &&
      newOrganistation?.email &&
      newOrganistation?.thematics &&
      newOrganistation
    ) {
      const d: any = data;
      if (d?.events?.OrganizationRegistered) {
        console.log("inside create orga db", data);
        const Organisation = Moralis.Object.extend("Organisations");
        const orga = new Organisation();

        orga.save({ ...newOrganistation, ethAddress: d?.from }).then(
          (res) => {
            user?.set("type", 2);
            user?.save().then(
              (res) => {
                navigate("/dashboards/organization/settings");
                console.log(res);
              },
              (err) => {
                console.warn("error saving user", err);
              }
            );
          },
          (error) => {
            console.warn("error saving orga", error);
          }
        );
      }
      setNewOrganisation(null);
    }
  }, [data]);

  

  const handleSubmitMember = async (member) => {
    if (!isAuthenticated) {
      await authenticate();
    }
    
    console.log(
      "onComplete authenticate",
      user,
      currentUser,
      Moralis.User.current(), 
      newParticipant, 
      isAuthenticated
    );
    const contractData: any = {
      abi,
      contractAddress,
      functionName: "participantIsWhiteListed",
      params: {
        _addrOrganisation: member.organisation,
        _addrParticipant: Moralis.User.current().attributes.ethAddress,
      },
    };
    const resFunc= await Moralis.executeFunction(contractData);
    console.log({resFunc});
    
    if(resFunc){
      const queryParticipant = await participantQuery(Moralis.User.current().attributes.ethAddress);
      
      console.log("queryParticipant authenticate", queryParticipant[0]);
      if(queryParticipant[0]){
        queryParticipant[0].set('email', member.email);
        queryParticipant[0].set('name', member.name);
        queryParticipant[0].set('firstname', member.firstname);
        queryParticipant[0].set('lastname', member.lastname);
        queryParticipant[0].set('organisation', member.organisation);
        queryParticipant[0].save();
        
        /**/
      }else{
        const Participant = Moralis.Object.extend("Participants");
        const participant = new Participant();
        participant.save({ ...member, ethAddress: Moralis.User.current().attributes.ethAddress});
       
      }
      
      setUserData({
        type : 1
      });
      setNewParticipant({...member,  ethAddress : Moralis.User.current().attributes.ethAddress });
      navigate("/dashboards/profile/settings");
      /*user?.set("type", 1);
        await user?.save().then(res=>{
          console.log(res);
           navigate("/dashboards/profile/settings");
        })*/
      
    }
      
  };

  const handleSubmitOrganization = (organization) => {
    console.log("handleSubmitOrganization", organization);
    if (isAuthenticated) {
        const contractData: any = {
          abi,
          contractAddress,
          functionName: "registerOrganisation",
          params: {
            thematicIds: organization?.thematics,
            countryId: organization?.country,
          },
        };
        //const resFunc= await Moralis.executeFunction(contractData);
        fetch({ params: contractData });
        setNewOrganisation(organization);
      
    } else {
      authenticate().then((res) => {
        const contractData: any = {
          abi,
          contractAddress,
          functionName: "registerOrganisation",
          params: {
            name: organization?.name,
            thematicIds: organization?.thematics,
            countryId: organization?.country,
          },
        };
        fetch({ params: contractData });
        setNewOrganisation(organization);
      });
    }
  };

  const renderForm = () => {
    if (signup === SignupType.Organization) {
      return (
        <OrganizationSignup
          thematics={thematics}
          countries={countries}
          onSubmitOrganization={handleSubmitOrganization}
        />
      );
    }
    if (signup === SignupType.Member) {
      return <MemberSignup onSubmitMember={handleSubmitMember} />;
    }
    if (signup === SignupType.None) {
      return (
        <Stack
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <PaperItem
            elevation={16}
            onClick={() => setSignup(SignupType.Organization)}
          >
            <Typography variant="h3">I am Organization</Typography>
          </PaperItem>
          <PaperItem
            elevation={16}
            onClick={() => setSignup(SignupType.Member)}
          >
            <Typography variant="h3">I am Member</Typography>
          </PaperItem>
        </Stack>
      );
    }
  };

  const userConnect = async () => {
    console.log("userConnect", Moralis.User.current(), isAuthenticated, isWeb3Enabled);

    if(!isAuthenticated){
      try{
 
        await authenticate();
        console.log("address", Moralis.User.current().attributes, Moralis.User.current().attributes.ethAddress);
        let participant =  await participantQuery(Moralis.User.current().attributes.ethAddress);
        let organisation =  await organisationQuery(Moralis.User.current().attributes.ethAddress);
        console.log("query", participant, organisation);

        if(participant[0]){
          const contractData: any = {
            abi,
            contractAddress,
            functionName: "participantIsWhiteListed",
            params: {
              _addrOrganisation: participant[0].attributes.organisation,
              _addrParticipant: Moralis.User.current().attributes.ethAddress,
            },
          };
          const resFunc= await Moralis.executeFunction(contractData);
          console.log({resFunc});
          if(resFunc){
            setNewParticipant(participant);
            navigate('/dashboards/profile/settings');
          }
        }

        if(organisation[0]){
          const contractData: any = {
            abi,
            contractAddress,
            functionName: "organisationRegistrationStatus",
            params: {
              _orga: Moralis.User.current().attributes.ethAddress,
            },
          };
          const resFunc= await Moralis.executeFunction(contractData);
          console.log({resFunc});
          if(resFunc){
            setNewOrganisation(organisation);
            navigate('/dashboards/organization/settings');
          }
        }

        /*if(!organisation && !participant){
          logout();
          navigate('/');
        }*/


      }catch(error){
        console.warn(error)
      }
    }
  };

  const participantQuery = async (address) : Promise<any>  => {
    const Participant = Moralis.Object.extend("Participants");
    const query = new Moralis.Query(Participant);
    query.equalTo("ethAddress", address);
    const object = await query.find();
    
    return object;
  }

  const organisationQuery = async (address)  : Promise<any> => {
    const Organisation = Moralis.Object.extend("Organisations");
    const query = new Moralis.Query(Organisation);
    query.equalTo("ethAddress", address);
    const object = await query.find();
    
    return object;
  }

  const renderAppBar = () => {
    if (isAuthenticated && user) {
      return (
        <AppBar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Logo /> <h1>Yu-go DAO</h1>
          </Box>
          <h4>{user.get('ethAddress')}</h4>
          <Button
            onClick={() => logout()}
            variant="contained"
          >
            Logout
          </Button>
        </AppBar>
      );
    }
    return (
      <AppBar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Logo /> <h1>Yu-go DAO</h1>
        </Box>
        <Button
          onClick={() => {
            userConnect();
          }}
          variant="contained"
        >
          Connect Wallet
        </Button>
      </AppBar>
    );
  };

  return (
    <Wrapper>
      {renderAppBar()}
      <MainContent>
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: "center",
              height: "400px",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <img
              alt="Coming Soon"
              height={400}
              src="/static/images/logo/woman.svg"
            />
          </Box>
        </Container>

        <Container maxWidth="sm">
          <EnableWeb3>
            {signup === SignupType.None && (
              <Box>
                <Typography variant="h1" sx={{ fontSize: "3rem" }}>
                  Unlock the next step in community cooperation
                </Typography>
                <Typography sx={{ fontSize: "1.5rem", padding: "20px 0px" }}>
                  YU-GO DAO gives direct power to the women of ex-Yugoslavie.
                  Join us in pioneering a future where magic internet
                  communities unlock the power of women-centric coordination.
                </Typography>
              </Box>
            )}
            <Box sx={{ textAlign: "center" }}>
              {signup !== SignupType.None && (
                <Button onClick={() => setSignup(SignupType.None)}>
                  <KeyboardBackspaceIcon /> <div>Back</div>
                </Button>
              )}
              {renderForm()}
            </Box>
          </EnableWeb3>
        </Container>
      </MainContent>
    </Wrapper>
  );

}

export default LandingPage;
