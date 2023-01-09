import React, { useReducer, useMemo, useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import dayjs from "dayjs";

import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

import Loader from "../components/UI/Loader";
import Table from "../components/Table";
import SearchForm from "../components/Search";

import { formActions, NOT_SELECTED } from "../constants/form";
const {
  LOG_ID,
  ACTION_TYPE,
  APPLICATION_ID,
  APPLICATION_TYPE,
  FROM_DATE,
  TO_DATE,
  SAVE_FROM_PARAM,
} = formActions;

const url = process.env.REACT_APP_API_URL;

// Initial Form Input Values
const formInitialState = {
  logId: "",
  applicationId: "",
  applicationType: NOT_SELECTED,
  actionType: NOT_SELECTED,
  fromDate: null,
  toDate: null,
};

// Reducer function to update the form
const formReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOG_ID:
      return { ...state, logId: payload };
    case APPLICATION_ID:
      return { ...state, applicationId: payload };
    case APPLICATION_TYPE:
      return { ...state, applicationType: payload };
    case ACTION_TYPE:
      return { ...state, actionType: payload };
    case FROM_DATE:
      return { ...state, fromDate: payload };
    case TO_DATE:
      return { ...state, toDate: payload };
    case SAVE_FROM_PARAM:
      return payload;
    default:
      return state;
  }
};

const Logger = () => {
  const { data, loading, error } = useFetch(url);
  const [formData, dispatchForm] = useReducer(formReducer, formInitialState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [param, setParam] = useSearchParams();

  // Creating the Params object to change the url conditionally
  const createParams = () => {
    const searchParams = {};

    for (let key in formData) {
      if (formData[key]) {
        if (key === FROM_DATE || key === TO_DATE) {
          searchParams[key] = dayjs(formData[key]).format("YYYY-MM-DD");
        } else {
          if (key === APPLICATION_TYPE || key === ACTION_TYPE) {
            if (formData[key] === NOT_SELECTED) {
              continue;
            }
          }
          searchParams[key] = formData[key];
        }
      }
    }

    return searchParams;
  };

  // Create the filtered data for the table
  const filteredData = useMemo(() => {
    const logId = param.get(LOG_ID) || "";
    const applicationId = param.get(APPLICATION_ID) || "";
    const applicationType = param.get(APPLICATION_TYPE) || "";
    const actionType = param.get(ACTION_TYPE) || "";
    const fromDate = param.get(FROM_DATE) || "";
    const toDate = param.get(TO_DATE) || "";

    return data?.auditLog?.length > 0
      ? data?.auditLog
          .filter((tableData) =>
            logId ? tableData.logId.toString().includes(logId) : tableData
          )
          .filter((tableData) =>
            applicationId
              ? tableData.applicationId?.toString().includes(applicationId)
              : tableData
          )
          .filter((tableData) =>
            applicationType
              ? tableData.applicationType?.toString() === applicationType
              : tableData
          )
          .filter((tableData) =>
            actionType
              ? tableData.actionType.toString() === actionType
              : tableData
          )
          .filter((tableData) => {
            return fromDate && !toDate
              ? tableData?.creationTimestamp
                  ?.toString()
                  .includes(dayjs(fromDate).format("YYYY-MM-DD"))
              : tableData;
          })
          .filter((tableData) => {
            if (fromDate && toDate) {
              const currentDate = dayjs(
                tableData?.creationTimestamp?.toString()
              ).format("YYYY-MM-DD");
              return dayjs(currentDate).isBetween(
                dayjs(fromDate).format("YYYY-MM-DD"),
                dayjs(toDate).format("YYYY-MM-DD")
              );
            } else {
              return tableData;
            }
          })
      : [];
  }, [data, isSubmitted, param]);

  // Change the url when the seatch button is clicked
  useEffect(() => {
    if (isSubmitted) {
      setIsSubmitted(false);
      setParam(createParams());
    }
  }, [formData, isSubmitted]);

  // Fill the form data when the url is changed
  useEffect(() => {
    if (!isSubmitted) {
      dispatchForm({
        type: SAVE_FROM_PARAM,
        payload: {
          ...formInitialState,
          logId: param.get(LOG_ID) || "",
          applicationId: param.get(APPLICATION_ID) || "",
          applicationType: param.get(APPLICATION_TYPE) || NOT_SELECTED,
          actionType: param.get(ACTION_TYPE) || NOT_SELECTED,
          fromDate: param.get(FROM_DATE) || null,
          toDate: param.get(TO_DATE) || null,
        },
      });
    }
  }, [param]);

  return (
    <>
      {loading && <Loader />}
      {error && <h2>Some Error Occured</h2>}
      {data && (
        <Container>
          <SearchForm
            formData={formData}
            dispatchForm={dispatchForm}
            filterSearch={() => setIsSubmitted(true)}
            tableData={filteredData.length ? filteredData : []}
            data={data?.auditLog}
          />
          <Box sx={{ padding: "1rem" }}>
            <Table tableData={filteredData.length ? filteredData : []} />
          </Box>
        </Container>
      )}
    </>
  );
};

export default Logger;
