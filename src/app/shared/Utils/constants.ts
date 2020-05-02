// SWEET ALERT
import { SweetAlertIcon } from 'sweetalert2';

export class Constants {

    /********** PATTERNS **********/
    public static PASSWORD_PATTERN:string = '[A-Z]{1}[a-zA-Z]+[\d]+$';
    public static DOCUMENT_PATTERN:string = '[0-9]{8}[A-Za-z]{1}';


    /********** SWEETALERT ICONS **********/
    public static ICON_SUCCESS: SweetAlertIcon = 'success';
    public static ICON_ERROR: SweetAlertIcon = 'error';
    public static ICON_WARNING: SweetAlertIcon = 'warning';
    public static ICON_INFO: SweetAlertIcon = 'info';
    public static ICON_QUESTION: SweetAlertIcon = 'question';

    /********** PATHS **********/
    public static NOT_FOUND_PATH:string = '**';
    public static LOGIN_PATH:string = 'login';
    public static REGISTER_PATH:string = 'register';
    public static DASHBOARD_PATH:string = '';
    public static PAYMENTS_STATISTICS_PATH:string = 'statistics';
    public static ADD_PAYMENTS_PATH:string = 'add-payments';
    public static UPDATE_PAYMENTS_PATH:string = 'update-payments/:uid';
    public static HISTORY_PAYMENT_PATH:string = 'history-payments/:description';
    public static ADD_CATEGORIES_PATH:string = 'add-categories';
    public static UPDATE_CATEGORIES_PATH:string = 'update-categories/:uid';
    public static CATEGORIES_PATH:string = 'categories';
}