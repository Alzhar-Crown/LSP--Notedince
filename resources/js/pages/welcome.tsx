import { type SharedData } from '@/types';
import Iridescence from '../components/Iridescence';
import { Head, Link, usePage } from '@inertiajs/react';
import SplashCursor from '../components/SplashCursor'
import AppLogo from '../components/app-logo';
import BlurText from "../components/BlurText";



export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    
const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                
            </Head>
            <div className="flex min-h-screen relative flex-row items-center  p-6 text-[#1b1b18] lg:justify-center z-0 lg:p-8">
                <Iridescence
                color={[1, 1, 1]}
                mouseReact={false}
                amplitude={0.1}
                speed={1.0}
                />
                <div className="mb-6 w-full gap-10 justify-center lg:gap-30 flex-col flex lg:flex-row items-center max-w-[335px] text-sm  lg:max-w-4xl">
                    <div className="flex flex-row w-fit items-center justify-center gap-2">
                        <div className="flex flex-col gap-4">

                    <h1 className='text-3xl w-fit font-medium text-black'   style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.6)' }}>Notedince</h1>
                    <BlurText
                        text  ="Make All Simple"
                        delay={500}
                        animateBy="words"
                        direction="top"
                        onAnimationComplete={handleAnimationComplete}
                        className="text-2xl  font-medium text-black p-2 border border-gray-300 rounded-sm backdrop-blur-xl "
                        />

                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block transition-all duration-300 shadow-md shadow-gray-400  backdrop-blur-lg bg-opacity-5 w-fit h-fit rounded-sm p-2 border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-black hover:translate-y-1.5 "
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block transition-all duration-300 shadow-md shadow-gray-400  backdrop-blur-lg bg-opacity-5 w-fit h-fit rounded-sm p-2 border border-transparent px-5 py-1.5 text-sm leading-normal text-black hover:translate-y-1.5 "
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block transition-all duration-300 shadow-md shadow-gray-400  backdrop-blur-lg bg-opacity-5 w-fit h-fit rounded-sm p-2 border border-transparent  px-5 py-1.5 text-sm leading-normal text-black hover:translate-y-1.5  "
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
               
                                
            </div>
        </>
    );
}
