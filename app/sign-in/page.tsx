export default function SignIn() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            {/* Main container */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-slate-900 bg-opacity-50 backdrop-blur-lg rounded-2xl border border-purple-500 border-opacity-30 shadow-2xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                            Welcome
                        </h1>
                        <p className="text-purple-300 text-sm">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300 placeholder-opacity-50 focus:outline-none focus:border-purple-500 focus:border-opacity-100 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition duration-300"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300 placeholder-opacity-50 focus:outline-none focus:border-purple-500 focus:border-opacity-100 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition duration-300"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded bg-slate-800 border-purple-500 border-opacity-30 text-purple-600 cursor-pointer"
                                />
                                <span className="ml-2 text-purple-300">Remember me</span>
                            </label>
                            <a href="#" className="text-purple-400 hover:text-purple-300 transition duration-300">
                                Forgot password?
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-purple-500 border-opacity-30"></div>
                        <span className="px-2 text-xs text-purple-400">OR</span>
                        <div className="flex-1 border-t border-purple-500 border-opacity-30"></div>
                    </div>

                    {/* Social Login Buttsons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-2 px-4 bg-slate-800 border border-purple-500 border-opacity-20 rounded-lg text-white hover:border-purple-500 hover:border-opacity-50 transition duration-300">
                            Google
                        </button>
                        <button className="py-2 px-4 bg-slate-800 border border-purple-500 border-opacity-20 rounded-lg text-white hover:border-purple-500 hover:border-opacity-50 transition duration-300">
                            GitHub
                        </button>
                    </div>
                    


                    {/* Sign Up Link */}
                    <p className="text-center text-purple-300 text-sm mt-6">Dont have an account?{" "}
                        <a href="#" className="text-purple-400 font-semibold hover:text-purple-300 transition duration-300">
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
