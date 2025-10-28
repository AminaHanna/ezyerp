import { apiClient } from "./api";
import {
  LoginResponse,
  CustomersResponse,
  SalesItemsResponse,
  CollectionsResponse,
  StocksResponse,
  ReceiptsResponse,
  FinancialYearsResponse,
  AreasResponse,
  EmployeesResponse,
  CustomerStatementResponse,
  CreditAgingResponse,
  LoginRequest,
  CustomersRequest,
  CollectionsRequest,
  StocksRequest,
  ReceiptsRequest,
} from "@/types/api";

// Authentication
export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("login.php", {
      username: credentials.username,
      password: credentials.password,
      officecode: credentials.officecode,
    });
  },

  async changePassword(
    username: string,
    password: string,
    officecode: string,
    officeid: string
  ): Promise<any> {
    return apiClient.post("changepassword.php", {
      username,
      password,
      officecode,
      officeid,
    });
  },
};

// Sales
export const salesService = {
  async getCustomers(request: CustomersRequest): Promise<CustomersResponse> {
    return apiClient.post<CustomersResponse>("customers.php", request);
  },

  async getSalesItems(
    officeid: string,
    officecode: string,
    financialyearid: string,
    column: string = "0",
    barcode: string = ""
  ): Promise<SalesItemsResponse> {
    return apiClient.post<SalesItemsResponse>("salesitems.php", {
      officeid,
      officecode,
      financialyearid,
      column,
      barcode,
    });
  },

  async getCustomerBrandDiscount(
    officeid: string,
    officecode: string,
    customerid: string,
    brandid: string
  ): Promise<any> {
    return apiClient.post("customerbranddiscount.php", {
      officeid,
      officecode,
      customerid,
      brandid,
    });
  },

  async getSalesAccounts(
    officecode: string,
    officeid: string,
    financialyearid: string
  ): Promise<any> {
    return apiClient.post("salesaccounts.php", {
      officecode,
      officeid,
      financialyearid,
    });
  },

  async getPriceTypes(
    officecode: string,
    officeid: string,
    financialyearid: string
  ): Promise<any> {
    return apiClient.post("PriceType.php", {
      officecode,
      officeid,
      financialyearid,
    });
  },

  async createNewSale(data: any): Promise<any> {
    return apiClient.post("newsales.php", data);
  },
};

// Collections (formerly Receipts)
export const collectionsService = {
  async getCollections(request: CollectionsRequest): Promise<CollectionsResponse> {
    return apiClient.post<CollectionsResponse>("collections.php", request);
  },

  async createNewCollection(data: any): Promise<any> {
    return apiClient.post("newcollection.php", data);
  },
};

// Legacy alias for backward compatibility
export const receiptsService = collectionsService;

// Master Data
export const masterService = {
  async getFinancialYears(
    officecode: string,
    officeid: string,
    employeeid: string,
    usertypeid: string
  ): Promise<FinancialYearsResponse> {
    return apiClient.post<FinancialYearsResponse>("financialyears.php", {
      officecode,
      officeid,
      employeeid,
      usertypeid,
    });
  },

  async getAreas(officecode: string, officeid: string): Promise<AreasResponse> {
    return apiClient.post<AreasResponse>("areas.php", {
      officecode,
      officeid,
    });
  },

  async getEmployees(
    officecode: string,
    officeid: string,
    financialyearid: string
  ): Promise<EmployeesResponse> {
    return apiClient.post<EmployeesResponse>("salesman.php", {
      officecode,
      officeid,
      financialyearid,
    });
  },

  async getCounterList(
    officecode: string,
    officeid: string,
    employeeid: string,
    usertypeid: string
  ): Promise<any> {
    return apiClient.post("counterlist.php", {
      officecode,
      officeid,
      employeeid,
      usertypeid,
    });
  },

  async getCommonPrivileges(officecode: string, officeid: string): Promise<any> {
    return apiClient.post("commonprivileges.php", {
      officecode,
      officeid,
    });
  },

  async getNewUnit(officecode: string, officeid: string): Promise<any> {
    return apiClient.post("newunit.php", {
      officecode,
      officeid,
    });
  },
};

// Reports
export const reportsService = {
  async getCustomerStatement(
    officecode: string,
    officeid: string,
    customerid: string,
    financialyearid: string,
    sdate: string,
    edate: string
  ): Promise<CustomerStatementResponse> {
    return apiClient.post<CustomerStatementResponse>("customerstatement.php", {
      officecode,
      officeid,
      customerid,
      financialyearid,
      sdate,
      edate,
    });
  },

  async getCreditAgingReport(
    officecode: string,
    officeid: string,
    customerid: string,
    financialyearid: string,
    noofdays?: string,
    condition?: string
  ): Promise<CreditAgingResponse> {
    return apiClient.post<CreditAgingResponse>("creditagingreport.php", {
      officecode,
      officeid,
      customerid,
      financialyearid,
      noofdays,
      condition,
    });
  },

  async getStocks(request: StocksRequest): Promise<StocksResponse> {
    return apiClient.post<StocksResponse>("stocks.php", request);
  },

  async getUserDashboard(
    officecode: string,
    officeid: string,
    financialyearid: string,
    empid: string,
    sdate: string,
    edate: string
  ): Promise<any> {
    return apiClient.post("userdashbord.php", {
      officecode,
      officeid,
      financialyearid,
      empid,
      sdate,
      edate,
    });
  },
};

