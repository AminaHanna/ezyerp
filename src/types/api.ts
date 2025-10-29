// API Response Types
export interface LoginResponse {
  flag: boolean;
  msg: string;
  employee?: {
    userid?: string;
    employeeid?: string;
    status?: string;
    employee_name?: string;
    address?: string;
    dob?: string;
    gender?: string;
    mobileno?: string;
    whatsappno?: string;
    emailid?: string;
    join_date?: string;
    photo?: string | null;
    usertypeid?: string;
    employee_status?: string;
    officeid?: string;
    gstno?: string;
    officename?: string;
    office_address?: string;
    pincode?: string;
    state_name?: string;
    state_code?: string;
    tin_no?: string;
    country_name?: string;
    country_code?: string;
    location?: string;
    office_mobileno?: string;
    office_emailid?: string;
    website?: string | null;
    logo?: string | null;
    officetypeid?: string;
    officetype?: string;
    usertype?: string;
    username?: string;
    country_id?: string;
    state_id?: string;
    fssai?: string | null;
    off_status?: string;
    financialyearid?: string;
    financialyear?: string;
    fystartdate?: string;
    fyeenddate?: string;
    fystatus?: string;
    image_url?: string;
    // Legacy fields for backward compatibility
    empid?: string;
    empname?: string;
    officecode?: string;
    token?: string;
    sessionid?: string;
  };
  error?: string;
}

export interface Customer {
  // Primary identifiers
  customerid: string;
  account_id: string;
  chartofaccountid: string;
  cust_balid: string;
  customeraccountid: string;

  // Names and contact
  customer_name: string;
  account_name: string;
  contact_person?: string;

  // Address and location
  address?: string;
  place?: string;
  area_name?: string;
  areaid?: string;
  areas?: string;
  state_id?: string;

  // Contact information
  mobileno?: string;
  emailid?: string;
  whatsappno?: string;

  // Financial information
  amount?: string | number;
  ca_amount?: string | number;
  currbalance?: string | number;

  // Additional fields
  employeeid?: string;
  status?: string;
  join_date?: string;
  openinginv?: string;
  ourbranch?: string;
  refno?: string | null;
  remarks?: string;
  gender?: string;
  gstno?: string;
  latitude?: number | null;
  longitude?: number | null;
  chartofaccount_bal_id?: string;

  // Legacy fields for backward compatibility
  id?: string;
  name?: string;
  day?: string;
  balance?: number;
  officeid?: string;
  officecode?: string;
}

export interface CustomersResponse {
  flag: boolean;
  msg: string;
  customers?: Customer[];
  error?: string;
}

export interface SalesItem {
  id: string;
  productId: string;
  productname: string;
  price: number;
  barcode?: string;
}

export interface SalesItemsResponse {
  flag: boolean;
  msg: string;
  items?: SalesItem[];
  error?: string;
}

export interface Collection {
  receiptid?: string;
  rdate?: string;
  customer_id?: string;
  project_id?: string | null;
  daccount_id?: string;
  caccount_id?: string;
  amount?: string | number;
  payment?: string;
  chequeno?: string;
  chequedate?: string;
  voucher_typeid?: string;
  remarks?: string;
  account_name?: string;
  acc_name?: string;
  customer_name?: string;
  mobileno?: string;
  whatsappno?: string;
  msg?: string;
  flag?: boolean;

  // Legacy/fallback fields
  id?: string;
  date?: string;
  customerid?: string;
  customername?: string;
}

export interface CollectionsResponse {
  flag: boolean;
  msg: string;
  collections?: Collection[];
  error?: string;
}

export interface Stock {
  id?: string;
  productname?: string;
  quantity?: number;
  stockqty?: number | string; // API returns stockqty field
  price?: number;
  mrp?: number;
  rate?: number;
  brand?: string;
  category?: string;
  status?: string;
  [key: string]: any; // Allow additional fields from API
}

export interface StocksResponse {
  flag: boolean;
  msg: string;
  stocks?: Stock[];
  error?: string;
}

export interface Receipt {
  id: string;
  amount: number;
  date: string;
  customerid: string;
  paymentmethod: string;
}

export interface ReceiptsResponse {
  flag: boolean;
  msg: string;
  receipts?: Receipt[];
  error?: string;
}

export interface FinancialYear {
  id: string;
  name: string;
  startdate: string;
  enddate: string;
}

export interface FinancialYearsResponse {
  flag: boolean;
  msg: string;
  years?: FinancialYear[];
  error?: string;
}

