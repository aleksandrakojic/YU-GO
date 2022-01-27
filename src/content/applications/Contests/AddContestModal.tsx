import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Divider, Grid } from "@mui/material";
import { IData } from "src/models";
import { Box } from "@mui/system";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contest: any) => void;
  thematics: IData[];
  countries: IData[];
  balance?: any;
}

const initContest = {
  name: "",
  description: "",
  thematics: [],
  countries: [],
  applicationEndDate: "",
  votingEndDate: "",
  availableFunds: 0,
};

export default function AddContestModal({
  isOpen,
  onClose,
  onSubmit,
  thematics,
  countries,
  balance,
}: Props) {
  const [contest, setContest] = React.useState(initContest);

  const handleSubmit = () => {
    onSubmit({ ...contest, availableFunds: Number(contest.availableFunds) });
    handleClose();
  };
  const handleChange = ({ target: { value, name } }) =>
    setContest({ ...contest, [name]: value });
  const handleClose = () => {
    setContest(initContest);
    onClose();
  };

  const handleCountySelection = (e, newvalue) => {
    const countryIds = newvalue.map((t) => t.id);
    setContest({ ...contest, countries: countryIds });
  };
  const handleThemeSelection = (e, newvalue) => {
    const themeIds = newvalue.map((t) => t.id);
    setContest({ ...contest, thematics: themeIds });
  };

  return (
    <Grid container sx={{ padding: 2 }}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{ "& > div > div": { padding: 2, backgroundColor: "#393264" } }}
      >
        <DialogTitle sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          ADD NEW CONTEST
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "450px",
            justifyContent: "space-between",
          }}
        >
          <DialogContentText>
            Create new contest and add thematics and countries for which contest
            will be visible
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Title"
            type="text"
            fullWidth
            // variant="filled"
            onChange={handleChange}
            value={contest.name}
          />
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            minRows={5}
            onChange={handleChange}
            value={contest.description}
          />
          <TextField
            autoFocus
            margin="dense"
            name="availableFunds"
            label="Available Funds in ETH"
            type="number"
            fullWidth
            multiline
            onChange={handleChange}
            value={contest.availableFunds}
            error={contest.availableFunds > balance}
            helperText={
              contest.availableFunds > balance ? "You dont have enough ETH" : ""
            }
          />
          <Autocomplete
            sx={{ margin: "10px 0px" }}
            fullWidth
            multiple
            aria-required
            id="tags-outlined"
            options={thematics}
            getOptionLabel={(option) => option.name}
            onChange={handleThemeSelection}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Thematics" />
            )}
          />
          <Autocomplete
            sx={{ margin: "10px 0px" }}
            fullWidth
            multiple
            aria-required
            id="tags-outlined"
            options={countries}
            getOptionLabel={(option) => option.name}
            onChange={handleCountySelection}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Countries" />
            )}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              padding: "20px 0px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <p>Application End Date</p>
              <TextField
                name="applicationEndDate"
                type="datetime-local"
                value={contest.applicationEndDate}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <p>Voting End Date</p>
              <TextField
                name="votingEndDate"
                type="datetime-local"
                value={contest.votingEndDate}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ marginRight: "20px" }}>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={contest.availableFunds > balance}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
