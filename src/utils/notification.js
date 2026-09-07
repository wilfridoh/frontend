import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const Notify = (message, type) => {
  switch (type) {
    case 'Success':
      toast.success(message, {
        autoClose: 2000
      })
      break
    case 'Error':
      toast.error(message, {
        autoClose: 2000
      })
      break
    case 'info':
      toast.error(message, {
        autoClose: 2000
      })
      break
    default:
      toast.info(message)
      break
  }
}
