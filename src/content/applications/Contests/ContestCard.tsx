import React, { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CommentTwoToneIcon from "@mui/icons-material/CommentTwoTone";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IContest } from "src/models";
import { Box, Button, Chip } from "@mui/material";
import Flag from "react-world-flags";
import { AppContext } from "src/contexts/AppContext";
import { FlagWrapper, CardActionsWrapper } from "./styles";
import { format } from "date-fns";
interface Props {
  contest: IContest;
  isCreator: boolean;
  index: number;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ContestCard({ contest, isCreator, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { thematics, countries } = useContext(AppContext);
  const contestThematics = thematics.filter((t) =>
    contest?.thematics?.includes(t.id)
  );
  const contestCountries = countries.filter((c) =>
    contest?.countries?.includes(c.id)
  );

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderImg = () =>
    index % 3 === 0
      ? "https://t3.ftcdn.net/jpg/03/43/43/72/360_F_343437244_HrxIVZWbfh29tgxuRlxbPXEpHMSmfkAn.jpg"
      : index % 3 === 1
      ? "https://smallbiztrends.com/ezoimgfmt/media.smallbiztrends.com/2017/02/shutterstock_311418902-850x476.jpg?ezimgfmt=rs%3Adevice%2Frscb12-1"
      : "https://scholarships.plus/pix/blog/contest-02.jpg";

  return (
    <Card sx={{ width: "90%", margin: "10px" }}>
      <CardHeader
        sx={{ ".MuiCardHeader-title": { fontSize: "1.5rem" } }}
        action={
          <IconButton aria-label="settings">
            {contestCountries?.map((c) => (
              <FlagWrapper key={c.code}>
                <Flag
                  code={c.code}
                  style={{ width: "30px", marginRight: "5px" }}
                />
              </FlagWrapper>
            ))}
            <MoreVertIcon />
          </IconButton>
        }
        title={contest.name}
        subheader={
          <p>
            <b>Created : </b>
            <i>{contest?.createdAt?.toUTCString()}</i>
          </p>
        }
      />
      <CardActionsWrapper>
        <Box>
          <b>Thematics: </b>
          {contestThematics?.map((t) => (
            <Chip
              key={t.name}
              label={t.name}
              color="primary"
              variant="outlined"
              sx={{ marginRight: "5px" }}
            />
          ))}
        </Box>
      </CardActionsWrapper>
      <CardMedia
        component="img"
        height="280"
        image={renderImg()}
        alt="contest"
      />
      <CardActionsWrapper>
        <div>
          <p>
            Application End Date:{" "}
            <i>
              {format(
                new Date(contest?.applicationEndDate),
                "MMMM dd yyyy HH:mm"
              )}
            </i>
          </p>
          <p>
            Voting End Date:{" "}
            <i>
              {format(new Date(contest?.votingEndDate), "MMMM dd yyyy HH:mm")}
            </i>
          </p>
        </div>
        <Typography variant="h4">
          Available Funds{" "}
          <Chip label={`${contest.availableFunds} ETH`} color="primary" />
        </Typography>
      </CardActionsWrapper>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {contest.description}
        </Typography>
      </CardContent>
      <CardActionsWrapper sx={{}}>
        <Box>
          {!isCreator && (
            <Button startIcon={<AddBoxIcon />} variant="contained">
              Add Action
            </Button>
          )}
          <Button
            startIcon={<CommentTwoToneIcon />}
            variant="outlined"
            sx={{ mx: 2 }}
          >
            Comment
          </Button>
        </Box>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActionsWrapper>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>More:</Typography>
          <Typography paragraph>{contest.description}</Typography>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum
          </Typography>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
