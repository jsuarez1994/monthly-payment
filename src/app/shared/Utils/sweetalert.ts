import Swal, { SweetAlertIcon } from 'sweetalert2';
// CONSTANTS
import { Constants } from './constants';

export function showMessage(
  title: string,
  message: string,
  type: SweetAlertIcon
) {
  Swal.fire(title, message, type);
}

/**
 * Show a toast message tipe
 * @param message
 * @param icon
 */
export function toastMessage(message: string, icon: SweetAlertIcon) {
  Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  }).fire({
    icon: icon,
    title: message,
  });
}

export function modalAction(map: Map<string, string>, object, service) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: map.get('title'),
      text: map.get('message'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: map.get('textButtonYes'),
      cancelButtonText: map.get('textButtonNo'),
      reverseButtons: true,
    })
    .then((result) => {
      if (result.value) {
        // ONLY FOR METHODS SIMPLE
        service(object);

        swalWithBootstrapButtons.fire(
          map.get('titleOpSuccess'),
          map.get('messageOpSuccess'),
          Constants.ICON_SUCCESS
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          map.get('titleOpCanceled'),
          map.get('messageOpCanceled'),
          Constants.ICON_ERROR
        );
      }
    });
}
