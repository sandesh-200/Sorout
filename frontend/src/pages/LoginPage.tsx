// import { LoginForm } from "@/components/auth/LoginForm"
// import { Link } from "react-router-dom"

// export default function LoginPage() {
//   return (
//     <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="flex flex-col gap-4 p-6 md:p-10">
//         <div className="flex justify-center gap-2 md:justify-start">
//           <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
//             <img
//               src="/images/logo.png"
//               alt="Sorout Logo"
//               className="size-9 object-contain mix-blend-multiply dark:mix-blend-normal"
//             />
//             <span className="text-xl">Sorout</span>
//           </Link>
//         </div>
//         <div className="flex flex-1 items-center justify-center py-6">
//           <div className="w-full max-w-sm">
//             <LoginForm />
//           </div>
//         </div>
//       </div>
//       <div className="relative hidden bg-muted lg:block">
//         <img
//           src="/images/login_image.png"
//           alt="Sorout AI Interview Platform"
//           className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6] mix-blend-multiply dark:mix-blend-normal"
//         />
//       </div>
//     </div>
//   )
// }


import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/shared/logo";
import { Link } from "react-router-dom";

export default function LoginPage() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link to="/">
						<Logo imgClassName="size-9" />
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center py-6">
					<div className="w-full max-w-sm">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<img
					alt="Sorout AI Interview Platform"
					className="absolute inset-0 h-full w-full object-cover mix-blend-multiply dark:brightness-[0.6] dark:mix-blend-normal"
					src="/images/login_image.png"
				/>
			</div>
		</div>
	);
}