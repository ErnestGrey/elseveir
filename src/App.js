import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import ConditionsTable from "./components/ConditionsTable";
import PatientCard from "./components/PatientCard";
import {
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import {
  fetchPatientConditions,
  fetchPatientData,
} from "./services/PatientService";

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    marginTop: theme.spacing(4),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "350px",
  },

  section: {
    marginTop: theme.spacing(3),
  },

  title: {
    marginTop: theme.spacing(5),
  },
}));

function App() {
  const classes = useStyles();
  const [conditions, setConditions] = useState(null);
  const [conditionsLoading, setConditionsLoading] = useState(false);
  const [conditionsError, setConditionsError] = useState(false);
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState(false);
  const [patientId, setPatientId] = useState("1316024");

  const handlePatientIdOnChange = ({ target }) => {
    setPatientId(target.value);
  };

  const handleSubmitButtonClick = (event) => {
    event.preventDefault();
    setPatientLoading(true);
    setConditionsLoading(true);

    fetchPatientData(patientId)
      .then((patient) => {
        setPatient(patient);
        setPatientLoading(false);
      })
      .catch((error) => {
        setPatientError(error);
      });

    fetchPatientConditions(patientId)
      .then((conditions) => {
        setConditions(conditions);
        setConditionsLoading(false);
      })
      .catch((error) => {
        setConditionsError(error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Typography className={classes.title} variant="h3">
        Welcome to the patient portal!
      </Typography>
      <div className={classes.inputContainer}>
        <TextField
          label="Patient ID"
          required
          type="text"
          variant="outlined"
          value={patientId}
          onChange={handlePatientIdOnChange}
        />
        <Button
          variant="contained"
          disableRipple
          onClick={handleSubmitButtonClick}
        >
          Submit
        </Button>
      </div>
      <div className={classes.section}>
        {patientLoading ? (
          <CircularProgress />
        ) : (
          patient && <PatientCard patient={patient} error={patientError} />
        )}
      </div>
      <div className={classes.section}>
        {conditionsLoading ? (
          <CircularProgress />
        ) : (
          conditions && (
            <ConditionsTable results={conditions} error={conditionsError} />
          )
        )}
      </div>
    </Container>
  );
}

export default App;
