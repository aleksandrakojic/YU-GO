import { Button, Paper } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useMoralis } from "react-moralis";

interface Props {
  children: any;
}

const EnableWeb3 = (props: Props) => {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    web3EnableError,
    web3,
  } = useMoralis();
  //console.log(isWeb3Enabled, web3);

  if (isWeb3Enabled || web3) {
    return props.children;
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      {web3EnableError && <Paper elevation={5}>web3EnableError</Paper>}
      <Button
        variant="outlined"
        onClick={() => enableWeb3()}
        disabled={isWeb3EnableLoading}
      >
        Enable web3
      </Button>
    </Box>
  );
};

export default EnableWeb3;
