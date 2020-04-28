import Swal, { SweetAlertIcon } from 'sweetalert2';

export function showMessage(title: string, message:string, type:SweetAlertIcon) {
    Swal.fire(title, message, type);
}

/**
 * Show a toast message tipe
 * @param message 
 * @param icon 
 */
export function toastMessage(message: string, icon:SweetAlertIcon) {
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }).fire({
        icon: icon,
        title: message
      })
}
