import { toast } from 'react-toastify'

function showAlertNotification(message, success) {
  if (success) {            
    return toast.success(message);
  } else {
    return toast.error(message);
  }
}

function showAxiosErrorAlert(error) {
  let message = 'Something went wrong'

  if (error && error.response) {
    message = error.response.data?.message ?? message
  } else {
    message = error.toString()
  }

  toast.error(message)
}

const notification = {
  showAlertNotification,
  showAxiosErrorAlert
}

export default notification
