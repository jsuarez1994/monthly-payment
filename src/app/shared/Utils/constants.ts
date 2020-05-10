// SWEET ALERT
import { SweetAlertIcon } from 'sweetalert2';

export class Constants {

    /********** PATTERNS **********/
    public static PASSWORD_PATTERN = '[A-Z]{1}[a-zA-Z]+[\d]+$';
    public static DOCUMENT_PATTERN = '[0-9]{8}[A-Za-z]{1}';


    /********** SWEETALERT ICONS **********/
    public static ICON_SUCCESS: SweetAlertIcon = 'success';
    public static ICON_ERROR: SweetAlertIcon = 'error';
    public static ICON_WARNING: SweetAlertIcon = 'warning';
    public static ICON_INFO: SweetAlertIcon = 'info';
    public static ICON_QUESTION: SweetAlertIcon = 'question';

    /********** PATHS **********/
    public static NOT_FOUND_PATH = '**';
    public static LOGIN_PATH = 'login';
    public static REGISTER_PATH = 'register';
    public static DASHBOARD_PATH = '';
    public static PAYMENTS_STATISTICS_PATH = 'statistics';
    public static ADD_PAYMENTS_PATH = 'add-payments';
    public static UPDATE_PAYMENTS_PATH = 'update-payments/:uid';
    public static HISTORY_PAYMENT_PATH = 'history-payments/:description';
    public static ADD_CATEGORIES_PATH = 'add-categories';
    public static UPDATE_CATEGORIES_PATH = 'update-categories/:uid';
    public static CATEGORIES_PATH = 'categories';
    public static CONFIG_USER_PATH = 'config-user';
    public static RESET_PASSWORD_PATH = 'reset-password';

    public static BASE_PATH = 'http://localhost:4200/';
    // public static BASE_PATH = 'http://localhost:4200/'; BASE PRODUCTION
}
