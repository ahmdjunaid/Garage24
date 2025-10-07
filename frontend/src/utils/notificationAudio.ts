import toast from "react-hot-toast"
import notification from "../assets/audio/notification.mp3"

const playNotification = () => {
    const audio = new Audio(notification)
    audio.play()
}

export const errorToast = (message:string)=>{
    toast.error(message)
    playNotification()
}

export const successToast = (message:string)=>{
    toast.success(message)
    playNotification()
}