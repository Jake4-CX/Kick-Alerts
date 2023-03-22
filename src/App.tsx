import { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, Link, Outlet, RouterProvider } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { PageNotFound } from './views/PageNotFound'
import { UserAlert } from './views/UserAlert'
import { Toaster, useToasterStore, toast } from 'react-hot-toast';
import { Alerts } from './views/Alerts'
function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />}>
        <Route path='/alerts/:username/:user_id/:chatroom_id/:toast_limit/:chat_duration' element={<UserAlert />} />
        <Route path='/alerts/:username/:user_id/:chatroom_id/:toast_limit' element={<UserAlert />} />
        <Route path='/alerts/:username/:user_id/:chatroom_id' element={<UserAlert />} />
        <Route path='/alerts' element={<Alerts />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    )
  )

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
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
