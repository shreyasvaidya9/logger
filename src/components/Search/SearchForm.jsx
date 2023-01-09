import React, { useMemo, memo } from "react";
import {
  Stack,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { formActions, formLabels, NOT_SELECTED } from "../../constants/form";

const SearchForm = ({ formData, dispatchForm, filterSearch, data }) => {
  const changeHandler = (action) => (event) => {
    // Update the form values
    if (action.includes("Date")) {
      return dispatchForm({ type: action, payload: event });
    }

    return dispatchForm({
      type: action,
      payload: event?.target?.value || "",
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    filterSearch();
  };

  // Created the input options for the application type input
  const applicationTypeOptions = useMemo(
    () => [
      NOT_SELECTED,
      ...new Set(data?.map((td) => td?.applicationType).filter((td) => td)),
    ],
    [data, NOT_SELECTED]
  );

  // Created the input options for the action type input
  const actionTypeOptions = useMemo(
    () => [
      NOT_SELECTED,
      ...new Set(data?.map((td) => td?.actionType).filter((td) => td)),
    ],
    [data, NOT_SELECTED]
  );

  return (
    <form onSubmit={submitHandler}>
      <Stack flexDirection="row" gap="1em" padding="1rem" flexWrap="wrap">
        <TextField
          label={formLabels.LOG_ID}
          value={formData.logId}
          onChange={changeHandler(formActions.LOG_ID)}
          variant="outlined"
          sx={{ width: "200px" }}
        />
        <TextField
          label={formLabels.APPLICATION_ID}
          value={formData.applicationId}
          onChange={changeHandler(formActions.APPLICATION_ID)}
          variant="outlined"
          sx={{ width: "200px" }}
        />
        <FormControl>
          <InputLabel id={formActions.APPLICATION_TYPE}>
            {formLabels.APPLICATION_TYPE}
          </InputLabel>
          <Select
            labelId={formActions.APPLICATION_TYPE}
            label={formLabels.APPLICATION_TYPE}
            value={formData.applicationType}
            onChange={changeHandler(formActions.APPLICATION_TYPE)}
            sx={{ width: "200px" }}
          >
            {applicationTypeOptions.map((appType) => (
              <MenuItem key={appType} value={appType}>
                {appType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id={formActions.ACTION_TYPE}>
            {formLabels.ACTION_TYPE}
          </InputLabel>
          <Select
            labelId={formActions.ACTION_TYPE}
            label={formLabels.ACTION_TYPE}
            value={formData.actionType}
            onChange={changeHandler(formActions.ACTION_TYPE)}
            sx={{ width: "200px" }}
          >
            {actionTypeOptions.map((actionType) => (
              <MenuItem key={actionType} value={actionType}>
                {actionType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={formLabels.FROM_DATE}
            value={formData.fromDate}
            onChange={changeHandler(formActions.FROM_DATE)}
            renderInput={(params) => (
              <TextField sx={{ width: "200px" }} {...params} />
            )}
          />
          <DatePicker
            label={formLabels.TO_DATE}
            value={formData.toDate}
            onChange={changeHandler(formActions.TO_DATE)}
            renderInput={(params) => (
              <TextField sx={{ width: "200px" }} {...params} />
            )}
          />
        </LocalizationProvider>
        <Button sx={{ width: "200px" }} variant="outlined" type="submit">
          Search
        </Button>
      </Stack>
    </form>
  );
};

export default memo(SearchForm);
