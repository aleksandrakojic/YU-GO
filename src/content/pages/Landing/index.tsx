import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  LinearProgress,
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
import { ProfileType } from "src/models";
import { useSnackbar, VariantType } from "notistack";
import { LoadingButton } from "@mui/lab";

enum SignupType {
  None,
  Organization,
  Member,
}
function LandingPage() {
  const navigate = useNavigate();
  const {
    Moralis,
    account,
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    logout,
  } = useMoralis();
  const { enqueueSnackbar } = useSnackbar();
  const [signup, setSignup] = useState(SignupType.None);
  const { thematics, countries, abi, contractAddress, setType, type } =
    useContext(AppContext);
  const { data, isLoading, isFetching, fetch, error } =
    useWeb3ExecuteFunction();
  const [newOrganistation, setNewOrganisation] = useState<any>(null);
  const [newParticipant, setNewParticipant] = useState<any>(null);

  useEffect(() => {
    if (data && newOrganistation) {
      const d: any = data;
      console.log("test1", d);
      if (d?.events?.OrganizationRegistered) {
        console.log("test2");
        const Organisation = Moralis.Object.extend("Organisations");
        const orga = new Organisation();

        orga.save({ ...newOrganistation, ethAddress: d?.from }).then(
          (res) => {
            authenticate();
            setType(ProfileType.Organization);
          },
          (error) => {
            console.error("error saving orga", error);
          }
        );
      }
      setNewOrganisation(null);
    }
  }, [data, newOrganistation]);

  useEffect(() => {
    if (data && newParticipant) {
      if (data) {
        const Participant = Moralis.Object.extend("Participants");
        const participant = new Participant();
        participant.save({ ...newParticipant, ethAddress: account }).then(
          (res) => {
            authenticate();
            setType(ProfileType.Member);
          },
          (error) => {
            console.error("error saving member", error);
          }
        );
      }
      setNewParticipant(null);
    }
  }, [data, newParticipant]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !user?.attributes?.type &&
      type === ProfileType.None
    ) {
      handleSnackMessage("You need to be registered !", "warning");
    }
  }, [type, isAuthenticated]);

  const handleSnackMessage = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, { variant });
  };

  const handleSubmitMember = async (member) => {
    const contractData: any = {
      abi,
      contractAddress,
      functionName: "participantIsWhiteListed",
      params: {
        _addrOrganisation: member.organisation,
        _addrParticipant: account,
      },
    };
    fetch({ params: contractData });
    setNewParticipant(member);
  };

  const handleSubmitOrganization = (organization) => {
    const contractData: any = {
      abi,
      contractAddress,
      functionName: "registerOrganisation",
      params: {
        thematicIds: organization?.thematics,
        countryId: organization?.country,
      },
    };
    fetch({ params: contractData });
    setNewOrganisation(organization);
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
    if (!isAuthenticated && !user) {
      authenticate();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setType(ProfileType.None);
  };

  const renderAppBar = () => (
    <AppBar>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Logo /> <h1>Yu-Go DAO</h1>
      </Box>
      {isAuthenticated && user ? (
        <Box sx={{ textAlign: "right" }}>
          <Button onClick={handleLogout} variant="contained">
            Logout
          </Button>
          <h4>{user.get("ethAddress")}</h4>
        </Box>
      ) : (
        <LoadingButton
          onClick={userConnect}
          variant="contained"
          loading={isAuthenticating}
        >
          Connect Wallet
        </LoadingButton>
      )}
    </AppBar>
  );

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
                  YU-GO DAO gives direct power to the women of ex-Yugoslavia.
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
              {(isLoading || isFetching) && <LinearProgress color="primary" />}
              {renderForm()}
            </Box>
          </EnableWeb3>
        </Container>
      </MainContent>
    </Wrapper>
  );
}

export default LandingPage;
