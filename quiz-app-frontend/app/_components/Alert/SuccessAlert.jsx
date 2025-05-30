export default function SuccessAlert({message}){
    return (
        <div className="w-full text-white bg-green-500 mb-5">
            <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                <div className="flex">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                </svg>
        
                    <p className="mx-3">{message}</p>
                </div>
            </div>
        </div>
    );
}