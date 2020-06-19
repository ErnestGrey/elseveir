import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  FormControl,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
    minWidth: 200,
  },

  table: {
    backgroundColor: "#FAFAFA",
  },
}));

const ConditionsTable = ({ loading, results, hasError }) => {
  const classes = useStyles();
  const [filteredResults, setFilteredResults] = useState(results);
  const [sortBy, setSortBy] = useState("");
  const pubMedLink = "https://www.ncbi.nlm.nih.gov/pubmed/?term=";

  const handleSortByChange = ({ target }) => {
    setSortBy(target.value);

    if (target.value === "name") {
      const resultsByName = filteredResults.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setFilteredResults(resultsByName);
    } else {
      const resultsByDate = filteredResults.sort(
        (a, b) => new Date(b.dateReported) - new Date(a.dateReported)
      );
      setFilteredResults(resultsByDate);
    }
  };

  return loading ? (
    <CircularProgress size={60} />
  ) : hasError ? (
    <Typography>Oops! Something went wrong.</Typography>
  ) : (
    <div>
      <Typography variant="caption">Sort By:</Typography>
      <div>
        <FormControl className={classes.formControl}>
          <Select
            variant="outlined"
            labelId="sort-by-select-label"
            id="sort-by-select"
            value={sortBy}
            onChange={handleSortByChange}
          >
            <MenuItem value={"name"}>Condition Name</MenuItem>
            <MenuItem value={"date"}>Date</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer className={classes.table} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Condition</TableCell>
              <TableCell align="right">Date Reported</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults?.map((condition) => (
              <TableRow key={condition.id}>
                <TableCell component="th" scope="row">
                  <Link
                    rel="noreferrer"
                    href={`${pubMedLink + condition.name}`}
                  >
                    {condition.name}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  {condition.dateReported || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ConditionsTable;
