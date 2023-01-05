import {
  render,
  screen,
  cleanup,
  waitForElement,
  getAllByRole,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableComponent from "./Table";

const mockData = [
  {
    logId: 906468196730134,
    applicationId: null,
    applicationType: null,
    companyId: null,
    actionType: "DARI_REFRESH_TOKEN",
    ip: "10.11.0.89",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    userId: 115678,
    source: null,
    ownerId: null,
    logInfo: null,
    creationTimestamp: "2022-01-31 17:29:00",
  },
  {
    logId: 365001413757985,
    applicationId: null,
    applicationType: null,
    companyId: null,
    actionType: "DARI_REFRESH_TOKEN",
    ip: "10.11.1.39",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    userId: 115678,
    source: null,
    ownerId: null,
    logInfo: null,
    creationTimestamp: "2022-01-31 17:51:01",
  },
];

describe("Table", () => {
  beforeEach(() => {
    render(<TableComponent tableData={mockData} />);
  });

  it("should check all columnheader", () => {
    expect(
      screen.getByRole("columnheader", { name: /log id/i })
    ).toBeInTheDocument();
    expect;
    expect(
      screen.getByRole("columnheader", { name: /application id/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /application type/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /action type/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /date : time/i })
    ).toBeInTheDocument();
  });

  it("should check row values", () => {
    expect(
      screen.getByRole("row", {
        name: /365001413757985 - - DARI_REFRESH_TOKEN 2022-01-31 17:51:01/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: /906468196730134 - - DARI_REFRESH_TOKEN 2022-01-31 17:29:00/i,
      })
    ).toBeInTheDocument();
    // expect(screen.getByRole("hhjdgjhsgd"));
  });

  it("should check sorting", () => {
    const logIdSortingButton = screen.getByRole("button", {
      name: /log id/i,
    });
    const ascRows = screen.getAllByRole("row");
    expect(ascRows[1].textContent).toBe(
      "365001413757985--DARI_REFRESH_TOKEN2022-01-31 17:51:01"
    );
    expect(ascRows[2].textContent).toBe(
      "906468196730134--DARI_REFRESH_TOKEN2022-01-31 17:29:00"
    );
    userEvent.dblClick(logIdSortingButton);
    const dscRows = screen.getAllByRole("row");
    expect(dscRows[1].textContent).toBe(
      "906468196730134--DARI_REFRESH_TOKEN2022-01-31 17:29:00"
    );
    expect(dscRows[2].textContent).toBe(
      "365001413757985--DARI_REFRESH_TOKEN2022-01-31 17:51:01"
    );
  });

  it("must have the previous and next button in pagination section disabled", () => {
    expect(
      screen.getByRole("button", {
        name: /go to next page/i,
      })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: /go to previous page/i,
      })
    ).toBeDisabled();
  });
});
