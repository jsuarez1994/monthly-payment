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

}