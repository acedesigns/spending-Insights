/* =======================================================
 *
 * Created by anele on 02/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Outlet, redirect } from 'react-router-dom'

/** Pathless layout for guest-only routes (login, register).
 *  Redirects authenticated users away to the dashboard. */

export async function loader() {
    // TODO: replace with real session/token check
    const user = null
    if (user) return redirect('/dashboard')
    return null
}

export default function AuthLayout() {
    return <Outlet />
}
