import { useNavigate } from "react-router-dom"

export const PageNotFound = (props: any) => {

  const navigate = useNavigate()

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-theme-gray-slate">
        <main className='rounded-t-2xl rounded-b-md bg-white mx-auto p-8 md:pt-12 shadow-2xl w-11/12 max-w-lg'>
          <section className="text-center">
            <h1 className="text-7xl font-bold">404</h1>
            <h3 className='text-2xl font-bold'>Page Not Found</h3>
            <p className='text-gray-500 pt-2'>The page you are looking for does not exist.</p>
            <button onClick={() => navigate('/')} className='w-full block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 mt-4'>Go back to home</button>
          </section>
        </main>
      </div>
    </>
  )
}