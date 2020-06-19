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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "grey",
  },

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

  loadingIndicator: {
    alignSelf: "center",
  },
}));

function App() {
  const classes = useStyles();
  const [conditions, setConditions] = useState(null);
  const [conditionResultsLoading, setConditionResultsLoading] = useState(false);
  const [hasConditionError, setHasConditionError] = useState(false);
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [hasPatientError, setHasPatientError] = useState(false);
  const [patientId, setPatientId] = useState("1316024");

  const sandboxUrl =
    "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/";
  const request = {
    method: "GET",
    headers: {
      Accept: "application/json+fhir",
    },
  };

  const fetchPatientData = () => {
    const patientUrl = `${sandboxUrl}Patient/${patientId}`;
    setPatientLoading(true);
    fetch(patientUrl, request)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data", data);

        const patient = {
          name: data?.name[0].text,
          birthDate: data?.birthDate,
          gender: data?.gender,
        };
        console.log("pat", patient);
        setPatient(patient);
        setPatientLoading(false);
      })
      .catch(() => {
        setHasPatientError(true);
        setPatientLoading(false);
      });
  };

  const fetchConditionData = () => {
    const conditionUrl = `${sandboxUrl}Condition?patient=${patientId}`;
    setConditionResultsLoading(true);
    fetch(conditionUrl, request)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const entries = data.entry.slice(0, 50);
        const conditions = entries.map((entry) => ({
          id: entry?.resource?.id,
          name: entry?.resource?.code?.text,
          dateReported: entry?.resource?.dateRecorded,
        }));
        const filteredConditions = conditions.reduce((unique, o) => {
          if (!unique.some((obj) => obj.id === o.id)) {
            unique.push(o);
          }
          return unique;
        }, []);

        setConditions(filteredConditions);
        setConditionResultsLoading(false);
      })
      .catch(() => {
        setHasConditionError(true);
        setConditionResultsLoading(false);
      });
  };

  const handlePatientIdOnChange = ({ target }) => {
    setPatientId(target.value);
  };

  const handleSubmitButtonClick = (event) => {
    event.preventDefault();
    fetchPatientData();
    fetchConditionData();
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
          <CircularProgress className={classes.loadingIndicator} />
        ) : (
          patient && (
            <PatientCard patient={patient} hasError={hasPatientError} />
          )
        )}
      </div>
      <div className={classes.section}>
        {conditionResultsLoading ? (
          <CircularProgress className={classes.loadingIndicator} />
        ) : (
          conditions && (
            <ConditionsTable
              results={conditions}
              hasError={hasConditionError}
            />
          )
        )}
      </div>
    </Container>
  );
}

export default App;
