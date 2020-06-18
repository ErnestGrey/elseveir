import React, { useEffect, useState } from "react";
import "./App.css";
import ConditionsTable from "./components/ConditionsTable";
import { Button, Container, TextField, Typography } from "@material-ui/core";

function App() {
  const [conditions, setConditions] = useState(null);
  const [conditionLoading, setConditionLoading] = useState(false);
  const [hasConditionError, setHasConditionError] = useState(false);
  const [patientResponse, setPatientResponse] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [hasPatientError, setHasPatientError] = useState(false);
  const [patientId, setPatientId] = useState("");

  const sandboxUrl =
    "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/";
  const request = {
    method: "GET",
    headers: {
      Accept: "application/json+fhir",
    },
  };

  // useEffect(() => {
  //   fetchPatientData();
  //   fetchConditionData();
  // }, []);

  const fetchPatientData = () => {
    const patientUrl = `${sandboxUrl}Patient/${patientId}`;
    setPatientLoading(true);
    fetch(patientUrl, request)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPatientResponse(data);
        setPatientLoading(false);
      })
      .catch(() => {
        setHasPatientError(true);
        setPatientLoading(false);
      });
  };

  const fetchConditionData = () => {
    const conditionUrl = `${sandboxUrl}Condition?patient=${patientId}`;
    setConditionLoading(true);
    fetch(conditionUrl, request)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const entries = data.entry.slice(0, 30);
        console.log(entries);
        const conditions = entries.map((entry) => ({
          name: entry?.resource?.code?.text,
          dateReported: entry?.resource?.dateRecorded,
        }));
        setConditions(conditions);
        setConditionLoading(false);
      })
      .catch(() => {
        setHasConditionError(true);
        setConditionLoading(false);
      });
  };

  const handlePatientIdOnChange = ({ target }) => {
    setPatientId(target.value);
  };

  const handleSumbitButtonClick = (event) => {
    event.preventDefault();
    fetchPatientData();
    fetchConditionData();
  };

  return (
    <Container maxWidth="lg">
      <Typography align="center" variant="h3">
        Welcome to the patient portal!
      </Typography>
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
        onClick={handleSumbitButtonClick}
      >
        Submit
      </Button>
      <ConditionsTable
        conditions={conditions}
        isLoading={conditionLoading}
        hasError={hasConditionError}
      />
    </Container>
  );
}

export default App;
