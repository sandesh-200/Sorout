// import { GalleryVerticalEnd } from "lucide-react"

// import { SignupForm } from "@/components/auth/SignupForm"

// export default function SignupPage() {
//   return (
//     <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="flex flex-col gap-4 p-6 md:p-10">
//         <div className="flex justify-center gap-2 md:justify-start">
//           <a href="#" className="flex items-center gap-2 font-medium">
//             <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
//               <GalleryVerticalEnd className="size-4" />
//             </div>
//             Acme Inc.
//           </a>
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-xs">
//             <SignupForm />
//           </div>
//         </div>
//       </div>
//       <div className="relative hidden bg-muted lg:block">
//         <img
//           src="/images/signup_image.png"
//           alt="Image"
//           className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//         />
//       </div>
//     </div>
//   )
// }


import { SignupForm } from "@/components/auth/SignupForm"
import { Link } from "react-router-dom"

export default function SignupPage() {
  return (
    // Fixed viewport height + overflow-hidden prevents page scrollbars
    <div className="grid h-svh w-full overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col justify-between p-6 md:px-10 md:py-8">
        {/* TOP BRAND HEADER */}
        <div className="flex justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <img
              src="/images/logo.png"
              alt="Sorout Logo"
              className="size-8 object-contain"
            />
            <span className="text-xl">Sorout</span>
          </Link>
        </div>

        {/* CENTERED FORM CONTAINER */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </div>

        {/* BOTTOM EMPTY SPACER TO KEEP FORM PERFECTLY CENTERED */}
        <div className="hidden md:block" />
      </div>

      {/* RIGHT SIDE ILLUSTATION */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/signup_image.png"
          alt="Sorout AI Interview Platform"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}