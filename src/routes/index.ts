/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */


/**
 * `loader` runs before the route renders.
 *
 * It's for reading data — fetching whatever the page needs.
 * React Router calls it when the user navigates to the route, waits for it to resolve,
 * then renders the component with the data ready.
 */

export { default as ErrorPage } from './ErrorPage'


// pages
export { default as DashBoard,    loader as dashboardLoader  } from './DashBoardPage'
export { default as LoginPage,    loader as LoginLoader,    action as LoginAction    } from './LoginPage'
export { default as LandingPage,  loader as LandingLoader,  action as LandingAction  } from './HomePage'
export { default as RegisterPage, loader as registerLoader, action as registerAction } from './RegisterPage'
