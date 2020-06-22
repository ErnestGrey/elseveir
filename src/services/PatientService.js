const sandboxUrl =
  "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/";
const options = {
  method: "GET",
  headers: {
    Accept: "application/json+fhir",
  },
};

const notGiven = "N/A";

async function fetchPatientData(patientId) {
  const patientUrl = `${sandboxUrl}Patient/${patientId}`;
  const res = await fetch(patientUrl, options);
  const data = await res.json();
  return {
    name: data?.name[0].text,
    birthDate: data?.birthDate || notGiven,
    gender: data?.gender || notGiven,
  };
}

async function fetchPatientConditions(patientId) {
  const conditionUrl = `${sandboxUrl}Condition?patient=${patientId}`;
  const res = await fetch(conditionUrl, options);
  const data = await res.json();
  const entries = data?.entry?.slice(0, 50);
  if (entries) {
    const conditions = entries.map((entry) => ({
      id: entry?.resource?.id,
      name: entry?.resource?.code?.text || notGiven,
      dateReported: entry?.resource?.dateRecorded || notGiven,
    }));
    const filteredConditions = conditions.reduce((unique, o) => {
      if (!unique.some((obj) => obj.id === o.id)) {
        unique.push(o);
      }
      return unique;
    }, []);

    return filteredConditions;
  }
  return [];
}

export { fetchPatientConditions, fetchPatientData };
