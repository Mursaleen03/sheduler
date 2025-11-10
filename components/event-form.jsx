import { eventSchema } from "@/app/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "./ui/input"

const EventForm = () => {

    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues:{
            duration:30,
            isPrivate: true,
        }
    })
  return (
    <form>
        <div>
            <label htmlFor="title"
            className="block text-sm font-medium text-gray-700"
            >
                Event Title
            </label>

            <Input id='title' {...register("title")} className='mt-1' />
        </div>
    </form>
  )
}

export default EventForm
