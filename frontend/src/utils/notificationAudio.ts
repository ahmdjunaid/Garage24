import toast from "react-hot-toast"
import errorAudio from "@assets/audio/notification.mp3"
import successAudio from "@assets/audio/suceessAudio.mp3"

const playError = () => {
    const audio = new Audio(errorAudio)
    audio.play()
}

const playSuccess = () => {
    const audio = new Audio(successAudio)
    audio.play()
}

export const errorToast = (message:string)=>{
    toast.error(message)
    playError()
}

export const successToast = (message:string)=>{
    toast.success(message)
    playSuccess()
}