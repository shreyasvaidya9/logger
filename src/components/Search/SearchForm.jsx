import React, { useMemo, memo } from "react";
import { Stack, TextField, Button, Autocomplete } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { formActions, formLabels } from "../../constants/form";

const SearchForm = ({ formData, dispatchForm, filterSearch, tableData }) => {
  const changeHandler = (action) => (event) => {
    if (action.includes("Date")) {
      return dispatchForm({ type: action, payload: event });
    }

    return dispatchForm({
      type: action,
      payload: event?.target?.value || "",
    });
  };

  const changeAutocompleteHandler = (action) => (event, newValue) => {
    return dispatchForm({
      type: action,
      payload: newValue || null,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    filterSearch(false);
  };

  const applicationTypeOptions = useMemo(
    () => [
      ...new Set(tableData.map((td) => td?.applicationType).filter((td) => td)),
    ],
    [tableData]
  );

  const actionTypeOptions = useMemo(
    () => [
      ...new Set(tableData.map((td) => td?.actionType).filter((td) => td)),
    ],
    [tableData]
  );

  return (
    <form onSubmit={submitHandler}>
      <Stack flexDirection="row" gap="1em" padding="1rem" flexWrap="wrap">
        <TextField
          label={formLabels.LOG_ID}
          value={formData.logId}
          onChange={changeHandler(formActions.LOG_ID)}
          variant="outlined"
        />
        <TextField
          label={formLabels.APPLICATION_ID}
          value={formData.applicationId}
          onChange={changeHandler(formActions.APPLICATION_ID)}
          variant="outlined"
        />
        <Autocomplete
          options={applicationTypeOptions}
          inputValue={formData.applicationType}
          onChange={changeAutocompleteHandler(formActions.APPLICATION_TYPE)}
          sx={{ width: "195px" }}
          renderInput={(params) => (
            <TextField {...params} label={formLabels.APPLICATION_TYPE} />
          )}
        />
        <Autocomplete
          options={actionTypeOptions}
          inputValue={formData.actionType}
          onChange={changeAutocompleteHandler(formActions.ACTION_TYPE)}
          sx={{ width: "195px" }}
          renderInput={(params) => (
            <TextField {...params} label={formLabels.ACTION_TYPE} />
          )}
        />
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
