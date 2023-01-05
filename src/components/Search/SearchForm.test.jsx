import {
  render,
  screen,
  cleanup,
  waitForElement,
  getAllByRole,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "./SearchForm";

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

const mockFormData = {
  logId: "",
  applicationId: "",
  applicationType: null,
  actionType: null,
  fromDate: null,
  toDate: null,
};

const mockFilterSearch = "";

const mockDispatchForm = "";

describe("Search Form", () => {
  beforeEach(() => {
    render(
      <SearchForm
        formData={mockFormData}
        dispatchForm={mockDispatchForm}
        filterSearch={mockFilterSearch}
        tableData={mockData}
      />
    );
  });

  it("should check all the inputs", () => {
    expect(
      screen.getByRole("textbox", { name: /log id/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /application id/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /from date/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /to date/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /application type/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /action type/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });
});
