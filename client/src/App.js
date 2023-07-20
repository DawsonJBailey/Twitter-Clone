import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Profile } from './pages/Profile/Profile';
import { Explore } from './pages/Explore/Explore';
import { SignIn } from './pages/SignIn/SignIn';
import { Navbar } from './components/Navbar/Navbar';
import { Error } from './pages/Error/Error';
import './App.css';

const Layout = () => {
  // Layout where there is a Top Navbar and Outlet
  // is the rest of the content shown and it depends
  // on the router below, displaying whatever element
  // is associated with the url path
  return(
    <div className="md:w-8/12 mx-auto">
      <Navbar />
      <Outlet></Outlet>
    </div>
  )
};

// Content shown for the outlet above depends on URL path matched
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signout",
        element: <SignIn />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
