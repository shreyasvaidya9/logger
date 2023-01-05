import React, { useReducer, useMemo, useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import dayjs from "dayjs";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useFetch from "../hooks/useFetch";

import Loader from "../components/UI/Loader";
import Table from "../components/Table";
import SearchForm from "../components/Search";

import { formActions } from "../constants/form";
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

const formInitialState = {
  logId: "",
  applicationId: "",
  applicationType: null,
  actionType: null,
  fromDate: null,
  toDate: null,
};

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

  const navigate = useNavigate();
  const [param] = useSearchParams();

  const createParams = () => {
    const searchParams = {};

    for (let key in formData) {
      if (formData[key]) {
        if (key === FROM_DATE || key === TO_DATE) {
          searchParams[key] = dayjs(formData[key]).format("YYYY-MM-DD");
        } else {
          searchParams[key] = formData[key];
        }
      }
    }

    return createSearchParams(searchParams);
  };

  const filteredData = useMemo(() => {
    if (isSubmitted) {
      createParams();
    }

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
              ? tableData.applicationType?.toString().includes(applicationType)
              : tableData
          )
          .filter((tableData) =>
            actionType
              ? tableData.actionType.toString().includes(actionType)
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

  useEffect(() => {
    if (isSubmitted) {
      setIsSubmitted(false);
      navigate({ pathname: "/", search: createParams().toString() });
    }
  }, [formData, isSubmitted]);

  useEffect(() => {
    if (!isSubmitted) {
      dispatchForm({
        type: SAVE_FROM_PARAM,
        payload: {
          ...formInitialState,
          logId: param.get(LOG_ID) || "",
          applicationId: param.get(APPLICATION_ID) || "",
          applicationType: param.get(APPLICATION_TYPE) || "",
          actionType: param.get(ACTION_TYPE) || "",
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