export interface Area {
  // Primary fields
  id?: string;
  name?: string;
  code?: string;

  // Alternative field names that might be in API response
  areaid?: string;
  areaname?: string;
  area_id?: string;
  area_name?: string;
  area_code?: string;

  // Legacy/flexible fields
  [key: string]: any;
}

export interface AreasResponse {
  flag: boolean;
  msg: string;
  areas?: Area[];
  data?: Area[];
  error?: string;
}

export interface Employee {
  id: string;
  name: string;
  code: string;
  designation: string;
}

export interface EmployeesResponse {
  flag: boolean;
  msg: string;
  employees?: Employee[];
  error?: string;
}

export interface CustomerStatement {
  // Primary identifiers - ACTUAL API FIELD NAMES
  expincId?: string;
  id?: string;
  transactionid?: string;
  voucherid?: string;

  // Date and type - ACTUAL API FIELD NAMES
  pur_date?: string;
  date?: string;
  transactiondate?: string;
  voucherdate?: string;

  // Description and type - ACTUAL API FIELD NAMES
  alltype?: string;
  alltypes?: string;
  pinvtype?: string;
  description?: string;
  type?: string;
  vouchertype?: string;
  narration?: string;

  // Financial amounts - ACTUAL API FIELD NAMES
  incout?: number | string;  // Debit/Income Out
  expin?: number | string;   // Credit/Expense In
  incout1?: number | string; // Alternative debit
  incin1?: number | string;  // Alternative credit
  expout?: number | string;  // Alternative debit
  ob?: number | string;      // Opening Balance
  debit?: number | string;
  credit?: number | string;
  balance?: number | string;
  amount?: number | string;

  // Additional fields that might be in response
  customer_name?: string;
  invoice?: string;
  pinvoice?: string;
  chequeno?: string;
  ch_date?: string;
  reference?: string;
  paymentmethod?: string;
  remarks?: string;
  status?: string;

  // Legacy/flexible fields
  [key: string]: any;
}

export interface CustomerStatementResponse {
  flag: boolean;
  msg: string;
  statement?: CustomerStatement[];
  statements?: CustomerStatement[];
  data?: CustomerStatement[];
  error?: string;
}

export interface CreditAgingReport {
  customerid: string;
  customername: string;
  outstanding: number;
  days: number;
  category: string;
}

export interface CreditAgingResponse {
  flag: boolean;
  msg: string;
  report?: CreditAgingReport[];
  error?: string;
}

// Dashboard Summary Types
export interface DashboardSummary {
  totalcollected?: number | string;
  receiptamount?: number | string;
  chequeamount?: number | string;
  collectionamt?: number | string;
  collectionrpamt?: number | string;
  collectioncqamt?: number | string;
  receiptamt?: number | string;
  pdcamt?: number | string;
  [key: string]: any;
}

export interface RecentCollection {
  collectionid?: string | number;
  collectionamt?: number | string;
  amount?: number | string; // Added to support API response field
  collectiontype?: string;
  collectionstatus?: string;
  collectiondate?: string;
  collection_date?: string; // Added to support API response field
  receiptno?: string;
  chequeno?: string;
  ch_date?: string; // Added to support API response field
  payment?: string; // Added to support API response field
  customer_name?: string;
  customername?: string;
  [key: string]: any;
}

export interface DashboardResponse {
  flag: boolean;
  msg: string;
  summary?: DashboardSummary;
  data?: DashboardSummary;
  userdashboard?: DashboardSummary;
  recentcollection?: RecentCollection[];
  error?: string;
}

// Auth Context Types
export interface AuthUser {
  userid: string;
  username: string;
  officeid: string;
  officecode?: string;
  employee_name?: string;
  officename?: string;
  location?: string;
  usertype?: string;
  office_address?: string;
  office_mobileno?: string;
  office_emailid?: string;
  state_name?: string;
  financialyear?: string;
  image_url?: string;
  token?: string;
  sessionid?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string, officecode: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// API Request Types
export interface LoginRequest {
  username: string;
  password: string;
  officecode: string;
}

export interface CustomersRequest {
  officeid: string;
  officecode: string;
  financialyearid: string;
  empid: string;
}

export interface CollectionsRequest {
  officecode: string;
  officeid: string;
  empid: string;
  financialyearid: string;
  sdate: string;
  edate: string;
}

export interface StocksRequest {
  officecode: string;
  officeid: string;
  financialyearid: string;
}

export interface ReceiptsRequest {
  officecode: string;
  officeid: string;
  financialyearid: string;
}

