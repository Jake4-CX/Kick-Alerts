import { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, Link, Outlet, RouterProvider } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { PageNotFound } from './views/PageNotFound'
import { UserAlert } from './views/UserAlert'
import { Toaster, useToasterStore, toast } from 'react-hot-toast';
import { Alerts } from './views/Alerts'
import { ToastContainer } from 'react-toastify'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />}>
        <Route path='/alerts/:username/:user_id/:chatroom_id' element={<UserAlert />} />
        <Route path='/alerts' element={<Alerts />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    )
  )

  const { toasts } = useToasterStore();

  const TOAST_LIMIT = 12

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
      <ToastContainer />
    </div>
  )

}

const Root = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default App
