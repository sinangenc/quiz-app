export default function loading(){
    return (
        <div className="flex flex-col items-center justify-center pt-24 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <p className="text-gray-500">Loading...</p>
        </div>   
    )
}