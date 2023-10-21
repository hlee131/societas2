import { useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import { Link, redirect, useFetcher, useNavigate } from "react-router-dom"
import { Input, StyledInput } from "../components/inputs"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export default function Profile() {
  const { user } = useUser()

  // user.setProfileImage({
  //   file:
  // })

  if (!user) return <div>loading</div>

  return (
    <div className="flex w-full gap-6 flex-col">
      <div className="flex gap-6 items-center">
        <img
          src={user.imageUrl}
          alt={`Your profile picture`}
          className="rounded-full object-contain h-min"
          width={75}
          height={75}
        />
        <div className="flex flex-col">
          <h1 className="text-3xl font-medium">{user.fullName}</h1>
          <p>{user.unsafeMetadata.bio ?? "No bio"}</p>
        </div>
      </div>

      <h1 className="font-medium text-2xl">My Projects</h1>

      <Link
        to="edit"
        className="py-2 px-6 bg-blue-400 text-zinc-100 w-fit rounded-lg transition-colors hover:bg-blue-500"
      >
        Edit Profile
      </Link>
    </div>
  )
}

export function EditProfile() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [image, setImage] = useState("")
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(data) {
    console.log(data.image[0])
    await user.update({
      firstName: data.firstName,
      lastName: data.lastName,

      unsafeMetadata: {
        bio: data.bio,
      },
    })

    if (data.image[0]) {
      await user.setProfileImage({
        file: data.image[0],
      })
    }

    toast.success("updated successfully")
    navigate("/account")
  }

  useEffect(() => {
    if (!user) return
    setImage(user.imageUrl)
  }, [isLoaded])

  if (!isSignedIn) return <div>must be logged in</div>

  if (!user) return <div>loading</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 flex-col">
      <div className="relative w-fit">
        <img
          src={typeof image === "string" ? image : URL.createObjectURL(image)}
          alt=""
          className="rounded-full object-cover h-20 w-20"
          width={100}
          // height={50}
        />
        <label
          htmlFor="editImage"
          className="absolute -top-3 -right-3 text-sm bg-zinc-200 rounded-full p-1 flex justify-center items-center cursor-pointer hover:bg-zinc-400 transition-colors "
        >
          <span className="material-symbols-outlined">edit</span>
        </label>
      </div>
      <div className="flex gap-4">
        <Input>
          <label htmlFor="firstName">First Name</label>
          <StyledInput
            type="text"
            name="firstName"
            id="firstName"
            defaultValue={user.firstName}
            {...register("firstName")}
          />
        </Input>
        <Input>
          <label htmlFor="lastName">Last Name</label>
          <StyledInput
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={user.lastName}
            {...register("lastName")}
          />
        </Input>
      </div>
      <Input>
        <label htmlFor="bio">Biography</label>
        <StyledInput
          type="text"
          name="bio"
          id="bio"
          defaultValue={user.unsafeMetadata ? user.unsafeMetadata.bio : ""}
          placeholder="Biography"
          {...register("bio")}
        />
      </Input>

      <input
        type="file"
        id="editImage"
        className="hidden"
        accept="image/*"
        {...register("image", {
          onChange: (e) => {
            setImage(e.target.files[0])
          },
        })}
      />
      <button
        disabled={isSubmitting}
        className={`bg-blue-500 hover:bg-blue-600 transition-colors text-slate-100 px-4 py-2 rounded-lg mt-4 flex items-center justify-center min-w-[10rem] disabled:bg-blue-400`}
      >
        {isSubmitting ? "Updating" : "Update"}
      </button>
    </form>
  )
}