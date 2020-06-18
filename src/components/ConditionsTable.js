import React from "react";
import {
  CircularProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

const ConditionsTable = ({ conditions, hasError, isLoading }) => {
  const pubMedLink = "https://www.ncbi.nlm.nih.gov/pubmed/?term=";
  return isLoading ? (
    <CircularProgress />
  ) : hasError ? (
    <Typography>Oops! Something went wrong.</Typography>
  ) : (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Condition</TableCell>
            <TableCell align="right">Date Reported</TableCell>
            <TableCell align="right">PubMed Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conditions?.map((condition) => (
            <TableRow key={condition.id}>
              <TableCell component="th" scope="row">
                {condition.name}
              </TableCell>
              <TableCell align="right">
                {condition.dateReported || "N/A"}
              </TableCell>
              <TableCell align="right">
                <Link rel="noreferrer" href={`${pubMedLink + condition.name}`}>
                  {condition.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConditionsTable;
