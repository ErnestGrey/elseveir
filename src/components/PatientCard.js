import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "#e5e5e5",
  },
}));

function PatientCard({ loading, patient, error }) {
  const classes = useStyles();
  return loading ? (
    <CircularProgress />
  ) : error ? (
    <Typography>{`Error: ${error}`}</Typography>
  ) : (
    <Card className={classes.card}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Patient
        </Typography>
        <Typography variant="h6">{`Name: ${patient.name}`}</Typography>
        <Typography variant="h6">
          {`Date of Birth: ${patient.birthDate}`}
        </Typography>
        <Typography variant="h6">{`Gender: ${patient.gender}`}</Typography>
      </CardContent>
    </Card>
  );
}

export default PatientCard;
