import {
  LOG_ID,
  APPLICATION_TYPE,
  APPLICATION_ID,
  ACTION_TYPE,
  CREATION_TIMESTAMP,
} from "../../constants/tableColumns";

import { convertCamelCaseToNormalText } from "../../utils/common";

export const createData = (name, calories, fat, carbs, protein) => {
  return { name, calories, fat, carbs, protein };
};

export const descendingComparator = (a, b, orderBy) => {
  if (!a[orderBy]) {
    return 1;
  }
  if (!b[orderBy]) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) => {
  if (orderBy === CREATION_TIMESTAMP) {
    return order === "desc"
      ? (a, b) =>
          descendingComparator(
            new Date(a).setHours(0, 0, 0, 0),
            new Date(b).setHours(0, 0, 0, 0),
            orderBy
          )
      : (a, b) =>
          -descendingComparator(
            new Date(a).setHours(0, 0, 0, 0),
            new Date(b).setHours(0, 0, 0, 0),
            orderBy
          );
  }
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const getTableHeaders = (data) => {
  const tableHeaders = [];

  for (const key in data) {
    switch (key) {
      case LOG_ID:
      case APPLICATION_TYPE:
      case APPLICATION_ID:
      case ACTION_TYPE:
      case CREATION_TIMESTAMP:
        const labelText =
          key === CREATION_TIMESTAMP
            ? "Date : Time"
            : convertCamelCaseToNormalText(key);
        tableHeaders.push({
          id: key,
          disablePadding: false,
          label: labelText,
          numeric: key === APPLICATION_ID || key === LOG_ID ? true : false,
        });
        break;
      default:
        break;
    }
  }

  return tableHeaders;
};

const createRowData = (item) => {
  const rowData = {};
  rowData[LOG_ID] = item[LOG_ID];
  rowData[APPLICATION_ID] = item[APPLICATION_ID];
  rowData[APPLICATION_TYPE] = item[APPLICATION_TYPE];
  rowData[ACTION_TYPE] = item[ACTION_TYPE];
  rowData[CREATION_TIMESTAMP] = item[CREATION_TIMESTAMP];
  return rowData;
};

export const getTableContent = (data) => {
  const tableContent = [];

  data.forEach((item) => {
    tableContent.push(createRowData(item));
  });

  return tableContent;
};
