import Swal, { SweetAlertIcon } from 'sweetalert2';

export function showMessage(title: string, message:string, type:SweetAlertIcon) {
    Swal.fire(title, message, type);
}